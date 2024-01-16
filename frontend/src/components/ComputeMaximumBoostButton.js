import { Web3Button } from "@thirdweb-dev/react";
import { TruthHubAddress, TruthHubAbi } from "../contracts.js";

export default function ComputeMaximumBoost({userAddress}) {
    return(
        <Web3Button
        contractAddress={TruthHubAddress}
        contractAbi={TruthHubAbi}
        action={async (contract) => {
            const result = await contract.call("computeMaximumBoost", [userAddress]);
            console.log("You can maximize the boost to your vote by paying: ", result);
        }}
        >
            Discover how much you can boost your vote!
        </Web3Button>
    );
}