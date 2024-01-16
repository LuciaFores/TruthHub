import { Web3Button } from "@thirdweb-dev/react";
import converter from "bech32-converting";
import { TruthHubAddress, TruthHubAbi } from "../contracts.js";

export default function RegisterAuthorButton({signature, nostrPublicKey}) {
    
    function bech32ToHex(str, prefix = '') {
        return converter(prefix).toHex(str);
    }

    return(
        // The Web3Button takes care of the connection to the blockchain and the transaction signing.
        // It only needs to know which contract must contact (the contract address) and the contract ABI
        // Then once clicked it will perform the action specified in the action prop.
        <Web3Button
        contractAddress={TruthHubAddress}
        contractAbi={TruthHubAbi}
        action={async (contract) => {
            await contract.call("registerAuthor", [bech32ToHex(signature), bech32ToHex(nostrPublicKey, 'npub')]);
            console.log("Welcome to TruthHub as a new author!");
        }}
        >
            Register Author!
        </Web3Button>
    );
}