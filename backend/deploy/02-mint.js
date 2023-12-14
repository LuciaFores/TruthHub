const { network, ethers } = require("hardhat");

// this script mint a nft for the deployer
module.exports = async ({ getNamedAccounts }) => {
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId;

  // connect randomIpfsNft to the deployer
  const randomIpfsNft = await ethers.getContract("RandomIpfsNFT", deployer);
  const mintFee = ethers.parseEther("0.2");
  console.log(mintFee);
  const randomIpfsNftMintTx = await randomIpfsNft.requestNft({
    value: mintFee,
  });

  console.log(randomIpfsNft.target);
  const randomIpfsNftMintTxReceipt = await randomIpfsNftMintTx.wait(1);
  // Check if the transaction status is successful
  if (randomIpfsNftMintTxReceipt.status === 1) {
    console.log("Transaction successful!");
    console.log(randomIpfsNftMintTxReceipt.logs[1].args.requestId);
  } else {
    console.error(
      "Transaction reverted or failed. Check the transaction receipt for details."
    );
  }

  // Need to listen for response
  await new Promise(async (resolve, reject) => {
    setTimeout(() => reject("Timeout: 'NFTMinted' event did not fire"), 300000); // 5 minute timeout time
    // setup listener for our event
    randomIpfsNft.once("NftMinted", async () => {
      console.log(
        `Random IPFS NFT index 0 tokenURI: ${await randomIpfsNft.tokenURI(0)}`
      );
      resolve();
    });
    if (chainId == 31337) {
      // from receipt we can get our event log
      const requestId = randomIpfsNftMintTxReceipt.logs[1].args.requestId;
      const vrfCoordinatorV2Mock = await ethers.getContract(
        "VRFCoordinatorV2Mock",
        deployer
      );
      await vrfCoordinatorV2Mock.fulfillRandomWords(
        requestId,
        randomIpfsNft.target
      );
    }
  });
};
module.exports.tags = ["all", "mint"];
