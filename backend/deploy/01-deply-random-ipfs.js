const {
  networkConfig,
  developmentChains,
} = require("../helper-hardhat-config");
const { network } = require("hardhat");
require("dotenv");
const { verify } = require("../utils/verify");
const {
  storeImages,
  storeTokenUriMetadata,
} = require("../utils/uploadToPinata");

const imageLocation = "./images/randomNft";

// all the basics what we need for our metadata for our tokenURI
const metadataTemplate = {
  name: "",
  description: "",
  image: "",
  attribute: [
    {
      trait_type: "Cuteness",
      value: 100,
    },
  ],
};

let tokenUris = [
  "ipfs://QmQVuBmg1cuunq9BLtKZjsriubahDbxENZEYcrpnMVY6h4",
  "ipfs://QmaexozDAHzuutgVMourEEnvpDaSN1LDdDkB5G4eZUwwyv",
  "ipfs://QmZQenkMJ9tftCquurFEn7gM5oAzsJMWFJRbcPt2fV6hZX",
];

const FUND_AMOUNT = "1000000000000000000000";

module.exports = async function ({ getNamedAccounts, deployments }) {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId;

  // uploading our meta data and tokenUri up to IPFS will give us this list of tokenUri
  // get the IPFS Hashes of our images
  // 1. with our own IPFS node. https://docs.ipfs.io
  // 2. Pinata
  // 3. NFT.storage

  // after execute handleTokenUris()

  //   if (process.env.UPLOAD_TO_PINATA == "true") {
  //     tokenUris = await handleTokenUris();
  //   }

  let vrfCoordinator, subscriptionId, vrfCoordinatorV2Mock;
  // Verify the deployment
  if (developmentChains.includes(network.name)) {
    const contractAddress = (await deployments.get("VRFCoordinatorV2Mock"))
      .address;
    vrfCoordinatorV2Mock = await ethers.getContractAt(
      "VRFCoordinatorV2Mock",
      contractAddress
    );
    vrfCoordinator = vrfCoordinatorV2Mock.target;
    console.log(`the address of VRF: ${vrfCoordinator}`);
    const transactionResponse = await vrfCoordinatorV2Mock.createSubscription();
    // inside this transactionReceipt, there is an event emitted with our subscription in the log
    const transactionReceipt = await transactionResponse.wait();
    subscriptionId = transactionReceipt.logs[0].args.subId;
    // fund the subscription, usually, you'd need the link token on a real network.
    await vrfCoordinatorV2Mock.fundSubscription(subscriptionId, FUND_AMOUNT);
    console.log("successful-1 ");
  } else {
    // if it's not default address
    // it will be address of the contract in the testnet (sepolia here)
    console.log(`chainId : ${chainId}`);
    vrfCoordinator = networkConfig[chainId]["VRFCoordinatorV2"];
    subscriptionId = networkConfig[chainId]["subscriptionId"];
  }

  const gasLane = networkConfig[chainId]["gasLane"];
  const callbackGasLimit = networkConfig[chainId]["callbackGasLimit"];
  const args = [
    vrfCoordinator,
    gasLane,
    subscriptionId,
    callbackGasLimit,
    tokenUris,
    networkConfig[chainId]["mintFee"],
  ];

  const RandomIpfsNFT = await deploy("RandomIpfsNFT", {
    from: deployer,
    args: args,
    log: true,
    waitConfirmations: network.config.blockConfirmations || 1,
  });

  if (chainId == 31337) {
    await vrfCoordinatorV2Mock.addConsumer(
      subscriptionId,
      RandomIpfsNFT.address
    );
    log("successful add consumer");
  }

  // Verify the deployment
  if (
    !developmentChains.includes(network.name) &&
    process.env.EtherScan_API_KEY
  ) {
    log("Verifying...");
    await verify(RandomIpfsNFT.address, args);
  }
};

// return array of tokenURIS for us to upload to the smartcontract
async function handleTokenUris() {
  tokenUris = [];

  // Store the image in IPFS
  // store the metadata in IPFS

  // Responses will be the from pinata, and will have the hash of each one of the image
  const { responses: imageUploadResponse, files } = await storeImages(
    imageLocation
  );

  for (imageUploadResponseIndex in imageUploadResponse) {
    // create metadata
    // this means unpack, tokenUriMetaData is going to be equal to this metadataTemplate
    let tokenUriMetaData = { ...metadataTemplate };
    // pug.png, st_bernard.png , drop the extension
    tokenUriMetaData.name = files[imageUploadResponseIndex].replace(".png", "");
    tokenUriMetaData.description = `An adorable ${tokenUriMetaData.name} pup`;
    tokenUriMetaData.image = `ipfs://${imageUploadResponse[imageUploadResponseIndex].IpfsHash}`;
    console.log(`Uploading ${tokenUriMetaData.name}...`);
    //upload the metadata
    const metadataUploadResponse = await storeTokenUriMetadata(
      tokenUriMetaData
    );
    tokenUris.push(`ipfs://${metadataUploadResponse.IpfsHash}`);
  }
  console.log("Token URIs uploaded! They are:");
  console.log(tokenUris);

  return tokenUris;
}

module.exports.tags = ["all", "randomipfs", "main"];
