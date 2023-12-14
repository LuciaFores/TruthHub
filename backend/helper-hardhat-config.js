const { ethers } = require("hardhat");

const networkConfig = {
  // sepolia
  11155111: {
    name: "sepolia",
    ethUsdPriceFeed: "0x694AA1769357215DE4FAC081bf1f309aDC325306",
    VRFCoordinatorV2: "0x8103B0A8A00be2DDC778e6e7eaa21791Cd364625",
    gasLane:
      "0x474e34a077df58807dbe9c96d3c009b23b3c6d0cce433e59bbf5b34f823bc56c",
    subscriptionId: "7464",
    mintFee: ethers.parseEther("0.1"),
    callbackGasLimit: "500000",
  },
  31337: {
    name: "hardhat",
    gasLane:
      "0x474e34a077df58807dbe9c96d3c009b23b3c6d0cce433e59bbf5b34f823bc56c",
    callbackGasLimit: "500000",
    mintFee: ethers.parseEther("0.1"),
    subscriptionId: "0",
  },
};

const developmentChains = ["hardhat", "localhost"];

const Decimals = 18;
const Initial_Answer = 200000000000;

module.exports = {
  networkConfig,
  developmentChains,
  Decimals,
  Initial_Answer,
};
