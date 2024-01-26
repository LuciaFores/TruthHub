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

contract TruthHubDemo is IERC1155Receiver {
    /// *** CONTRACT LIBRARIES *** ///
    /// Using Address for address type;
    using Address for address;
    /// Using EnumerableSet for EnumerableSet.AddressSet type
    using EnumerableSet for EnumerableSet.AddressSet;
    /// Using UintSet for EnumerableSet.UintSet type
    using EnumerableSet for EnumerableSet.UintSet;

    /// *** CONTRACT VARIABLES *** ///

    /// Ether price needed to express a vote, it will be given back to
    /// to the voter of the article and it is weighted
    /// by the reputation
    uint256 public immutable etherVotePrice;

    /// Ether price needed to publish an article, it will be given
    /// back either to the author of the article and it is
    /// weighted by the reputation
    uint256 public immutable etherPublishPrice;

    /// Amount of platform tokens given to the users per Ether spent
    /// The reward is in fact proportional to the amount of Ether staked
    /// either to vote or to publish an article
    uint256 public immutable multiplierVeriPerEther;

    /// Amount of platform tokens given per user purged
    /// Since the lack of oracles, users will decied when to claim their reward
    /// and since no looser will claim their non-existent reward, the winners
    /// will take care of lower the loosers reputation
    /// This means that the winners transaction to claim the reward will be
    /// more expensive and so they will recieve more VERI as an incentive
    /// to claim their reward and consequently lower the reputation of the loosers
    /// maintaining in this way the correct operation of the system
    uint256 public immutable amountVeriPerUserPurged;

    /// Minimum delay needed to consider a vote valid (10 minutes in terms of blocks)
    /// This means that all the votes will last at least 10 minutes
    uint256 public immutable minimumBlockDelta;

    /// Max delay needed to consider a vote valid (7 days in terms of blocks)
    /// This means that all the votes will last at most 7 days
    uint256 public immutable maximumBlockDelta;

    /// Total weight vote needed to consider an vote ended
    /// The weight of a single user vote is computed as shown later and is measured
    /// in terms of minimum unit of ERC-20 tokens
    /// This means that if the vote weight of a user is 1 in the platform will actually
    /// be 1 * 10**18
    /// The end weight vote is actually the sum of all the weights of the upvotes and
    /// downvotes
    uint256 public immutable endWeightVote;

    /// Token price to mint an article NFT
    /// Best authors will in fact have the possibility to spend their VERI not only to
    /// boost their votes when acting like readers but they will also have the possibility
    /// to mint an articles NFTs that will later on sell to the readers for ETHs
    uint256 public immutable articleNFTMintInVeri;

    /// Ether price to buy an article NFT
    /// As stated before readers will buy NFTs from best authors for ETHs
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
        /// Progressive article id (useful for ERC1155)
        uint256 articleId;
        /// Nostr event id
        bytes32 eventId;
        // Ethereum address of the author
        address author;
        /// Totalizer of the weighted positive votes expressed for the article
        uint256 upvotes;
        /// Totalizer of the weighted negative votes expressed for the article
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
    /// Used to check if a user has already voted for an article
    /// Used also to maintain an immediate reference to all the articles with which a reader
    /// has interacted
    /// It is a mapping(address readerEthereumAddress => EnumerableSet.UintSet setOfArticlesVoted)
    mapping(address => EnumerableSet.UintSet) internal addressToArticlesVoted;

    /// Set of articles that has been published by a user
    /// Used also to maintain an immediate reference to all the articles published by an author
    /// It is a mapping(address authorEthereumAddress => EnumerableSet.UintSet setOfArticlesPublished)
    mapping(address => EnumerableSet.UintSet)
        internal addressToArticlesPublished;

    /// Set of upvoters' addresses
    /// It is used to store the addresses of the users that have upvoted an article
    /// It is a mapping(uint256 articleId => EnumerableSet.AddressSet setOfUpvotersAddresses)
    mapping(uint256 => EnumerableSet.AddressSet)
        internal articleIdToUpvotersAddresses;

    /// Set of downvoters' addresses
    /// It is used to store the addresses of the users that have downvoted an article
    /// It is a mapping(uint256 articleId => EnumerableSet.AddressSet setOfDownvotersAddresses)
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

    /// VERI spent to upvote
    /// It is used to store how many tokens an user has spent to boost their upvote for an article
    /// It is a mapping (address userEthereumAddress => uint256 veriSpentToUpvote)
    mapping(uint256 => mapping(address => uint256))
        internal articleIdToVeriSpentToUpvote;

    /// VERI spent to downvote
    /// It is used to store how many tokens an user has spent to boost their downvote for an article
    /// It is a mapping (address userEthereumAddress => uint256 veriSpentToDownvote)
    mapping(uint256 => mapping(address => uint256))
        internal articleIdToVeriSpentToDownvote;

    /// Mapping needed to register the articles
    /// It is needed to map the articleId of the article to the actual
    /// information about the article
    /// It is a mapping(uint256 articleId => Article article)
    mapping(uint256 => Article) public articles;

    /// *** CONTRACT MODIFIERS *** ///

    /// The following modifier checks if the user that is signing the
    /// transaction is also an author; it checks the mapping authors
    modifier onlyAuthor() {
        require(authors[msg.sender] != 0, "You are not an author");
        _;
    }

    /// The following modifier checks if a vote is open; it checks if
    /// the current block height is lower than the maximum and
    /// also if the weighted total vote is less than the minimum weighted total
    /// vote needed to consider a vote valid
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
    /// if the total weighted vote for the article is greater or equal than the
    /// minimum total weighted vote and the current block height is grater than the minimum
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
    /// It checks if the user has already spent ETH to upvote or downvote an article
    modifier validVoter(uint256 articleId) {
        require(
            articleIdToEtherSpentToUpvote[articleId][msg.sender] == 0 &&
                articleIdToEtherSpentToDownvote[articleId][msg.sender] == 0,
            "You have already voted"
        );
        _;
    }

    /// The following modifier checks if a user has the possibility to claim a reward
    /// Firstly it checks if the user has voted for the article by checking if it has staked
    /// ETH to upvote or downvote the article
    /// Secondly it checks which was the majority for that article and if the user is in the majority
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
        // In case of article not validated then it also checks if the user is not the author
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

    /// The following modifier checks if a user is a Best Author
    /// It checks if the reputation of the user as an author is greater than 90
    modifier onlyBestAuthors() {
        require(
            authorsReputations[msg.sender] > 90,
            "Your author reputation is too low to access to this functionality"
        );
        _;
    }

    /// The following modifier checks if an article is a Best Article
    /// It checks if the article has been validated by the community meaning that the vote ended
    /// with a majority of weighted upvotes
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

    /// CONTRACTS EVENTS ///

    /// The following events are used to emit the events of the contract
    /// They are used to notify the users of the contract about the
    /// actions that have been performed

    /// Event used to notify the users that a new author has been registered
    event RegisterAuthor(
        address _author,
        bytes32 _signature,
        bytes32 _nostrPublicKey
    );

    /// Event used to notify the users that a new article has been published
    event PublishArticle(
        address _author,
        bytes32 _eventId,
        uint256 _authorReputation,
        uint256 _articleId,
        uint256 _etherSpentToPublish,
        uint256 _minimumBlockVote,
        uint256 _maximumBlockVote
    );

    /// Event used to notify the users that a new vote has been expressed
    event Vote(
        address _voter,
        uint256 articleId,
        bool _voteExpressed,
        uint256 _tokenSpentToVote,
        uint256 _etherSpentToVote,
        uint256 _voterReputation
    );

    /// Event used to notify the users that a new reward has been claimed
    event ClaimReward(
        address _claimer,
        uint256 _articleId,
        uint256 _etherReceived,
        uint256 _tokenReceived
    );

    /// Event used to notify the users that a new reward has been claimed
    event MintArticleNFT(
        address _author,
        uint256 _articleId,
        uint256 _nftAmount
    );

    /// Event used to notify the users that a new reward has been claimed
    event BuyArticleNFT(
        address _buyer,
        uint256 _articleId,
        uint256 _nftAmount,
        address _author
    );

    /// *** CONTRACT FUNCTIONS *** ///

    /// Constructor function
    /// It is used to initialize the immutable variables
    /// It is also used to initialize the contract instances
    /// MODIFIER:
    /// - none
    /// INPUT:
    /// - VeriToken veriTokenAddress: address of the VeriToken contract instance
    /// - ArticleNFT articleNftAddress: address of the ArticleNFT contract instance
    /// OUTPUT:
    /// - none
    constructor(VeriToken veriTokenAddress, ArticleNFT articleNftAddress) {
        // Initialize the immutable variables
        etherVotePrice = 1000000000000000 wei; // 0.001 ether
        etherPublishPrice = 10000000000000000 wei; // 0.01 ether
        multiplierVeriPerEther = 1000; // 1 ether = 1000 veri -> 0.01 ether = 10 veri
        amountVeriPerUserPurged = 100000000000000000;
        endWeightVote = 25 * 10 ** 18; // in terms of minimum unit of ERC-20 tokens
        minimumBlockDelta = 0; // at the moment of the publication the vote can already stop
        maximumBlockDelta = 100; // about 10 minutes in terms of blocks
        totalArticles = 0;
        articleNFTMintInVeri = 2 * 10 ** 18; // in terms of VERI token
        articleNFTBuyInEther = 2000000000000000 wei; // 0.002 ether
        // Initialize the contract instances
        contractVeriToken = veriTokenAddress;
        contractArticleNFT = articleNftAddress;
    }

    /// The following function is used to receive ether
    /// It is used to receive the ethers spent perform an action of the contract
    /// MODIFIER:
    /// - none
    /// INPUT:
    /// - none
    /// OUTPUT:
    /// - none
    receive() external payable {}

    /// The following function is used to receive ERC-1155 tokens
    /// It is used to receive the Article NFTs
    /// MODIFIER:
    /// - none
    /// INPUT:
    /// - address operator: address of the operator
    /// - address from: address of the sender
    /// - uint256 id: id of the token
    /// - uint256 value: amount of tokens
    /// - bytes calldata data: data
    /// OUTPUT:
    /// - bytes4: bytes4 selector
    function onERC1155Received(
        address,
        address,
        uint256,
        uint256,
        bytes memory
    ) public virtual returns (bytes4) {
        return IERC1155Receiver.onERC1155Received.selector;
    }

    /// The following function is used to receive batch of ERC-1155 tokens
    /// It is used to receive the Article NFTs
    /// MODIFIER:
    /// - none
    /// INPUT:
    /// - address operator: address of the operator
    /// - address from: address of the sender
    /// - uint256[] memory ids: ids of the tokens
    /// - uint256[] memory values: amount of tokens
    /// - bytes calldata data: data
    /// OUTPUT:
    /// - bytes4: bytes4 selector
    function onERC1155BatchReceived(
        address,
        address,
        uint256[] memory,
        uint256[] memory,
        bytes memory
    ) public virtual returns (bytes4) {
        return IERC1155Receiver.onERC1155BatchReceived.selector;
    }

    /// The following function is used to check if the contract supports an interface
    /// MODIFIER:
    /// - none
    /// INPUT:
    /// - bytes4 interfaceId: id of the interface
    /// OUTPUT:
    /// - bool: true if the interface is supported, false otherwise
    function supportsInterface(
        bytes4 interfaceId
    ) public view virtual returns (bool) {
        return interfaceId == type(IERC165).interfaceId;
    }

    /// The following function is used to initialize the reputation of a reader
    /// Since as soon as the user become a reader the community can't know if it is
    // a good or a bad one, the reputation is initialized to 51
    /// MODIFIER:
    /// - none
    /// INPUT:
    /// - address user: address of the user
    /// OUTPUT:
    /// - none
    function _setReaderReputation(address user) internal {
        if (readersReputations[user] == 0) {
            readersReputations[user] = 51;
        }
    }

    /// The following function is used to get the reputation of a reader
    /// If the reputation is 0 it means that the user is not a reader
    /// and so the reputation is initialized to 51
    /// MODIFIER:
    /// - none
    /// INPUT:
    /// - address user: address of the user
    /// OUTPUT:
    /// - uint8: reputation of the user
    function getReaderReputation(address user) public view returns (uint8) {
        if (readersReputations[user] == 0) {
            return 51;
        }
        return readersReputations[user];
    }

    /// The following function is used to initialize the reputation of an author
    /// Since as soon as the user become an author the community can't know if it is
    // a good or a bad one, the reputation is initialized to 51
    /// MODIFIER:
    /// - none
    /// INPUT:
    /// - address user: address of the user
    /// OUTPUT:
    /// - none
    function _setAuthorReputation(address user) internal {
        if (authorsReputations[user] == 0) {
            authorsReputations[user] = 51;
        }
    }

    /// The following function is used to get the reputation of an author
    /// MODIFIER:
    /// - none
    /// INPUT:
    /// - address user: address of the user
    /// OUTPUT:
    /// - uint8: reputation of the user
    function getAuthorReputation(address user) public view returns (uint8) {
        return authorsReputations[user];
    }

    /// The following function is used to get the article IDs of the articles published
    /// by a specific author
    /// MODIFIER:
    /// - none
    /// INPUT:
    /// - address author: address of the author
    /// OUTPUT:
    /// - uint256[] memory: array of article IDs
    function getAuthorArticlesPublished(
        address author
    ) public view returns (uint256[] memory) {
        return addressToArticlesPublished[author].values();
    }

    /// The following function is used to get the article IDs of the articles voted
    /// by a specific reader
    /// MODIFIER:
    /// - none
    /// INPUT:
    /// - address reader: address of the reader
    /// OUTPUT:
    /// - uint256[] memory: array of article IDs
    function getReaderArticlesVoted(
        address reader
    ) public view returns (uint256[] memory) {
        return addressToArticlesVoted[reader].values();
    }

    /// The following function is used to know if a user is an author
    /// It can be saw as an executable version of the modifier onlyAuthor
    /// MODIFIER:
    /// - none
    /// INPUT:
    /// - address user: address of the user
    /// OUTPUT:
    /// - bool: true if the user is an author, false otherwise
    function isAuthor(address user) public view returns (bool) {
        if (authors[user] != 0) {
            return true;
        }
        return false;
    }

    /// The following function is used to know if a vote is open
    /// It can be saw as an executable version of the modifier voteOpen
    /// MODIFIER:
    /// - none
    /// INPUT:
    /// - uint256 articleId: id of the article
    /// OUTPUT:
    /// - bool: true if the vote is open, false otherwise
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

    /// The following function is used to know if a vote is closed
    /// It can be saw as an executable version of the modifier voteClosed
    /// MODIFIER:
    /// - none
    /// INPUT:
    /// - uint256 articleId: id of the article
    /// OUTPUT:
    /// - bool: true if the vote is closed, false otherwise
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

    /// The following function is used to know if a user has already voted for an article
    /// It can be saw as an executable version of the modifier validVoter
    /// MODIFIER:
    /// - none
    /// INPUT:
    /// - address user: address of the user
    /// - uint256 articleId: id of the article
    /// OUTPUT:
    /// - bool: true if the user has already voted for the article, false otherwise
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

    /// The following function is used to know if a user has the possibility to claim a reward
    /// It can be saw as an executable version of the modifier validClaimer
    /// MODIFIER:
    /// - none
    /// INPUT:
    /// - address user: address of the user
    /// - uint256 articleId: id of the article
    /// OUTPUT:
    /// - bool: true if the user has the possibility to claim a reward, false otherwise
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
            } else {
                return true;
            }
        }
        return false;
    }

    /// The following function is used to know if a user is a Best Author
    /// It can be saw as an executable version of the modifier onlyBestAuthors
    /// MODIFIER:
    /// - none
    /// INPUT:
    /// - address user: address of the user
    /// OUTPUT:
    /// - bool: true if the user is a Best Author, false otherwise
    function isBestAuthor(address user) public view returns (bool) {
        if (authorsReputations[user] > 90) {
            return true;
        }
        return false;
    }

    /// The following function is used to know if an article is a Best Article
    /// It can be saw as an executable version of the modifier onlyBestArticles
    /// MODIFIER:
    /// - none
    /// INPUT:
    /// - uint256 articleId: id of the article
    /// OUTPUT:
    /// - bool: true if the article is a Best Article, false otherwise
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
    /// with Schnorr cryptography thanks to the Nostr Public Key; it also send their Nostr public key
    /// 2. The function decrypts the Nostr address using the public key
    /// 3. The function checks if the decrypted public key is the same as the Nostr public key
    /// This encryption is needed in order to avoid possible spoofing attacks: if the encryption
    /// is not used in fact it may happen that an attacker, while reading the pending transaction in the mempool,
    /// may copy the transaction and let the transaction be mined before the original one, thus registering themselves
    /// as the ethereum account associated with that specific Nostr address
    /// The function also checks if the user is already registered as an author
    /// MODIFIER:
    /// - none
    /// INPUT:
    /// - bytes32 signature: signature of the Nostr address encrypted with Schnorr cryptography
    /// - bytes32 nostrPublicKey: Nostr public key
    /// OUTPUT:
    /// - none
    function registerAuthor(
        bytes32 signature,
        bytes32 nostrPublicKey
    ) external {
        require(authors[msg.sender] == 0, "You are already an author");
        require(
            nostrAccountToEthereumAccount[nostrPublicKey] == address(0),
            "Nostr account already associated to another author"
        );
        // TODO: decrypt and check the signature
        _setAuthorReputation(msg.sender);
        authors[msg.sender] = nostrPublicKey;
        nostrAccountToEthereumAccount[nostrPublicKey] = msg.sender;
        emit RegisterAuthor(msg.sender, signature, nostrPublicKey);
    }

    /// The following function is used to compute the price of an action
    /// The price is computed as a function of the reputation of the user
    /// In this way we managed to get the proportion needed to have the following prices:
    /// 1 = 200 -> bad reputation, user pays double the average price
    /// 51 = 100 -> average reputation, user pays the average price
    /// 101 = 50 -> good reputation, user pays half the average price
    /// MODIFIER:
    /// - none
    /// INPUT:
    /// - uint256 actionPrice: price of the action
    /// - uint8 reputation: reputation of the user
    /// OUTPUT:
    /// - uint256: price of the action
    function computation(
        uint256 actionPrice,
        uint8 reputation
    ) internal pure returns (uint256) {
        uint256 x;
        uint256 res;
        if (reputation <= 51) {
            uint256 subRes;
            uint256 mulRes;
            (, subRes) = Math.trySub(51, reputation);
            (, mulRes) = Math.tryMul(subRes, 2);
            (, x) = Math.tryAdd(100, mulRes);
            res = Math.mulDiv(actionPrice, x, 100);
        } else {
            (, x) = Math.trySub(reputation, 51);
            res = Math.mulDiv(actionPrice, x, 100);
            res = actionPrice - res;
        }
        return res;
    }

    /// The following function is used to compute the price of the publication of an article
    /// The price is computed as a function of the reputation of the author
    /// by calling the function computation
    /// MODIFIER:
    /// - none
    /// INPUT:
    /// - address author: address of the author
    /// OUTPUT:
    /// - uint256: price of the publication of an article
    function computePublishPrice(address author) public view returns (uint256) {
        uint8 reputation = getAuthorReputation(author);
        return computation(etherPublishPrice, reputation);
    }

    /// The following function is used to compute the price of a vote
    /// The price is computed as a function of the reputation of the reader
    /// by calling the function computation
    /// MODIFIER:
    /// - none
    /// INPUT:
    /// - address reader: address of the reader
    /// OUTPUT:
    /// - uint256: price of a vote
    function computeVotePrice(address reader) public view returns (uint256) {
        uint8 reputation = getReaderReputation(reader);
        return computation(etherVotePrice, reputation);
    }

    /// The following function is used to compute the weight of a vote
    /// The weight is computed as a function of the reputation of the reader
    /// and the amount of tokens spent to boost the vote
    /// In this way we managed to get the proportion needed to have the following weights:
    /// 1 = 50 -> bad reputation, user vote weight the half of the average weight
    /// 51 = 100 -> average reputation, user vote weight the average weight
    /// 101 = 200 -> good reputation, user vote weight the double of the average weight
    /// MODIFIER:
    /// - none
    /// INPUT:
    /// - uint8 reputation: reputation of the reader
    /// - uint256 tokenSpentToVote: amount of tokens spent to boost the vote
    /// OUTPUT:
    /// - uint256: weight of the vote
    function computeVoteWeight(
        uint8 reputation,
        uint256 tokenSpentToVote
    ) internal pure returns (uint256) {
        uint256 x;
        if (reputation <= 51) {
            (, x) = Math.tryAdd(reputation, 49);
        } else {
            uint256 subRes;
            uint256 mulRes;
            (, subRes) = Math.trySub(reputation, 51);
            (, mulRes) = Math.tryMul(subRes, 2);
            (, x) = Math.tryAdd(100, mulRes);
        }
        x = x * 10 ** 17;
        return x + tokenSpentToVote;
    }

    /// The following function is used to compute the maximum amount of tokens
    /// that a user can spend to boost their vote
    /// The maximum amount of tokens is computed as a function of the reputation of the reader
    /// thanks to the function computeVoteWeight
    /// MODIFIER:
    /// - none
    /// INPUT:
    /// - address user: address of the user
    /// OUTPUT:
    /// - uint256: maximum amount of tokens that a user can spend to boost their vote
    function computeMaximumBoost(address user) public view returns (uint256) {
        uint8 reputation = getReaderReputation(user);
        return computeVoteWeight(reputation, 0);
    }

    /// The following function is used to publish a new article
    /// In order to do that the user must be registered as an author
    /// The function also checks if the user has enough ether to pay the
    /// minimum price needed to publish an article
    /// Once that an article is published it is automatically ready to be voted
    // MODIFIER:
    /// - onlyAuthor: check if the user is an author
    /// INPUT:
    /// - bytes32 eventId: Nostr event id of the event
    /// OUTPUT:
    /// - uint256: id of the article
    function publishArticle(
        bytes32 eventId
    ) external payable onlyAuthor returns (uint256) {
        require(
            msg.value >= computePublishPrice(msg.sender),
            "Not enough ether"
        );
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
        // Since the author won't be able to vote for their own article
        // we put the author both in the set of who upvoted it and downvoted it
        // In this way we will be able to manage its reward (or purge) no matter
        // what is the outcome of the vote
        articleIdToUpvotersAddresses[articleId].add(msg.sender);
        articleIdToDownvotersAddresses[articleId].add(msg.sender);
        // We added the article to the set of the articles published
        addressToArticlesPublished[msg.sender].add(articleId);
        // Emit the event for the publication of the article
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
        require(
            msg.sender != articles[articleId].author,
            "You are the author of the article"
        );
        require(msg.value >= computeVotePrice(msg.sender), "Not enough ether");
        require(
            tokenSpentToVote <= computeMaximumBoost(msg.sender),
            "Too many tokens spent to boost the vote"
        );
        // In case of vote boosted with the VERI tokens we do an ERC-20 transfer
        // of the specified amount of tokens from the user to the contract
        if (tokenSpentToVote > 0) {
            contractVeriToken.transferFrom(
                msg.sender,
                address(this),
                tokenSpentToVote
            );
        }
        // Since the vote could be the first one for the reader
        // meaning that this could be the first interaction of the reader with the
        // protocol, we initialize the reputation of the reader to 51
        // If the reader reputation is different from 0 this action doesn't take place
        _setReaderReputation(msg.sender);
        uint8 reputation = getReaderReputation(msg.sender);
        // If the reader upvoted the article
        if (voteExpressed) {
            // Update the upvotes weight by adding the weight of the new vote
            articles[articleId].upvotes += computeVoteWeight(
                reputation,
                tokenSpentToVote
            );
            // Update the number of upvoters by adding 1
            articles[articleId].upvoters += 1;
            // Add the article to the set of articles upvoted by the reader
            articleIdToUpvotersAddresses[articleId].add(msg.sender);
            // Save the amount of ether that the user spent to upvote the specific article
            articleIdToEtherSpentToUpvote[articleId][msg.sender] = msg.value;
            // Update the total amount of ether spent to upvote the article
            articles[articleId].ethersSpentInUpvotes += msg.value;
            // Save the amount of tokens that the user spent to upvote the specific article
            articleIdToVeriSpentToUpvote[articleId][
                msg.sender
            ] += tokenSpentToVote;
            // Update the total amount of tokens spent to upvote the article
            articles[articleId].veriSpentInUpvotes += tokenSpentToVote;
        }
        // If the reader downvoted the article
        else {
            // Update the downvotes weight by adding the weight of the new vote
            articles[articleId].downvotes += computeVoteWeight(
                reputation,
                tokenSpentToVote
            );
            // Update the number of downvoters by adding 1
            articles[articleId].downvoters += 1;
            // Add the article to the set of articles downvoted by the reader
            articleIdToDownvotersAddresses[articleId].add(msg.sender);
            // Save the amount of ether that the user spent to downvote the specific article
            articleIdToEtherSpentToDownvote[articleId][msg.sender] = msg.value;
            // Update the total amount of ether spent to downvote the article
            articles[articleId].ethersSpentInDownvotes += msg.value;
            // Save the amount of tokens that the user spent to downvote the specific article
            articleIdToVeriSpentToDownvote[articleId][
                msg.sender
            ] += tokenSpentToVote;
            // Update the total amount of tokens spent to downvote the article
            articles[articleId].veriSpentInDownvotes += tokenSpentToVote;
        }
        // Add the article to the set of the articles voted by the reader
        addressToArticlesVoted[msg.sender].add(articleId);
        // Emit the event for the vote
        emit Vote(
            msg.sender,
            articleId,
            voteExpressed,
            tokenSpentToVote,
            msg.value,
            readersReputations[msg.sender]
        );
    }

    /// The following function is to update within the desired limits
    /// the reader reputation meaning that if the reputation goes above
    /// 101 it remains 101 and if it goes below 1 it remains 1
    /// MODIFIER:
    /// - none
    /// INPUT:
    /// - address user: address of the user
    /// - bool direction: true if the reputation must be increased, false otherwise
    /// OUTPUT:
    /// - none
    function updateReaderReputation(address user, bool direction) internal {
        if (direction) {
            if (readersReputations[user] < 101) {
                readersReputations[user] += 10;
            }
        } else {
            if (readersReputations[user] > 1) {
                readersReputations[user] -= 10;
            }
        }
    }

    /// The following function is to update within the desired limits
    /// the author reputation meaning that if the reputation goes above
    /// 101 it remains 101 and if it goes below 1 it remains 1
    /// MODIFIER:
    /// - none
    /// INPUT:
    /// - address user: address of the user
    /// - bool direction: true if the reputation must be increased, false otherwise
    /// OUTPUT:
    /// - none
    function updateAuthorReputation(address user, bool direction) internal {
        if (direction) {
            if (authorsReputations[user] < 101) {
                authorsReputations[user] += 10;
            }
        } else {
            if (authorsReputations[user] > 1) {
                authorsReputations[user] -= 10;
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
    /// and their reputation is lowered by 1.
    /// The users who upvoted the article takes also an amount of tokens proportional to the number of users that they
    /// purged from the minority
    /// 4. If the number of downvotes is greater then the number of upvotes, the users that expressed a downvote
    /// get back the ether spent to express the vote and an amount of platform tokens proportional to how much ether
    /// has been spent to express the vote and a proportional part of the ethers collected among the upvotes and the ethers
    /// spent to publish the article; the users that expressed an upvote loose the ether spent to express the vote
    /// and their reputation is lowered by 1.
    /// The users who downvoted the article takes also an amount of tokens proportional to the number of users that they
    /// purged from the minority
    /// 5. If the number of upvotes is equal to the number of downvotes, everyone gets back the ether spent
    /// to express the vote or to publish the article and the reputation is not modified
    /// MODIFIER:
    /// - validClaimer: check if the user has the possibility to claim a reward
    /// - voteClosed: check if the vote is closed
    /// INPUT:
    /// - uint256 articleId: id of the article
    /// OUTPUT:
    /// - none
    function claimReward(
        uint256 articleId
    ) external validClaimer(articleId) voteClosed(articleId) {
        // Variables needed to compute the reward
        uint256 etherAmount;
        uint256 tokenAmountToMint;
        uint256 tokenAmountToGiveBack;
        uint256 additionalTokenAmountToMint;
        uint256 additionalTokenAmountToGiveBack;
        // No majority
        // The user get back only thier stake, the reputation is not modified
        if (articles[articleId].upvotes == articles[articleId].downvotes) {
            // AUTHOR
            if (articles[articleId].author == msg.sender) {
                // The author gets back the amount paid to publish the article
                etherAmount = articles[articleId].etherSpentToPublish;
            }
            // VOTERS (READERS)
            else {
                // The readers get back the amount paid to vote
                // The sum is exactly equal to the amount paied because the user
                // will have a value different from 0 only in one of the two mappings
                etherAmount =
                    articleIdToEtherSpentToUpvote[articleId][msg.sender] +
                    articleIdToEtherSpentToDownvote[articleId][msg.sender];
                tokenAmountToGiveBack =
                    articleIdToVeriSpentToUpvote[articleId][msg.sender] +
                    articleIdToVeriSpentToDownvote[articleId][msg.sender];
            }
            // There are no tokens to be minted as reward
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
            }
            // VOTERS (READERS)
            // The voters, who are by construction in the majority or else they would not be validClaimer, will get back the amount
            // of ether spent to vote and an amount of platform tokens proportional to how much they spent
            else {
                etherAmount = articleIdToEtherSpentToUpvote[articleId][
                    msg.sender
                ];
                (, tokenAmountToMint) = Math.tryMul(
                    articleIdToEtherSpentToUpvote[articleId][msg.sender],
                    multiplierVeriPerEther
                );
                // They will also get back the amount of VERI spent to boost the vote
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
            // Compute the proportional amount of tokens spent by the minority to be give
            // back to the user in the majority
            (, additionalTokenAmountToGiveBack) = Math.tryDiv(
                articles[articleId].veriSpentInDownvotes,
                articles[articleId].upvoters
            );
            // Purge the part of the minority requested to be purged by the user
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
            // Compute the amount of reward token for the purge
            (, additionalTokenAmountToMint) = Math.tryMul(
                addressesToPurge,
                amountVeriPerUserPurged
            );
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
            // Retrieve the amount of tokens spent to boost the vote in order to give them back to the user
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
            // Compute the proportional amount of tokens spent by the minority to be give
            // back to the user in the majority
            (, additionalTokenAmountToGiveBack) = Math.tryDiv(
                articles[articleId].veriSpentInUpvotes,
                articles[articleId].downvoters
            );
            // Purge the part of the minority requested to be purged by the user
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
            // Compute the amount of reward token for the purge
            (, additionalTokenAmountToMint) = Math.tryMul(
                addressesToPurge,
                amountVeriPerUserPurged
            );
        }
        // Transfer the ether to the user
        Address.sendValue(payable(msg.sender), etherAmount);
        // Mint the token to the user
        contractVeriToken.mint(
            msg.sender,
            tokenAmountToMint + additionalTokenAmountToMint
        );
        // Give back the token to the user
        if (tokenAmountToGiveBack > 0) {
            contractVeriToken.transfer(
                msg.sender,
                tokenAmountToGiveBack + additionalTokenAmountToGiveBack
            );
        }
        // Emit the event for the claim of the reward
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

    /// This function is used to mint a specific amount of article NFTs
    /// MODIFIER :
    /// - onlyBestAuthors: check if the user is a Best Author
    /// - onlyBestArticles: check if the article is a Best Article
    /// INPUT:
    /// - uint256 articleId: id of the article
    /// - uint256 nftAmount: amount of NFTs to be minted
    /// OUTPUT:
    /// - none
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

    /// This function is used to buy a specific amount of article NFTs
    /// MODIFIER :
    /// - none
    /// INPUT:
    /// - uint256 articleId: id of the article
    /// - uint256 nftAmount: amount of NFTs to be bought
    /// OUTPUT:
    /// - none
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
