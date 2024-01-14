import { Web3Button } from "@thirdweb-dev/react";
import { ethers } from "ethers";
import { TruthHubAddress, TruthHubAbi } from "../contracts.js";

export default function RegisterAuthorButton({signature, nostrPublicKey}) {
    
    function castToBytes32String(str) {
        const strToHex = "0x" + str;
        const strTransformed = ethers.utils.hexZeroPad(strToHex, 32)
        return strTransformed;
    }

    return(
        // The Web3Button takes care of the connection to the blockchain and the transaction signing.
        // It only needs to know which contract must contact (the contract address) and the contract ABI
        // Then once clicked it will perform the action specified in the action prop.
        <Web3Button
        contractAddress={TruthHubAddress}
        contractAbi={TruthHubAbi}
        action={async (contract) => {
            await contract.call("registerAuthor", [castToBytes32String(signature), castToBytes32String(nostrPublicKey)]);
            console.log("Welcome to TruthHub as a new author!");
        }}
        >
            Register Author!
        </Web3Button>
    );
}