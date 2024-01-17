import { Web3Button } from "@thirdweb-dev/react";
import { TruthHubAddress, TruthHubAbi } from "../contracts.js";

export default function ClaimReward({articleId}) {
    return(
        <Web3Button
        contractAddress={TruthHubAddress}
        contractAbi={TruthHubAbi}
        action={async (contract) => {
            await contract.call("claimReward", [articleId]);
            console.log("Congrats on claiming your reward!");
        }}
        >
            Claim your reward!
        </Web3Button>
    );
}