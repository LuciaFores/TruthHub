import { ethers } from "./ethers.esm.min.js";
import {
  TruthHubAddress,
  TruthHubAbi,
  ArticleNftAddress,
  ArticleNftAbi,
  VeriTokenAddress,
  VeriTokenAbi,
} from "./constants.js";

// for testing

// button
const connectButton = document.getElementById("connectButton");
const registerButton = document.getElementById("registerButton");
const authorReputationButton = document.getElementById("getAuthorReputation");
const computePublishPriceButton = document.getElementById(
  "computePublishPrice"
);
const publishArticleButton = document.getElementById("publishArticle");
const getArticleIdButton = document.getElementById("articleId");
const voteButton = document.getElementById("vote");
const gettingUpVotersButton = document.getElementById("gettingUpvoters");

// button

// click Event
connectButton.onclick = connect;

registerButton.onclick = function () {
  const signature = document.getElementById("signature").value;
  const nostrPublicKey = document.getElementById("nostrPublicKey").value;
  registerAuthor(signature, nostrPublicKey);
};

authorReputationButton.onclick = function () {
  const authorAddressInput = document.getElementById("ethAddress").value;
  console.log(authorAddressInput);
  getAuthorReputation(authorAddressInput);
};

computePublishPriceButton.onclick = function () {
  const authorAddressInput = document.getElementById("ethAddress").value;
  computePublishPrice(authorAddressInput);
};

publishArticleButton.onclick = function () {
  const eventIdNostr = document.getElementById("nostrEventId").value;
  publishArticle(eventIdNostr);
};

getArticleIdButton.onclick = function () {
  const eventIdNostr = document.getElementById("nostrEventId").value;
  getArticleId(eventIdNostr);
};

voteButton.onclick = function () {
  const eventIdNostr = document.getElementById("nostrEventId").value;
  const articleId = getArticleId(eventIdNostr);
  const votecheck = document.getElementById("voteExpressed");
  const voteExpressed = votecheck.checked;
  console.log(voteExpressed);
  const tokenSpentToVote = document.getElementById("numberOfToken").value;
  vote(articleId, voteExpressed, tokenSpentToVote);
};

gettingUpVotersButton.onclick = function () {
  const eventIdNostr = document.getElementById("nostrEventId").value;
  getUpVotersCounts(eventIdNostr);
};

// click Event

// for testing
async function connect() {
  if (typeof window.ethereum !== "undefined") {
    await window.ethereum.request({ method: "eth_requestAccounts" });
    connectButton.innerHTML = "Connected!";
  } else {
    connectButton.innerHTML = "Please install the MetaMask!";
  }
}

// wait for transaction to be mine
function listenForTransactionMine(
  transactionResponse,
  provider,
  timeout = 300000
) {
  console.log(`Minning ${transactionResponse.hash}...`);

  return new Promise((resolve, reject) => {
    //once we got the hash we call the listener function
    provider.once(transactionResponse.hash, (transactionReceipt) => {
      console.log(
        `Completed with ${transactionReceipt.confirmations} confirmations`
      );
      // once transaction is fired, we going to resolve
      resolve();
    });
    // timeout of 2 mins, Reject the promise if timeout is reached.
    const timeoutId = setTimeout(() => {
      // Reject the promise if the timeout is reached
      reject(new Error(`Transaction not mined within ${timeout} milliseconds`));
    }, timeout);
  });
  // create a listener for blockchain
  // we want to listen for this event to happen, and wait for this thing to finish looking
}

async function ConnectToContract() {
  // provider / conncetion to the blockchain
  // take http endpoint and automatically sticks it in ethers for us.
  // it's like find http endpoint inside metamask, and that's going to be what we are going to use
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  // signer / wallet / someone with some gas
  // return which wallet we are connect with metamask (provider)
  const signer = await provider.getSigner();
  // Address of the current account that is connected with MetaMask
  const accountAddress = signer.getAddress();
  // contract that we are interacting with
  const contract = new ethers.Contract(TruthHubAddress, TruthHubAbi, signer);
  return { truthHubContract: contract, provider, accountAddress };
}

async function getReaderReputation(addressOfReader) {
  if (typeof window.ethereum !== "undefined") {
    console.log("Getting Readers Reputation.....");
    const { truthHubContract, provider } = await ConnectToContract();
    try {
      const transactionResponse = await truthHubContract.getReaderReputation(
        addressOfReader
      );
      console.log(transactionResponse);
      return transactionResponse;
    } catch (error) {
      console.log(error);
    }
  }
}

async function getAuthorReputation(addressOfAuthor) {
  if (typeof window.ethereum !== "undefined") {
    console.log("Getting Author Reputation.....");
    const { truthHubContract, provider } = await ConnectToContract();
    try {
      const transactionResponse = await truthHubContract.getAuthorReputation(
        addressOfAuthor
      );
      console.log(transactionResponse);
      return transactionResponse;
    } catch (error) {
      console.log(error);
    }
  }
}

async function registerAuthor(signa, nostrPubKey) {
  // using 32 Byte hex Public key, for example:4befe60a9d2878f23a4517e72ecab8a5fe2bc9ab4ec807679e1357f407d680e7
  const sign = "0x" + signa;
  const nostrPKey = "0x" + nostrPubKey;
  if (typeof window.ethereum !== "undefined") {
    console.log("registring Aurthor......");
    let signature = ethers.utils.hexZeroPad(sign, 32);
    let nostrPublicKey = ethers.utils.hexZeroPad(nostrPKey, 32);
    console.log("registering aurthor");
    const { truthHubContract, provider } = await ConnectToContract();
    try {
      const transactionResponse = await truthHubContract.registerAuthor(
        signature,
        nostrPublicKey
      );
      await listenForTransactionMine(transactionResponse, provider);
    } catch (error) {
      console.log(error);
    }
  }
}

async function computePublishPrice(addressOfAuthor) {
  if (typeof window.ethereum !== "undefined") {
    console.log("Computing publish price.....");
    // getting meta mask
    const { truthHubContract } = await ConnectToContract();
    try {
      const transactionResponse = await truthHubContract.computePublishPrice(
        addressOfAuthor
      );
      // returns a big number
      console.log(Number(transactionResponse));
      return transactionResponse;
    } catch (error) {
      console.log(error);
    }
  }
}

async function computeVotePrice(addressOfReader) {
  if (typeof window.ethereum !== "undefined") {
    console.log("Computing vote priece.....");
    // getting meta mask
    const { truthHubContract } = await ConnectToContract();
    try {
      const transactionResponse = await truthHubContract.computeVotePrice(
        addressOfReader
      );
      // returns a big number
      console.log(Number(transactionResponse));
      return transactionResponse;
    } catch (error) {
      console.log(error);
    }
  }
}

async function computeMaximumBoost(addressOfUser) {
  if (typeof window.ethereum !== "undefined") {
    console.log("Computing Maximum Boost.....");
    // getting meta mask
    const { truthHubContract } = await ConnectToContract();
    try {
      const transactionResponse = await truthHubContract.computeMaximumBoost(
        addressOfUser
      );
      // returns a big number
      console.log(Number(transactionResponse));
      return transactionResponse;
    } catch (error) {
      console.log(error);
    }
  }
}

async function publishArticle(eventId) {
  const event = "0x" + eventId;
  if (typeof window.ethereum !== "undefined") {
    console.log("Publishing Ariticle");
    let event_id = ethers.utils.hexZeroPad(event, 32);
    // getting meta mask
    const { truthHubContract, provider, accountAddress } =
      await ConnectToContract();
    const publishPriece = await computePublishPrice(accountAddress);
    try {
      const transactionResponse = await truthHubContract.publishArticle(
        event_id,
        { value: publishPriece }
      );
      await listenForTransactionMine(transactionResponse, provider);
      // returns a big number
      console.log(transactionResponse);
    } catch (error) {
      console.log(error);
    }
  }
}

// get the article ID
async function getArticleId(eventId) {
  const event = "0x" + eventId;
  if (typeof window.ethereum !== "undefined") {
    console.log("Getting article Id...");
    let event_id = ethers.utils.hexZeroPad(event, 32);
    // getting meta mask
    const { truthHubContract } = await ConnectToContract();
    try {
      const transactionResponse = await truthHubContract.eventIdToArticleId(
        event_id
      );
      // returns a big number
      console.log(Number(transactionResponse));
      return transactionResponse;
    } catch (error) {
      console.log(error);
    }
  }
}

async function getUpVotersCounts(eventId) {
  const article_Id = getArticleId(eventId);
  if (typeof window.ethereum !== "undefined") {
    console.log("Getting up Voters Counts");
    const { truthHubContract } = await ConnectToContract();
    try {
      const transactionResponse = await truthHubContract.articles(article_Id);
      const upvoters = transactionResponse.upvoters;
      console.log(Number(upvoters));
    } catch (error) {
      console.log(error);
    }
  }
}

async function vote(articleId, voteExpressed, tokenSpentToVote) {
  if (typeof window.ethereum !== "undefined") {
    console.log("Voting for Ariticle");
    // getting meta mask
    const { truthHubContract, provider, accountAddress } =
      await ConnectToContract();
    const votePrice = await computeVotePrice(accountAddress);
    try {
      const transactionResponse = await truthHubContract.vote(
        articleId,
        voteExpressed,
        tokenSpentToVote,
        { value: votePrice, gasLimit: 210000 }
      );
      await listenForTransactionMine(transactionResponse, provider);
      console.log(transactionResponse);
    } catch (error) {
      console.log(error);
    }
  }
}

async function claimReward(articleId) {
  if (typeof window.ethereum !== "undefined") {
    console.log("Claim Rewards...");
    const { truthHubContract, provider, accountAddress } =
      await ConnectToContract();
    try {
      const transactionResponse = truthHubContract.claimReward(articleId);
      await listenForTransactionMine(transactionResponse, provider);
    } catch (error) {
      console.log(error);
    }
  }
}

async function mintArticleNFT(articleId, nftAmount) {
  if (typeof window.ethereum !== "undefined") {
    console.log("Mint Article NFT.....");
    const { truthHubContract, provider } = await ConnectToContract();
    try {
      const transactionResponse = truthHubContract.mintArticleNFT(
        articleId,
        nftAmount
      );
      await listenForTransactionMine(transactionResponse, provider);
      console.log(transactionResponse);
    } catch (error) {
      console.log(error);
    }
  }
}

async function buyArticleNft(articleId, nftAmount) {
  if (typeof window.ethereum !== "undefined") {
    console.log("Buying Article NFT.....");
    const { truthHubContract, provider } = await ConnectToContract();
    try {
      const transactionResponse = truthHubContract.buyArticleNft(
        articleId,
        nftAmount
      );
      await listenForTransactionMine(transactionResponse, provider);
      console.log(transactionResponse);
    } catch (error) {
      console.log(error);
    }
  }
}
