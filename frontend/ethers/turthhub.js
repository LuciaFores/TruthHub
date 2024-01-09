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
const connectButton = document.getElementById("connectButton");
const registerButton = document.getElementById("registerButton");
const authorReputationButton = document.getElementById("getAuthorReputation");
connectButton.onclick = connect;
registerButton.onclick = registerAuthor;

authorReputationButton.onclick = function () {
  const authorAddressInput = document.getElementById("addressOfAuthor").value;
  console.log(authorAddressInput);
  getAuthorReputation(authorAddressInput);
};

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
  timeout = 120000
) {
  console.log(`Minning ${transactionResponse.hash}...`);

  // timeout of 2 mins, Reject the promise if timeout is reached.
  const timeoutId = setTimeout(() => {
    // Reject the promise if the timeout is reached
    reject(new Error(`Transaction not mined within ${timeout} milliseconds`));
  }, timeout);

  return new Promise((resolve, reject) => {
    //once we got the hash we call the listener function
    provider.once(transactionResponse.hash, (transactionReceipt) => {
      console.log(
        `Completed with ${transactionReceipt.confirmations} confirmations`
      );
      // once transaction is fired, we going to resolve
      resolve();
    });
  });
  // create a listener for blockchain
  // we want to listen for this event to happen, and wait for this thing to finish looking
}

async function getReaderReputation(addressOfReader) {
  if (typeof window.ethereum !== "undefined") {
    console.log("Getting Readers Reputation.....");
    // getting meta mask
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(TruthHubAddress, TruthHubAbi, signer);
    try {
      const transactionResponse = await contract.getReaderReputation(
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
    // provider / conncetion to the blockchain
    // take http endpoint and automatically sticks it in ethers for us.
    // it's like find http endpoint inside metamask, and that's going to be what we are going to use
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    // signer / wallet / someone with some gas
    // return which wallet we are connect with metamask (provider)
    const signer = await provider.getSigner();
    console.log(signer);
    // contract that we are interacting with
    const contract = new ethers.Contract(TruthHubAddress, TruthHubAbi, signer);
    try {
      const transactionResponse = await contract.getAuthorReputation(
        addressOfAuthor
      );
      console.log(transactionResponse);
      return transactionResponse;
    } catch (error) {
      console.log(error);
    }
  }
}

async function registerAuthor() {
  // using 32 Byte hex Public key, for example:4befe60a9d2878f23a4517e72ecab8a5fe2bc9ab4ec807679e1357f407d680e7
  const sign = "0x" + document.getElementById("signature").value;
  const nostrPKey = "0x" + document.getElementById("nostrPublicKey").value;
  if (typeof window.ethereum !== "undefined") {
    let signature = ethers.utils.hexZeroPad(sign, 32);
    let nostrPublicKey = ethers.utils.hexZeroPad(nostrPKey, 32);
    console.log("registering aurthor");
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(TruthHubAddress, TruthHubAbi, signer);
    try {
      const transactionResponse = await contract.registerAuthor(
        signature,
        nostrPublicKey
      );
      await listenForTransactionMine(transactionResponse, provider);
    } catch (error) {
      console.log(error);
    }
  }
}
