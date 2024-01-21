import { Web3Button } from "@thirdweb-dev/react";
import { TruthHubAddress, TruthHubAbi } from "../contracts.js";

export default function ClaimReward({articleId}) {
    return(
        <Web3Button
        contractAddress={TruthHubAddress}
        contractAbi={TruthHubAbi}
        action={async (contract) => {
            await contract.call("claimReward", [articleId]);
        }}
        onError={(error) => alert(error)}
        >
            Claim your reward!
        </Web3Button>
    );
}