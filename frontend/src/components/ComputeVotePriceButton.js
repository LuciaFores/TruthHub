import { Web3Button } from "@thirdweb-dev/react";
import { TruthHubAddress, TruthHubAbi } from "../contracts.js";

export default function ComputeVotePrice({readerAddress}) {
    return(
        <Web3Button
        contractAddress={TruthHubAddress}
        contractAbi={TruthHubAbi}
        action={async (contract) => {
            const result = await contract.call("computeVotePrice", [readerAddress]);
            console.log("In order to vote an article you must pay at least: ", result);
        }}
        >
            Compute your vote price!
        </Web3Button>
    );
}