require("@nomicfoundation/hardhat-toolbox");

// Go to https://alchemy.com, sign up, create a new App in
// its dashboard, and replace "KEY" with its key
const ALCHEMY_API_KEY = "hg19U6MTgcw_qgtPAKyqNbxMmT-iGg2I";

// Replace this private key with your Sepolia account private key
// To export your private key from Coinbase Wallet, go to
// Settings > Developer Settings > Show private key
// To export your private key from Metamask, open Metamask and
// go to Account Details > Export Private Key
// Beware: NEVER put real Ether into testing accounts
const SEPOLIA_PRIVATE_KEY = "d46693a7cde8f114885bf0e8de08c830023f0c5a777bb4f08bb3a84deeb9bdf6";

const ETHERSCAN_API_KEY = "PMZ7FPESZ3JW6TBXAP71HGHZF7BW9YV2MZ";

module.exports = {
  solidity: {
		version: "0.8.22",
		settings: {
			optimizer: {
				enabled: true,
				runs: 200
			}
		}
	},
  networks: {
    sepolia: {
      url: `https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
      accounts: [SEPOLIA_PRIVATE_KEY]
    }
  },
  etherscan: {
		apiKey: ETHERSCAN_API_KEY
	},
};
