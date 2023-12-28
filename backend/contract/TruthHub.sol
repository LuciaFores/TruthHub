// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

/// Address library provides utilities for working with addresses
import "@openzeppelin/contracts/utils/Address.sol";
/// Enumerable set is used to have efficient structure "stack-like"
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
/// import openzeppelin math
import "@openzeppelin/contracts/utils/math/Math.sol";

contract TruthHub {
    using Address for address;
    /// Using EnumerableSet for EnumerableSet.AddressSet type
    using EnumerableSet for EnumerableSet.AddressSet;

    /// *** CONTRACT VARIABLES *** ///

    /// Ether price needed to express a vote, it will be given back to 
    /// either to the voter or the author of the article and it is weighted
    /// by the reputation
    immutable uint256 public etherVotePrice;

    /// Ether price needed to publish an article, it will be given
    /// back either to the author of the article or the voter and it is
    /// weighted by the reputation
    immutable uint256 public etherPublishPrice;

    /// Amount of platform tokens given per Ether spent
    immutable uint256 public amountVeriPerEther;

    /// Minimum delay needed to consider a vote valid (4 days in terms of blocks)
    immutable uint256 public minimumBlockDelta;

    /// Max delay needed to consider a vote valid (7 days in terms of blocks)
    immutable uint256 public maximumBlockDelta;

    /// Total weight vote needed to consider an vote ended
    immutable uint256 public endWeightVote; // siccome devi moltiplicare tutto per 100 se ad esempio vuoi chiudere a 2 voti devi chiudere a 200

    /// Mapping needed to register the correspondences between Ethereum accounts
    /// and Nostr accounts, it is used to check if a user is also an author
    /// It is a mapping(address ethereumAddress => bytes32 nostrAddress)
    mapping(address => byte32) public authors;

    /// Mapping needed to register the reputations of the users
    /// The reputaton is a number between -0.5 and +0.5
    /// (e.g. max reputation -> half price and double power)
    /// It is a mapping(address ethereumAddress => uint8 reputation)
    mapping(address => uint8) public reputations;

    /// Variable needed to save the total number of articles published
    uint256 public totalArticles;

    /// Struct used to represent an article
    struct Article {
        /// Progressive article id (can be useful for ERC1155)
        uint256 articleId;
        /// Nostr event id
        byte32 eventId;
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
        /// Set of upvoters' addresses
        EnumerableSet.AddressSet upvotersAddresses;
        /// Number of people who downvoted
        uint256 downvoters;
        /// Set of downvoters' addresses
        EnumerableSet.AddressSet downvotersAddresses;
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
        /// Ethers spent to upvote
        /// It is used to store how much an user has spent to upvote an article
        /// It is a mapping (address userEthereumAddress => uint256 etherSpentToUpvote)
        mapping (address => uint256) etherSpentToUpvote;
        /// Ethers spent to downvote
        /// It is used to store how much an user has spent to downvote an article
        /// It is a mapping (address userEthereumAddress => uint256 etherSpentToDownvote)
        mapping (address => uint256) etherSpentToDownvote;
        /// Number of total weighted votes, it is a computable variable so it 
        /// is not stored in the struct, the formula is the following:
        /// totalWeightVotes = upvotes + downvotes
    }

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
    mapping(byte32 => uint256) public eventIdToArticleId; // metti funzione che prende uint256 e restituisce byte32 sarebbe articleIdToEventId


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
        require(block.number <= articles[articleId].maximumBlockThreshold && (articles[articleId].upvotes + articles[articleId].downvotes < endWeightVote || block.number < articles[articleId].minimumBlockThreshold), "Vote is closed");
        _;
    }

    /// The following modifier checks if a vote is closed; it checks if
    /// the current block height is greater than the maximum or
    /// if the number of active voters is greater than the minimum number and the current block height is grater than the minimum
    modifier voteClosed(uint256 articleId) {
        require(block.number > articles[articleId].maximumBlockThreshold || (articles[articleId].upvotes + articles[articleId].downvotes >= endWeightVote && block.number >= articles[articleId].minimumBlockThreshold), "Vote is open");
        _;
    }

    /// The following modifier checks if a user has already voted for an article
    /// It checks if the user has already spent ether to upvote or downvote an article
    modifier validVoter(uint256 articleId) {
        require(articles[articleId].etherSpentToUpvote[msg.sender] == 0 && articles[articleId].etherSpentToDownvote[msg.sender] == 0, "You have already voted");
        _;
    }

    modifier validClaimer(uint256 articleId) {
        // Check if the msg.sender is in the majority or if there is a tie between upvotes and downvotes
        require(containes(articles[articleId].upvotersAddresses, msg.sender) || containes(articles[articleId].downvotersAddresses, msg.sender), "You did not vote");
        if (articles[articleId].upvotes > articles[articleId].downvotes){
            require(containes(articles[articleId].upvotersAddresses, msg.sender), "You are not in the majority");
        }
        else if (articles[articleId].upvotes < articles[articleId].downvotes){
            require(containes(articles[articleId].downvotersAddresses, msg.sender) && articles[articleId].author != msg.sender, "You are not in the majority");
        }
        _;
    }

    /// *** CONTRACT FUNCTIONS *** ///
    /// constructor function
    constructor() {
        // Initialize the immutable variables
        etherVotePrice = 1000000000000000 wei; // 0.001 ether
        etherPublishPrice = 10000000000000000 wei; // 0.01 ether
        amountVeriPerEther = 1000; // 1 ether = 1000 veri -> 0.01 ether = 10 veri
        endWeightVote = 31; // placeholder value
        minimumBlockDelta = 23040; // 4 days in terms of blocks
        maximumBlockDelta = 40320; // 7 days in terms of blocks
        totalArticles = 0;
    }

    /// The following function is used to receive ether
    receive() external payable {
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
    function registerAuthor(byte32 signature, byte32 nostrPublicKey) external {
        require(authors[msg.sender] == 0, "You are already an author");
        //require(keccak256(abi.encodePacked(signature)) == nostrPublicKey, "Invalid cryptographic proof");
        authors[msg.sender] = nostrPublicKey;
    }

    function computation(address user, uint256 actionPrice) internal view returns (uint256){
        // se reputazione è 100 pago la metà se è 1 pago il doppio se 50 pago prezzo base
        // 1 = 200
        // 51 = 100
        // 101 = 50 
        uint256 x;
        uint256 reputation = reputations[user];
        if (reputation <= 51){
            uint256 subRes;
            uint256 mulRes;
            // 100 + ((51 - reputation) * 2)
            (, subRes) = trysub(51, reputation);
            (, mulRes) = trymul(subRes, 2);
            (, x) = tryadd(100, mulRes);
        }
        else{
            (, x) = trysub(reputation, 51);
        }
        return muldiv(actionPrice, x, 100);
    }

    function computePublishPrice(address author) public view returns (uint256) {
        return computation(author, etherPublishPrice);
    }

    function computeVotePrice(address author) public view returns (uint256) {
        return computation(author, etherVotePrice);
    }

    function computeVoteWeight(address voter) public view return (uint256) {
        // se reputazione è 100 pago la metà se è 1 pago il doppio se 50 pago prezzo base
        // 1 = 50
        // 51 = 100
        // 101 = 200
        uint256 x;
        uint256 reputation = reputations[voter];
        if (reputation <= 51){
            (, x) = tryadd(reputation, 49);
        }
        else{
            // 100 + ((reputation - 51) * 2)
            uint256 subRes;
            uint256 mulRes;
            (, subRes) = trysub(reputation, 51);
            (, mulRes) = trymul(subRes, 2);
            (, x) = tryadd(100, mulRes);
        }
        return x;
    }

    /// The following function is used to publish a new article
    /// In order to do that the user must be registered as an author
    /// The function also checks if the user has enough ether to pay the
    /// minimum price needed to publish an article
    /// Once that an article is published it is automatically ready to be voted
    function publishArticle(byte32 eventId) external payable onlyAuthor returns (uint256){
        require(msg.value >= computePublishPrice(msg.sender), "Not enough ether");
        require(eventIdToArticleId[eventId] == 0, "Article already published");
        totalArticles += 1;
        // The mappings are created empty by default
        articles[articleId] = Article(
            totalArticles, // articleId
            eventId, // eventId
            msg.sender, // author
            0, // upvotes
            0, // downvotes
            msg.value, // etherSpentToPublish
            0, // upvoters
            EnumerableSet.AddressSet(), // upvotersAddresses
            0, // downvoters
            EnumerableSet.AddressSet(), // downvotersAddresses
            block.number + minimumBlockDelta, // minimumBlockThreshold
            block.number + maximumBlockDelta // maximumBlockThreshold
            );
        articles[articleId].upvotersAddresses.add(msg.sender);
        articles[articleId].downvotersAddresses.add(msg.sender);
        return articleId;
    }

    // The following function is used to vote an article
    // In order to do that the vote for the article must be open
    // The function also checks if the user has enough ether to pay the
    // minimum price needed to express a vote
    // The function also checks if the user has already voted for the article
    // The function also checks if the user is the author of the article
    // POI AGGIUNGI IL PESO DOVUTO AI TOKENS
    function vote (uint256 articleId, bool vote) external payable validVoter(articleId) voteOpen(articleId) {
        require(msg.value >= computeVotePrice(msg.sender), "Not enough ether");
        if (vote) {
            articles[articleId].upvotes += computeVoteWeight(msg.sender);
            articles[articleId].upvoters += 1;
            articles[articleId].upvotersAddresses.add(msg.sender);
            articles[articleId].etherSpentToUpvote[msg.sender] = msg.value;
        }
        else {
            articles[articleId].downvotes += computeVoteWeight(msg.sender);
            articles[articleId].downvoters += 1;
            articles[articleId].downvotersAddresses.add(msg.sender);
            articles[articleId].etherSpentToDownvote[msg.sender] = msg.value;
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
    function claim_stake_reward (uint256 articleId) external validClaimer voteClosed(articleId) {
        // MAJORITY -> UPVOTES
        if (articles[articleId].upvotes > articles[articleId].downvotes) {
            // Checks if the msg.sender is the author
            if (articles[articleId].author == msg.sender){
                // The author gets the ethers spent to publish the article and the ethers collected from the downvotes
                // and an amount of platform tokens proportional to how much ether has been spent to publish the article
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