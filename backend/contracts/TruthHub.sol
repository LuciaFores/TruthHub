// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

/// Address library provides utilities for working with addresses
import "@openzeppelin/contracts/utils/Address.sol";
/// Enumerable set is used to have efficient structure "stack-like"
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
/// import openzeppelin math
import "@openzeppelin/contracts/utils/math/Math.sol";
/// Import the ERC1155 Receiver Interface
import "@openzeppelin/contracts/token/ERC1155/IERC1155Receiver.sol";
/// Import the Veri Token
import "./VeriToken.sol";
/// Import the Article NFTs
import "./ArticleNFT.sol";

// SAMPLE VARIABLES VALUES:
// Ethereum Account -> 0x5B38Da6a701c568545dCfcB03FcB875f56beddC4
// Nostr Account -> 0x76c71aae3a491f1d9eec47cba17e229cda4113a0bbb6e6ae1776d7643e29cafa
// Event Id -> 0x7465737400000000000000000000000000000000000000000000000000000000
// 2 Veri Token -> 2000000000000000000

// NB
// After the deploy is necessary to transfer the ownership of the contracts of the tokens to TruthHub
// This must be done in the js deploy script

contract TruthHub is IERC1155Receiver {
    using Address for address;
    /// Using EnumerableSet for EnumerableSet.AddressSet type
    using EnumerableSet for EnumerableSet.AddressSet;
    /// Using UintSet for EnumerableSet.UintSet type
    using EnumerableSet for EnumerableSet.UintSet;

    /// *** CONTRACT VARIABLES *** ///

    /// Ether price needed to express a vote, it will be given back to
    /// either to the voter or the author of the article and it is weighted
    /// by the reputation
    uint256 public immutable etherVotePrice;

    /// Ether price needed to publish an article, it will be given
    /// back either to the author of the article or the voter and it is
    /// weighted by the reputation
    uint256 public immutable etherPublishPrice;

    /// Amount of platform tokens given per Ether spent
    uint256 public immutable multiplierVeriPerEther;

    /// Amount of platform tokens given per user purged
    uint256 public immutable amountVeriPerUserPurged;

    /// Minimum delay needed to consider a vote valid (4 days in terms of blocks)
    uint256 public immutable minimumBlockDelta;

    /// Max delay needed to consider a vote valid (7 days in terms of blocks)
    uint256 public immutable maximumBlockDelta;

    /// Total weight vote needed to consider an vote ended
    uint256 public immutable endWeightVote; // siccome devi moltiplicare tutto per 100 se ad esempio vuoi chiudere a 2 voti devi chiudere a 200

    /// Token price to mint an article NFT
    uint256 public immutable articleNFTMintInVeri;

    /// Ether price to buy an article NFT
    uint256 public immutable articleNFTBuyInEther;

    /// Mapping needed to register the correspondences between Ethereum accounts
    /// and Nostr accounts, it is used to check if a user is also an author
    /// It is a mapping(address ethereumAddress => bytes32 nostrAddress)
    mapping(address => bytes32) public authors;

    /// Mapping needed to register the correspondences between Nostr accounts
    /// and Ethereum accounts, it is used to check if a user is already registered as an author
    /// It is a mapping(bytes32 nostrAddress => address ethereumAddress)
    mapping(bytes32 => address) public nostrAccountToEthereumAccount;

    /// The following 2 mappings are used in order to have a possible different reputation as a reader and as an author

    /// Mapping needed to register the reputations of the readers
    /// It is a mapping(address ethereumAddress => uint8 reputation)
    mapping(address => uint8) internal readersReputations;

    /// Mapping needed to register the reputations of the authors
    /// It is a mapping(address ethereumAddress => uint8 reputation)
    mapping(address => uint8) internal authorsReputations;

    /// Variable needed to save the total number of articles published
    uint256 public totalArticles;

    /// Instance of the VeriToken contract
    VeriToken public immutable contractVeriToken;

    /// Istance of the ArticleNFT contract
    ArticleNFT public immutable contractArticleNFT;

    /// Struct used to represent an article
    struct Article {
        /// Progressive article id (can be useful for ERC1155)
        uint256 articleId;
        /// Nostr event id
        bytes32 eventId;
        // Ethereum address of the author
        address author;
        /// Totalizzatore dei voti pesati positivi espressi per l'articolo
        uint256 upvotes;
        /// Totalizzatore dei voti pesati negativi espressi per l'articolo
        uint256 downvotes;
        /// Ethers spent to publish the article
        uint256 etherSpentToPublish;
        /// Number of people who upvoted
        uint256 upvoters;
        /// Number of people who downvoted
        uint256 downvoters;
        /// Minimum amount of time, in terms of blocks, that must pass
        /// in order to consider a vote valid
        /// The formula is the following:
        /// minimum_block_threshold = current_block_height + 4 days
        uint256 minimumBlockThreshold;
        /// Maximum amount of time, in terms of blocks, that must pass
        /// in order to consider a vote valid
        /// The formula is the following:
        /// maximum_block_threshold = current_block_height + 7 days
        uint256 maximumBlockThreshold;
        // Amount of ethers spent in the upvotes
        uint256 ethersSpentInUpvotes;
        // Amount of ethers spent in the downvotes
        uint256 ethersSpentInDownvotes;
        // Amount of VERI spent in the upvotes
        uint256 veriSpentInUpvotes;
        // Amount of VERI spent in the downvotes
        uint256 veriSpentInDownvotes;
        /// Number of total weighted votes, it is a computable variable so it
        /// is not stored in the struct, the formula is the following:
        /// totalWeightVotes = upvotes + downvotes
    }

    /// Set of articles that has been voted by a user
    mapping(address => EnumerableSet.UintSet) internal addressToArticlesVoted;

    /// Set of articles that has been published by a user
    mapping(address => EnumerableSet.UintSet)
        internal addressToArticlesPublished;

    /// Set of upvoters' addresses
    mapping(uint256 => EnumerableSet.AddressSet)
        internal articleIdToUpvotersAddresses;

    /// Set of downvoters' addresses
    mapping(uint256 => EnumerableSet.AddressSet)
        internal articleIdToDownvotersAddresses;

    /// Ethers spent to upvote
    /// It is used to store how much an user has spent to upvote an article
    /// It is a mapping (address userEthereumAddress => uint256 etherSpentToUpvote)
    mapping(uint256 => mapping(address => uint256))
        internal articleIdToEtherSpentToUpvote;

    /// Ethers spent to downvote
    /// It is used to store how much an user has spent to downvote an article
    /// It is a mapping (address userEthereumAddress => uint256 etherSpentToDownvote)
    mapping(uint256 => mapping(address => uint256))
        internal articleIdToEtherSpentToDownvote;

    /// Veri spent to upvote
    /// It is used to store how many tokens an user has spent to upvote an article
    /// It is a mapping (address userEthereumAddress => uint256 veriSpentToUpvote)
    mapping(uint256 => mapping(address => uint256))
        internal articleIdToVeriSpentToUpvote;

    /// Veri spent to downvote
    /// It is used to store how many tokens an user has spent to downvote an article
    /// It is a mapping (address userEthereumAddress => uint256 veriSpentToDownvote)
    mapping(uint256 => mapping(address => uint256))
        internal articleIdToVeriSpentToDownvote;

    /// Mapping needed to register the articles
    /// It is needed to map the articleId of the article to the actual
    /// information about the article
    /// It is a mapping(uint256 articleId => Article article)
    mapping(uint256 => Article) public articles;

    /// The following two mappings may be useful or not, if they will never
    /// be used, delete them
    /// Mapping needed to register the correspondences between the eventIds
    /// and the articleIds
    /// It is a mapping(byte32 eventId => uint256 articleId)
    mapping(bytes32 => uint256) public eventIdToArticleId; // metti funzione che prende uint256 e restituisce byte32 sarebbe articleIdToEventId

    /// *** CONTRACT MODIFIERS *** ///
    /// The following modifier checks if the user that is signing the
    /// transaction is also an author; it checks the mapping authors
    modifier onlyAuthor() {
        require(authors[msg.sender] != 0, "You are not an author");
        _;
    }

    /// The following modifier checks if a vote is open; it checks if
    /// the current block height lower than the maximum and
    /// also if the number of active voters is less than the minimum number
    /// of votes needed to consider a vote valid
    modifier voteOpen(uint256 articleId) {
        require(
            (block.number <= articles[articleId].maximumBlockThreshold &&
                articles[articleId].upvotes + articles[articleId].downvotes <
                endWeightVote) ||
                (block.number < articles[articleId].minimumBlockThreshold),
            "Vote is closed"
        );
        _;
    }

    /// The following modifier checks if a vote is closed; it checks if
    /// the current block height is greater than the maximum or
    /// if the number of active voters is greater than the minimum number and the current block height is grater than the minimum
    modifier voteClosed(uint256 articleId) {
        require(
            (articles[articleId].upvotes + articles[articleId].downvotes >=
                endWeightVote &&
                block.number >= articles[articleId].minimumBlockThreshold) ||
                (block.number > articles[articleId].maximumBlockThreshold),
            "Vote is open"
        );
        _;
    }

    /// The following modifier checks if a user has already voted for an article
    /// It checks if the user has already spent ether to upvote or downvote an article
    modifier validVoter(uint256 articleId) {
        require(
            articleIdToEtherSpentToUpvote[articleId][msg.sender] == 0 &&
                articleIdToEtherSpentToDownvote[articleId][msg.sender] == 0,
            "You have already voted"
        );
        _;
    }

    modifier validClaimer(uint256 articleId) {
        // Check if the msg.sender is in the majority or if there is a tie between upvotes and downvotes
        require(
            articleIdToUpvotersAddresses[articleId].contains(msg.sender) ||
                articleIdToDownvotersAddresses[articleId].contains(msg.sender),
            "You did not vote"
        );
        // Majority -> upvotes
        if (articles[articleId].upvotes > articles[articleId].downvotes) {
            require(
                articleIdToUpvotersAddresses[articleId].contains(msg.sender),
                "You are not in the majority"
            );
        }
        // Majority -> downvotes
        else if (articles[articleId].upvotes < articles[articleId].downvotes) {
            require(
                articleIdToDownvotersAddresses[articleId].contains(
                    msg.sender
                ) && articles[articleId].author != msg.sender,
                "You are not in the majority"
            );
        }
        _;
    }

    modifier onlyBestAuthors() {
        require(
            authorsReputations[msg.sender] > 90,
            "Your author reputation is too low to access to this functionality"
        );
        _;
    }

    modifier onlyBestArticles(uint256 articleId) {
        require(
            (articles[articleId].upvotes + articles[articleId].downvotes >=
                endWeightVote &&
                block.number >= articles[articleId].minimumBlockThreshold) ||
                (block.number > articles[articleId].maximumBlockThreshold),
            "Vote is open"
        );
        require(
            articles[articleId].upvotes > articles[articleId].downvotes,
            "The article was not approved by the community"
        );
        _;
    }

    /// CONTRACTS EVENTS
    event RegisterAuthor(
        address _author,
        bytes32 _signature,
        bytes32 _nostrPublicKey
    );
    event PublishArticle(
        address _author,
        bytes32 _eventId,
        uint256 _authorReputation,
        uint256 _articleId,
        uint256 _etherSpentToPublish,
        uint256 _minimumBlockVote,
        uint256 _maximumBlockVote
    );
    event Vote(
        address _voter,
        uint256 articleId,
        bool _voteExpressed,
        uint256 _tokenSpentToVote,
        uint256 _etherSpentToVote,
        uint256 _voterReputation
    );
    event ClaimReward(
        address _claimer,
        uint256 _articleId,
        uint256 _etherReceived,
        uint256 _tokenReceived
    );
    event MintArticleNFT(
        address _author,
        uint256 _articleId,
        uint256 _nftAmount
    );
    event BuyArticleNFT(
        address _buyer,
        uint256 _articleId,
        uint256 _nftAmount,
        address _author
    );

    /// *** CONTRACT FUNCTIONS *** ///
    /// constructor function
    constructor(VeriToken veriTokenAddress, ArticleNFT articleNftAddress) {
        // Initialize the immutable variables
        etherVotePrice = 1000000000000000 wei; // 0.001 ether
        etherPublishPrice = 10000000000000000 wei; // 0.01 ether
        multiplierVeriPerEther = 1000; // 1 ether = 1000 veri -> 0.01 ether = 10 veri
        amountVeriPerUserPurged = 100000000000000000;
        endWeightVote = 500 * 10 ** 18; // in terms of minimum unit of ERC-20 tokens
        minimumBlockDelta = 23040; // 4 days in terms of blocks
        maximumBlockDelta = 40320; // 7 days in terms of blocks
        totalArticles = 0;
        articleNFTMintInVeri = 2 * 10 ** 18; // in terms of veri token
        articleNFTBuyInEther = 2000000000000000 wei;
        contractVeriToken = veriTokenAddress;
        contractArticleNFT = articleNftAddress;
    }

    /// The following function is used to receive ether
    receive() external payable {}

    function onERC1155Received(
        address,
        address,
        uint256,
        uint256,
        bytes memory
    ) public virtual returns (bytes4) {
        return IERC1155Receiver.onERC1155Received.selector;
    }

    function onERC1155BatchReceived(
        address,
        address,
        uint256[] memory,
        uint256[] memory,
        bytes memory
    ) public virtual returns (bytes4) {
        return IERC1155Receiver.onERC1155BatchReceived.selector;
    }

    function supportsInterface(
        bytes4 interfaceId
    ) public view virtual returns (bool) {
        return interfaceId == type(IERC165).interfaceId;
    }

    function _setReaderReputation(address user) internal {
        if (readersReputations[user] == 0) {
            readersReputations[user] = 51;
        }
    }

    function getReaderReputation(address user) public view returns (uint8) {
        if (readersReputations[user] == 0) {
            return 51;
        }
        return readersReputations[user];
    }

    function _setAuthorReputation(address user) internal {
        if (authorsReputations[user] == 0) {
            authorsReputations[user] = 51;
        }
    }

    function getAuthorReputation(address user) public view returns (uint8) {
        return authorsReputations[user];
    }

    function getAuthorArticlesPublished(
        address author
    ) public view returns (uint256[] memory) {
        return addressToArticlesPublished[author].values();
    }

    function getReaderArticlesVoted(
        address reader
    ) public view returns (uint256[] memory) {
        return addressToArticlesVoted[reader].values();
    }

    function isAuthor(address user) public view returns (bool) {
        if (authors[user] != 0) {
            return true;
        }
        return false;
    }

    function isVoteOpen(uint256 articleId) public view returns (bool) {
        if (
            (block.number <= articles[articleId].maximumBlockThreshold &&
                articles[articleId].upvotes + articles[articleId].downvotes <
                endWeightVote) ||
            (block.number < articles[articleId].minimumBlockThreshold)
        ) {
            return true;
        }
        return false;
    }

    function isVoteClosed(uint256 articleId) public view returns (bool) {
        if (
            (articles[articleId].upvotes + articles[articleId].downvotes >=
                endWeightVote &&
                block.number >= articles[articleId].minimumBlockThreshold) ||
            (block.number > articles[articleId].maximumBlockThreshold)
        ) {
            return true;
        }
        return false;
    }

    function isValidVoter(
        address user,
        uint256 articleId
    ) public view returns (bool) {
        if (
            articleIdToEtherSpentToUpvote[articleId][user] == 0 &&
            articleIdToEtherSpentToDownvote[articleId][user] == 0
        ) {
            return true;
        }
        return false;
    }

    function isValidClaimer(
        address user,
        uint256 articleId
    ) public view returns (bool) {
        if (
            articleIdToUpvotersAddresses[articleId].contains(user) ||
            articleIdToDownvotersAddresses[articleId].contains(user)
        ) {
            if (articles[articleId].upvotes > articles[articleId].downvotes) {
                if (articleIdToUpvotersAddresses[articleId].contains(user)) {
                    return true;
                }
            } else if (
                articles[articleId].upvotes < articles[articleId].downvotes
            ) {
                if (
                    articleIdToDownvotersAddresses[articleId].contains(user) &&
                    articles[articleId].author != user
                ) {
                    return true;
                }
            }
        }
        return false;
    }

    function isBestAuthor(address user) public view returns (bool) {
        if (authorsReputations[user] > 90) {
            return true;
        }
        return false;
    }

    function isBestArticle(uint256 articleId) public view returns (bool) {
        if (isVoteClosed(articleId)) {
            if (articles[articleId].upvotes > articles[articleId].downvotes) {
                return true;
            }
        }
        return false;
    }

    /// The following function is used to register a new author
    /// In order to do that the cryptohgraphic proof must be valid
    /// The idea is the following:
    /// 1. The user sends a transaction to the contract containing their Nostr address encrypted
    /// both with their Nostr private key and Ethereum private key; it also send their Nostr public key
    /// 2. The function decrypts the Nostr address using the two public keys
    /// 3. The function checks if the decrypted public key is the same as the Nostr public key
    /// This double encryption is needed in order to avoid possible spoofing attacks: if the double encryption
    /// is not used in fact it may happen that an attacker, while reading the pending transaction in the mempool,
    /// may copy the transaction and let the transaction be mined before the original one, thus registering themselves
    /// as the ethereum account associated with that specific Nostr address
    /// The function also checks if the user is already registered as an author
    function registerAuthor(
        bytes32 signature,
        bytes32 nostrPublicKey
    ) external {
        require(authors[msg.sender] == 0, "You are already an author");
        require(
            nostrAccountToEthereumAccount[nostrPublicKey] == address(0),
            "Nostr account already associated to another author"
        );
        //require(keccak256(abi.encodePacked(signature)) == nostrPublicKey, "Invalid cryptographic proof");
        _setAuthorReputation(msg.sender);
        authors[msg.sender] = nostrPublicKey;
        nostrAccountToEthereumAccount[nostrPublicKey] = msg.sender;
        emit RegisterAuthor(msg.sender, signature, nostrPublicKey);
    }

    function computation(
        uint256 actionPrice,
        uint8 reputation
    ) internal pure returns (uint256) {
        // se reputazione è 100 pago la metà se è 1 pago il doppio se 50 pago prezzo base
        // 1 = 200
        // 51 = 100
        // 101 = 50
        uint256 x;
        if (reputation <= 51) {
            uint256 subRes;
            uint256 mulRes;
            // 100 + ((51 - reputation) * 2)
            (, subRes) = Math.trySub(51, reputation);
            (, mulRes) = Math.tryMul(subRes, 2);
            (, x) = Math.tryAdd(100, mulRes);
        } else {
            (, x) = Math.trySub(reputation, 51);
        }
        return Math.mulDiv(actionPrice, x, 100);
    }

    function computePublishPrice(address author) public view returns (uint256) {
        uint8 reputation = getAuthorReputation(author);
        return computation(etherPublishPrice, reputation);
    }

    function computeVotePrice(address reader) public view returns (uint256) {
        uint8 reputation = getReaderReputation(reader);
        return computation(etherVotePrice, reputation);
    }

    function computeMaximumBoost(address user) public view returns (uint256) {
        uint8 reputation = getReaderReputation(user);
        return computeVoteWeight(reputation, 0);
    }

    function computeVoteWeight(
        uint8 reputation,
        uint256 tokenSpentToVote
    ) internal pure returns (uint256) {
        // se reputazione è 100 pago la metà se è 1 pago il doppio se 50 pago prezzo base
        // 1 = 50
        // 51 = 100
        // 101 = 200
        uint256 x;
        if (reputation <= 51) {
            (, x) = Math.tryAdd(reputation, 49);
        } else {
            // 100 + ((reputation - 51) * 2)
            uint256 subRes;
            uint256 mulRes;
            (, subRes) = Math.trySub(reputation, 51);
            (, mulRes) = Math.tryMul(subRes, 2);
            (, x) = Math.tryAdd(100, mulRes);
        }
        x = x * 10 ** 17;
        return x + tokenSpentToVote;
    }

    /// The following function is used to publish a new article
    /// In order to do that the user must be registered as an author
    /// The function also checks if the user has enough ether to pay the
    /// minimum price needed to publish an article
    /// Once that an article is published it is automatically ready to be voted
    function publishArticle(
        bytes32 eventId
    ) external payable onlyAuthor returns (uint256) {
        require(
            msg.value >= computePublishPrice(msg.sender),
            "Not enough ether"
        );
        require(eventIdToArticleId[eventId] == 0, "Article already published");
        totalArticles += 1;
        uint256 articleId = totalArticles;
        // The mappings are created empty by default
        articles[articleId] = Article(
            articleId, // articleId
            eventId, // eventId
            msg.sender, // author
            0, // upvotes
            0, // downvotes
            msg.value, // etherSpentToPublish
            0, // upvoters
            0, // downvoters
            block.number + minimumBlockDelta, // minimumBlockThreshold
            block.number + maximumBlockDelta, // maximumBlockThreshold
            0, // ethersSpentInUpvotes
            0, // ethersSpentInDownvotes
            0, // veriSpentInUpvotes
            0 // veriSpentInDownvotes
        );
        articleIdToUpvotersAddresses[articleId].add(msg.sender);
        articleIdToDownvotersAddresses[articleId].add(msg.sender);
        eventIdToArticleId[eventId] = articleId;
        addressToArticlesPublished[msg.sender].add(articleId);
        emit PublishArticle(
            msg.sender,
            eventId,
            authorsReputations[msg.sender],
            articleId,
            msg.value,
            block.number + minimumBlockDelta,
            block.number + maximumBlockDelta
        );
        return articleId;
    }

    // The following function is used to vote an article
    // In order to do that the vote for the article must be open
    // The function also checks if the user has enough ether to pay the
    // minimum price needed to express a vote
    // The function also checks if the user has already voted for the article
    // The function also checks if the user is the author of the article
    function vote(
        uint256 articleId,
        bool voteExpressed,
        uint256 tokenSpentToVote
    ) external payable validVoter(articleId) voteOpen(articleId) {
        require(msg.value >= computeVotePrice(msg.sender), "Not enough ether");
        require(
            tokenSpentToVote <= computeMaximumBoost(msg.sender),
            "Too many tokens spent to boost the vote"
        );
        if (tokenSpentToVote > 0) {
            contractVeriToken.transferFrom(
                msg.sender,
                address(this),
                tokenSpentToVote
            );
        }
        _setReaderReputation(msg.sender);
        uint8 reputation = getReaderReputation(msg.sender);
        if (voteExpressed) {
            articles[articleId].upvotes += computeVoteWeight(
                reputation,
                tokenSpentToVote
            );
            articles[articleId].upvoters += 1;
            articleIdToUpvotersAddresses[articleId].add(msg.sender);
            articleIdToEtherSpentToUpvote[articleId][msg.sender] = msg.value;
            articles[articleId].ethersSpentInUpvotes += msg.value;
            articleIdToVeriSpentToUpvote[articleId][
                msg.sender
            ] += tokenSpentToVote;
            articles[articleId].veriSpentInUpvotes += tokenSpentToVote;
        } else {
            articles[articleId].downvotes += computeVoteWeight(
                reputation,
                tokenSpentToVote
            );
            articles[articleId].downvoters += 1;
            articleIdToDownvotersAddresses[articleId].add(msg.sender);
            articleIdToEtherSpentToDownvote[articleId][msg.sender] = msg.value;
            articles[articleId].ethersSpentInDownvotes += msg.value;
            articleIdToVeriSpentToDownvote[articleId][
                msg.sender
            ] += tokenSpentToVote;
            articles[articleId].veriSpentInDownvotes += tokenSpentToVote;
        }
        addressToArticlesVoted[msg.sender].add(articleId);
        emit Vote(
            msg.sender,
            articleId,
            voteExpressed,
            tokenSpentToVote,
            msg.value,
            readersReputations[msg.sender]
        );
    }

    function updateReaderReputation(address user, bool direction) internal {
        if (direction) {
            if (readersReputations[user] < 101) {
                readersReputations[user] += 1;
            }
        } else {
            if (readersReputations[user] > 1) {
                readersReputations[user] -= 1;
            }
        }
    }

    function updateAuthorReputation(address user, bool direction) internal {
        if (direction) {
            if (authorsReputations[user] < 101) {
                authorsReputations[user] += 1;
            }
        } else {
            if (authorsReputations[user] > 1) {
                authorsReputations[user] -= 1;
            }
        }
    }

    /// The following function is used to give the expected reward to all the partecipants of the vote
    /// In order to do that the vote for the article must be closed
    /// The behavior of the function is the following:
    /// 1. If the number of upvotes is greater than the number of downvotes, the author of the article
    /// gets the ether collected from the downvotes and the ethers spent to publish the article and an amount
    /// of platform tokens proportional to how much ether has been spent to publish the article
    /// In this case also the reputation of the author is increased by 1
    /// 2. If the number of downvotes is greater than the number of upvotes, the author of the article
    /// looses the ether spent to publish the article and the reputation is lowered by 1
    /// 3. If the number of upvotes is greater then the number of downvotes, the users that expressed an upvote
    /// get back the ether spent to express the vote and an amount of platform tokens proportional to how much ether
    /// has been spent to express the vote; the users that expressed a downvote loose the ether spent to express the vote
    /// and their reputation is lowered by 1
    /// 4. If the number of downvotes is greater then the number of upvotes, the users that expressed a downvote
    /// get back the ether spent to express the vote and an amount of platform tokens proportional to how much ether
    /// has been spent to express the vote and a proportional part of the ethers collected among the upvotes and the ethers
    /// spent to publish the article; the users that expressed an upvote loose the ether spent to express the vote
    /// and their reputation is lowered by 1
    function claimReward(
        uint256 articleId
    ) external validClaimer(articleId) voteClosed(articleId) {
        uint256 etherAmount;
        uint256 tokenAmountToMint;
        uint256 tokenAmountToGiveBack;
        uint256 additionalTokenAmountToMint;
        uint256 additionalTokenAmountToGiveBack;
        // No majority
        if (articles[articleId].upvotes == articles[articleId].downvotes) {
            // The user get back only thier stake, the reputation is not modified
            if (articles[articleId].author == msg.sender) {
                // The author gets back the amount paid to publish the article
                etherAmount = articles[articleId].etherSpentToPublish;
            } else {
                // The readers get back the amount paid to vote
                // The sum is exactly equal to the amount paied because the user will have a value different from 0 only in one of the two mappings
                etherAmount =
                    articleIdToEtherSpentToUpvote[articleId][msg.sender] +
                    articleIdToEtherSpentToDownvote[articleId][msg.sender];
                tokenAmountToGiveBack =
                    articleIdToVeriSpentToUpvote[articleId][msg.sender] +
                    articleIdToVeriSpentToDownvote[articleId][msg.sender];
            }
            tokenAmountToMint = 0;
        }
        // MAJORITY -> UPVOTES
        if (articles[articleId].upvotes > articles[articleId].downvotes) {
            // AUTHOR
            if (articles[articleId].author == msg.sender) {
                // The author gets the ethers spent to publish the article and the ethers collected from the downvotes
                // and an amount of platform tokens proportional to how much ether has been spent to publish the article
                etherAmount =
                    articles[articleId].etherSpentToPublish +
                    articles[articleId].ethersSpentInDownvotes;
                (, tokenAmountToMint) = Math.tryMul(
                    articles[articleId].etherSpentToPublish,
                    multiplierVeriPerEther
                );
                // The reputation of the author is increased by 1
                updateAuthorReputation(msg.sender, true);
            } else {
                // VOTERS (READERS)
                // The voters, who are by construction in the majority or else they would not be validClaimer, will get back the amount
                // of ether spent to vote and an amount of platform tokens proportional to how much they spent
                etherAmount = articleIdToEtherSpentToUpvote[articleId][
                    msg.sender
                ];
                (, tokenAmountToMint) = Math.tryMul(
                    articleIdToEtherSpentToUpvote[articleId][msg.sender],
                    multiplierVeriPerEther
                );
                tokenAmountToGiveBack = articleIdToVeriSpentToUpvote[articleId][
                    msg.sender
                ];
                // The reputation of the reader is increased by 1
                updateReaderReputation(msg.sender, true);
            }
            // Since people who are in the minority cannot claim anything, people in the majority must take account of change their reputation
            // Compute how many people are eligible to update the reputation of the minority
            uint256 majorityUsers = articleIdToUpvotersAddresses[articleId]
                .length();
            uint256 minorityUsers = articleIdToDownvotersAddresses[articleId]
                .length();
            uint256 addressesToPurge = Math.ceilDiv(
                minorityUsers,
                majorityUsers
            );
            (, additionalTokenAmountToGiveBack) = Math.tryDiv(
                articles[articleId].veriSpentInDownvotes,
                articles[articleId].upvoters
            );
            for (uint256 i = 0; i < addressesToPurge; i++) {
                address userToPurge = EnumerableSet.at(
                    articleIdToDownvotersAddresses[articleId],
                    0
                );
                if (userToPurge != articles[articleId].author) {
                    updateReaderReputation(userToPurge, false);
                }
                EnumerableSet.remove(
                    articleIdToDownvotersAddresses[articleId],
                    userToPurge
                );
            }
            // In order to compute in the future the amount of eligible people to update the reputation of the minority
            articleIdToUpvotersAddresses[articleId].remove(msg.sender);
            (, additionalTokenAmountToMint) = Math.tryMul(
                addressesToPurge,
                amountVeriPerUserPurged
            );
            tokenAmountToMint += additionalTokenAmountToMint;
        }
        // MAJORITY -> DOWNVOTES
        // Update author reputation in a negative way
        if (articles[articleId].upvotes < articles[articleId].downvotes) {
            // Only the readers who voted downvote will get back the stake + a part of the sum of the ether spent in the upvotes
            // and the ether spent in the pubblication + a proportional amount of platform tokens
            etherAmount =
                articleIdToEtherSpentToDownvote[articleId][msg.sender] +
                ((articles[articleId].etherSpentToPublish +
                    articles[articleId].ethersSpentInUpvotes) /
                    articles[articleId].downvoters);
            (, tokenAmountToMint) = Math.tryMul(
                articleIdToEtherSpentToDownvote[articleId][msg.sender],
                multiplierVeriPerEther
            );
            tokenAmountToGiveBack = articleIdToVeriSpentToDownvote[articleId][
                msg.sender
            ];
            updateReaderReputation(msg.sender, true);
            // Since people who are in the minority cannot claim anything, people in the majority must take account of change their reputation
            // Compute how many people are eligible to update the reputation of the minority
            uint256 majorityUsers = (articleIdToDownvotersAddresses[articleId]
                .length() - 1); // because by construction also the author is here but in this case the author is not a valid claimer
            uint256 minorityUsers = articleIdToUpvotersAddresses[articleId]
                .length();
            uint256 addressesToPurge = Math.ceilDiv(
                minorityUsers,
                majorityUsers
            );
            (, additionalTokenAmountToGiveBack) = Math.tryDiv(
                articles[articleId].veriSpentInUpvotes,
                articles[articleId].downvoters
            );
            for (uint256 i = 0; i < addressesToPurge; i++) {
                address userToPurge = EnumerableSet.at(
                    articleIdToUpvotersAddresses[articleId],
                    0
                );
                if (userToPurge == articles[articleId].author) {
                    updateAuthorReputation(userToPurge, false);
                } else {
                    updateReaderReputation(userToPurge, false);
                }
                EnumerableSet.remove(
                    articleIdToUpvotersAddresses[articleId],
                    userToPurge
                );
            }
            // In order to compute in the future the amount of eligible people to update the reputation of the minority
            articleIdToDownvotersAddresses[articleId].remove(msg.sender);
            (, additionalTokenAmountToMint) = Math.tryMul(
                addressesToPurge,
                amountVeriPerUserPurged
            );
        }
        Address.sendValue(payable(msg.sender), etherAmount);
        contractVeriToken.mint(
            msg.sender,
            tokenAmountToMint + additionalTokenAmountToMint
        );
        if (tokenAmountToGiveBack > 0) {
            contractVeriToken.transfer(
                msg.sender,
                tokenAmountToGiveBack + additionalTokenAmountToGiveBack
            );
        }
        emit ClaimReward(
            msg.sender,
            articleId,
            etherAmount,
            tokenAmountToMint +
                additionalTokenAmountToMint +
                tokenAmountToGiveBack +
                additionalTokenAmountToGiveBack
        );
    }

    /// This function is callable by only the best authors of the platform and let them the possibility
    /// to mint a specific amount of nft for one of their best articles
    function mintArticleNFT(
        uint256 articleId,
        uint256 nftAmount
    ) public onlyBestAuthors onlyBestArticles(articleId) {
        require(
            articles[articleId].author == msg.sender,
            "You are not the author of this article"
        );
        contractVeriToken.transferFrom(
            msg.sender,
            address(this),
            nftAmount * articleNFTMintInVeri
        );
        contractArticleNFT.mint(address(this), articleId, nftAmount, "");
        emit MintArticleNFT(msg.sender, articleId, nftAmount);
    }

    function buyArticleNFT(
        uint256 articleId,
        uint256 nftAmount
    ) public payable {
        require(
            nftAmount <= contractArticleNFT.balanceOf(address(this), articleId),
            "There are not so many NFT to be bought"
        );
        require(
            msg.value >= nftAmount * articleNFTBuyInEther,
            "You did not pay enough for the NFTs"
        );
        contractArticleNFT.safeTransferFrom(
            address(this),
            msg.sender,
            articleId,
            nftAmount,
            ""
        );
        contractVeriToken.transfer(
            msg.sender,
            nftAmount * articleNFTMintInVeri
        );
        Address.sendValue(payable(articles[articleId].author), msg.value);
        emit BuyArticleNFT(
            msg.sender,
            articleId,
            nftAmount,
            articles[articleId].author
        );
    }
}
