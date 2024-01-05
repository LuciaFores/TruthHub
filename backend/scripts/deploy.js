const hre = require("hardhat");
const fs = require('fs');

/**
 * Deploys a contract with the given name and arguments, using the provided deployer as the signer.
 *
 * @param {string} contractName - The name of the contract to deploy.
 * @param {any[]} args - The arguments to pass to the contract constructor.
 * @param {import('hardhat/types').Signer} deployer - The signer to use for deploying the contract.
 * @return {Promise<import('hardhat/types').Contract>} The deployed contract instance.
 */
async function deployContract(contractName, args, deployer) {

	console.log(`${contractName} is deploying...`);
	console.log(`Deployer address: ${deployer.address}`);

	const Contract = await hre.ethers.getContractFactory(contractName);
	const contract = await Contract.deploy(...args);
	await contract.waitForDeployment();

	console.log("Contract address:", await contract.getAddress())
	//console.log(`Transaction hash: ${contract.hash}`);
	console.log(`${contractName} deployed`);
	console.log();
	
	let row = `${contractName} ${contract.getAddress()}`;
	for (let i = 0; i < args.length; i++) {
		row += ` "${args[i]}"`;
	}
	fs.appendFileSync('result.txt', row+'\n');
	
	return contract;
}

/**
 */
async function main() {
	
	fs.writeFileSync('result.txt', '');
	console.log();
	
	const [deployer, ...otherAccounts] = await hre.ethers.getSigners();

	const contractVeriToken = await deployContract('VeriToken', [await deployer.getAddress()], deployer);

	const contractArticleNFT = await deployContract('ArticleNFT', [await deployer.getAddress()], deployer);

	const contractTruthHub = await deployContract('TruthHub', [await contractVeriToken.getAddress(), await contractArticleNFT.getAddress()], deployer);

	console.log(`transferOwnership of VeriToken contract from deployer to TruthHub contract...`);
	const result1 = await contractVeriToken.transferOwnership(contractTruthHub.getAddress());
	console.log(`Transaction hash: ${result1.hash}`);
	console.log(`Transaction successed`);
	console.log();
	
	console.log(`transferOwnership of ArticleNFT contract from deployer to TruthHub contract...`);
	const result2 = await contractArticleNFT.transferOwnership(contractTruthHub.getAddress());
	console.log(`Transaction hash: ${result2.hash}`);
	console.log(`Transaction successed`);
	console.log();
}

main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});
