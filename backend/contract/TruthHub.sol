// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract TruthHub {
    /// *** CONTRACT VARIABLES *** ///

    /// Minimum ether price needed to express a vote, it will be given back to 
    /// either to the voter or the author of the article
    immutable uint256 public minEtherVotePrice;

    /// Minimum ether price needed to publish an article, it will be given
    /// back either to the author of the article or the voter
    immutable uint256 public minEtherPublishPrice;

    /// Amount of platform tokens given per Ether spent
    immutable uint256 public _amountVeriPerEther;

    /// Amount of ethers spent to vote an article
    uint256 public etherSpentToVote;

    /// Mapping needed to register the correspondences between Ethereum accounts
    /// and Nostr accounts, it is used to check if a user is also an author
    /// It is a mapping(address ethereumAddress => bytes32 nostrAddress)
    mapping(address => byte32) public authors;

    /// Mapping needed to register the reputations of the users
    /// The reputaton is a number between 0 and 100
    /// It is a mapping(address ethereumAddress => uint8 reputation)
    mapping(address => uint8) public reputations;

    /// Variable needed to save the total number of articles published
    uint256 internal _totalArticles;

    /// Struct used to represent an article
    struct Article {
        /// Progressive article id (can be useful for ERC1155)
        uint256 articleId;
        /// Nostr event id
        byte32 eventId;
        // Ethereum address of the author
        address author;
        /// Number of upvotes collected by the article
        uint256 upvotes;
        /// Number of downvotes collected by the article
        uint256 downvotes;
        /// Ethers spent to publish the article
        uint256 etherSpentToPublish;
        /// Minimum amount of time, in terms of blocks, that must pass
        /// in order to consider a vote valid
        /// The formula is the following:
        /// minimum_block_threshold = current_block_height + 4 days
        immutable uint256 minimumBlockThreshold;
        /// Maximum amount of time, in terms of blocks, that must pass
        /// in order to consider a vote valid
        /// The formula is the following:
        /// maximum_block_threshold = current_block_height + 7 days
        immutable uint256 maximumBlockThreshold;
        /// Number of active voters, it is a computable variable so it 
        /// is not stored in the struct, the formula is the following:
        /// activeVoters = upvotes + downvotes
    }
    /// Total number of votes needed to consider an vote ended
    immutable uint256 public endVotes;

    /// Mapping needed to register the articles
    /// It is needed to map the eventId of the Nostr event to the actual
    /// information about the article
    /// It is a mapping(byte32 eventId => Article article)
    mapping(byte32 => Article) public articles;

    /// The following two mappings may be useful or not, if they will never
    /// be used, delete them
    /// Mapping needed to register the correspondences between the eventIds
    /// and the articleIds
    /// It is a mapping(byte32 eventId => uint256 articleId)
    mapping(byte32 => uint256) public eventIdToArticleId;

    /// Mapping needed to register the correspondences between the articleIds
    /// and the eventIds
    /// It is a mapping(uint256 articleId => byte32 eventId)
    mapping(uint256 => byte32) public articleIdToEventId;

    /// Mapping needed to register all the articles for which an user has voted
    /// It is a mapping(address ethereumAddress => mapping(byte32 eventId => bool voted))
    mapping(address => mapping(byte32 => bool)) public voted;

    /// Mapping needed to register the vote that an user gave to an article
    /// It is a mapping(address ethereumAddress => mapping(byte32 eventId => bool voteExpressed))
    mapping(address => mapping(byte32 => bool)) public voteExpressed;

    /// Mapping needed to register how much an user payed to express a vote
    /// It is a mapping(address ethereumAddress => mapping(byte32 eventId => uint256 etherSpentToVote))
    mapping(address => mapping(byte32 => uint256)) public etherSpentToVote;


    /// *** CONTRACT MODIFIERS *** ///
    /// The following modifier checks if the user that is signing the
    /// transaction is also an author; it checks the mapping authors
    modifier onlyAuthor() {
        require(authors[msg.sender] != 0, "You are not an author");
        _;
    }

    /// The following modifier checks if a vote is open; it checks if
    /// the current block height is between the minimum and the maximum and
    /// also if the number of active voters is less than the minimum number
    /// of votes needed to consider a vote valid
    modifier voteOpen(byte32 eventId) {
        require(block.number <= articles[eventId].maximumBlockThreshold && articles[eventId].upvote + articles[eventId].downvote <= endVotes, "Vote is closed");
        _;
    }

    /// The following modifier checks if a vote is closed; it checks if
    /// the current block height is greater than the maximum or
    /// if the number of active voters is greater than the minimum number and the current block height is grater than the minimum
    modifier voteClosed(byte32 eventId) {
        require(block.number > articles[eventId].maximumBlockThreshold || (articles[eventId].upvote + articles[eventId].downvote >= endVotes && block.number > articles[eventId].minimumBlockThreshold), "Vote is open");
        _;
    }

    /// *** CONTRACT FUNCTIONS *** ///
    /// constructor function
    constructor() {
        // Initialize the immutable variables
        minEtherVotePrice = 1000000 gwei;
        minEtherPublishPrice = 1000000 gwei;
        _totalArticles = 0;
        _amountVeriPerEther = 1000; // 1 ether = 1000 veri -> 0.01 ether = 10 veri
        endVotes = 31;
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
    function registerAuthor(byte32 encryptedNostrPublicKey, byte32 nostrPublicKey) external {
        require(authors[msg.sender] == 0, "You are already an author");
        //require(keccak256(abi.encodePacked(encryptedNostrPublicKey)) == nostrPublicKey, "Invalid cryptographic proof");
        authors[msg.sender] = nostrPublicKey;
    }

    /// The following function is used to publish a new article
    /// In order to do that the user must be registered as an author
    /// The function also checks if the user has enough ether to pay the
    /// minimum price needed to publish an article
    // Once that an article is published it is automatically ready to be voted
    function publishArticle(byte32 eventId) external payable onlyAuthor returns (uint256){
        require(msg.value >= minEtherPublishPrice, "Not enough ether");
        require(articles[eventId].eventId == 0, "Article already published");
        articleId = _totalArticles; // può esserci l'id 0 o crea problemi con il default?
        _totalArticles += 1;
        author = msg.sender;
        etherSpentToPublish = msg.value;
        minimum_block_threshold = block.number + 23040;
        maximum_block_threshold = block.number + 40320;
        articles[eventId] = Article(articleId, eventId, author, 0, 0, etherSpentToPublish, minimum_block_threshold, maximum_block_threshold);
        return articleId;
    }

    // The following function is used to vote an article
    // In order to do that the vote for the article must be open
    // The function also checks if the user has enough ether to pay the
    // minimum price needed to express a vote
    // The function also checks if the user has already voted for the article
    // The function also checks if the user is the author of the article
    // Non sono sicura funzioni, non so se chiedendo il valore di una chiave che non esiste nel mapping
    // appare il default -> CHIEDI
    function vote (byte32 eventId, bool vote) external payable voteOpen(eventId) {
        require(msg.value >= minEtherVotePrice, "Not enough ether");
        require(voted[msg.sender][eventId] == false, "You have already voted");
        require(articles[eventId].author != msg.sender, "You are the author");
        voted[msg.sender][eventId] = true;
        etherSpentToVote[msg.sender][eventId] = msg.value;
        if (vote) {
            voteExpressed[msg.sender][eventId] = true;
            articles[eventId].upvotes += 1;
        } else {
            // Not needed to update the mapping because the default value is false
            articles[eventId].downvotes += 1;
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
    function claim_stake_reward (byte32 eventId) external voteClosed(eventId) {
        if (articles[eventId].upvotes > articles[eventId].downvotes) {
            // Checks if the msg.sender is an author
            if (authors[msg.sender] != 0){
                // The author gets the ethers spent to publish the article and the ethers collected from the downvotes
                // and an amount of platform tokens proportional to how much ether has been spent to publish the article
                // Come calcolo i possibili downvote con prezzi diversi? Direi di lasciare qui solo il minimo e poi il resto se lo intasca il contract
                payable(msg.sender).transfer(articles[eventId].etherSpentToPublish + articles[eventId].downvotes * minEtherVotePrice);
                // The author gets an amount of platform tokens proportional to how much ether has been spent to publish the article
                // The formula is the following:
                // amountVeri = (minEtherPublishPrice + articles[eventId].downvotes * minEtherVotePrice) * _amountVeriPerEther
                // The author reputation is increased by 1
                reputations[msg.sender] += 1;
            }
            else{
                // This means that the msg.sender is a reader
                require(voteExpressed[msg.sender][eventId] == true, "You have not expressed a vote");
                // If the reader is an upvoter
                if (voteExpressed[msg.sender][eventId] == true){
                    // The reader gets back the ether spent to express the vote
                    payable(msg.sender).transfer(etherSpentToVote[msg.sender][eventId]);
                    // The reader gets an amount of platform tokens proportional to how much ether has been spent to express the vote
                    // The formula is the following:
                    // amountVeri = etherSpentToVote[msg.sender][eventId] * _amountVeriPerEther
                    // The reader reputation is increased by 1
                    reputations[msg.sender] += 1;
                }
                // This means that the reader is a downvoter
                else{
                    // The reader looses the ether spent to express the vote
                    // The reader reputation is lowered by 1
                    reputations[msg.sender] -= 1;
                }
            }
        }
        if (articles[eventId].upvotes < articles[eventId].downvotes){
            // Checks if the msg.sender is an author
            if (authors[msg.sender] != 0){
                // The author looses the ethers spent to publish the article
                // The author reputation is lowered by 1
                reputations[msg.sender] -= 1;
            }
            else{
                // This means that the msg.sender is a reader
                require(voteExpressed[msg.sender][eventId] == true, "You have not expressed a vote");
                // If the reader is an upvoter
                if (voteExpressed[msg.sender][eventId] == true){
                    // The reader looses the ether spent to express the vote
                    // The reader reputation is lowered by 1
                    reputations[msg.sender] -= 1;
                }
                // This means that the reader is a downvoter
                else{
                    // The reader gets back the ether spent to express the vote
                    payable(msg.sender).transfer(etherSpentToVote[msg.sender][eventId]); // Come calcolo il resto da dare?
                    // The reader gets an amount of platform tokens proportional to how much ether has been spent to express the vote
                    // The formula is the following:
                    // amountVeri = etherSpentToVote[msg.sender][eventId] * _amountVeriPerEther
                    // The reader reputation is increased by 1
                    reputations[msg.sender] += 1;
                }
            }
        }
    }
}