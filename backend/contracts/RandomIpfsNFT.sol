// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/vrf/VRFConsumerBaseV2.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

error RandomIpfsNft__AlreadyInitialized();
error RandomIpfsNft__NeedMoreETHSent();
error RandomIpfsNft__RangeOutOfBounds();
error RandomIpfsNft__TransferFailed();

contract RandomIpfsNFT is VRFConsumerBaseV2, ERC721URIStorage, Ownable {
    // when we mint an NFT, we will trigger a ChainLink VRF call to get us a random number
    // using that number, we will get a random NFT
    // 3 type of NFT: Pug, Shiba Inu, St. bernard (图片)
    // add level on these 3, like Pug: super rare, Shiba: sort of rare, st.bernard: common

    // Types
    enum Breed {
        PUG,
        SHIBA_INU,
        ST_BERNARD
    }

    // chainlink VRF variables
    VRFCoordinatorV2Interface private immutable i_vrfCoordinator;
    bytes32 private immutable i_gasLane; //the maximum gas price you are willing to pay for a request
    uint64 private immutable i_subscriptionID; // contract uses for making request to VRF
    uint32 private immutable i_callbackGasLimit; //// set the limit for how much computation are fulfilled random words can be
    uint16 private constant REQUEST_CONFIRMATIONS = 3;
    uint32 private constant NUM_WORDS = 1;

    // VRF helpers
    mapping(uint256 => address) public s_requestIdToSender;

    // Events
    event NftRequested(uint256 indexed requestId, address indexed requester);
    event NftMinted(Breed breed, address minter);

    // NFT variables
    uint256 public s_tokenCounter;
    uint256 internal constant MAX_CHANCE_VALUE = 100;
    string[] internal s_dogTokenUris;
    uint256 internal i_mintFee;

    constructor(
        address vrfCoordinatorV2, // contract, so we need to deploy a mocks
        bytes32 gasLane,
        uint64 subscriptionID,
        uint32 callbackGasLimit,
        string[3] memory dogTokenUris,
        uint256 mintFee
    )
        VRFConsumerBaseV2(vrfCoordinatorV2)
        ERC721("Random IPFS NFT", "RIN")
        Ownable(vrfCoordinatorV2)
    {
        i_vrfCoordinator = VRFCoordinatorV2Interface(vrfCoordinatorV2);
        i_gasLane = gasLane;
        i_subscriptionID = subscriptionID;
        i_callbackGasLimit = callbackGasLimit;
        // set how our nft should look like
        s_dogTokenUris = dogTokenUris;
        i_mintFee = mintFee;
    }

    // user have to pay to mint an NFT

    // the onwer of contract can withdraw the ETH

    // need to kick off a chainLinkVrf request
    function requestNft() public payable returns (uint256 requestId) {
        // Pay some mintfee to mint NFT
        if (msg.value < i_mintFee) {
            revert RandomIpfsNft__NeedMoreETHSent();
        }
        requestId = i_vrfCoordinator.requestRandomWords(
            i_gasLane,
            i_subscriptionID,
            REQUEST_CONFIRMATIONS,
            i_callbackGasLimit,
            NUM_WORDS
        );
        emit NftRequested(requestId, msg.sender);
        // create a mapping between people who call the requestNft and requestId
        // so when we fulfillRandomWords we properly assign the dogs to them
        s_requestIdToSender[requestId] = msg.sender;
        return requestId;
    }

    function withdraw() public onlyOwner {
        uint256 amount = address(this).balance;
        (bool callSuccess, ) = payable(msg.sender).call{value: amount}("");
        if (!callSuccess) {
            revert RandomIpfsNft__TransferFailed();
        }
    }

    // response to the requestNft, called by chainlink VRF
    function fulfillRandomWords(
        uint256 requestId,
        uint256[] memory randomWords
    ) internal override {
        // connect the requestId with the dogowner
        address dogOwner = s_requestIdToSender[requestId];
        uint256 newTokenId = s_tokenCounter;
        // What does this token look like?
        uint256 moddedRng = randomWords[0] % MAX_CHANCE_VALUE;
        // The value will always be between 0-99 because it's module of 100
        // 7 -> PUG
        // 88 -> St.bernard
        // 15 -> Shiba
        Breed dogBreed = getBreedFromModdedRng(moddedRng);
        s_tokenCounter += 1;
        _safeMint(dogOwner, newTokenId);
        _setTokenURI(
            newTokenId,
            // casting dogbreed into uint256 to get the index
            s_dogTokenUris[uint256(dogBreed)] /* That breed's tokenURI */
        );
        emit NftMinted(dogBreed, dogOwner);
    }

    function getBreedFromModdedRng(
        uint256 moddedRng
    ) public pure returns (Breed) {
        uint256 cumulativeSum = 0;
        uint256[3] memory chanceArray = getChanceArray();
        for (uint256 i = 0; i < chanceArray.length; i++) {
            // Pug = 0 - 9  (10%)
            // Shiba-inu = 10 - 39  (30%)
            // St. Bernard = 40 = 99 (60%)
            if (moddedRng >= cumulativeSum && moddedRng < chanceArray[i]) {
                return Breed(i);
            }
            cumulativeSum = chanceArray[i];
        }
        revert RandomIpfsNft__RangeOutOfBounds();
    }

    function getChanceArray() public pure returns (uint256[3] memory) {
        return [10, 30, MAX_CHANCE_VALUE];
    }

    function getMintFee() public view returns (uint256) {
        return i_mintFee;
    }

    function getDogTokenUris(
        uint256 index
    ) public view returns (string memory) {
        return s_dogTokenUris[index];
    }

    function getTokenCounter() public view returns (uint256) {
        return s_tokenCounter;
    }
}
