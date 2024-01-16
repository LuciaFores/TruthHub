import { Web3Button, useAddress } from "@thirdweb-dev/react";
import { TruthHubAddress, TruthHubAbi } from "../contracts.js";

export default function ComputePublishPrice() {

    const authorAddress = useAddress();

    return(
        <Web3Button
        contractAddress={TruthHubAddress}
        contractAbi={TruthHubAbi}
        action={async (contract) => {
            const result = await contract.call("computePublishPrice", [authorAddress]);
            console.log("In order to publish an article you must pay at least: ", Number(result), " Wei");
        }}
        >
            Compute your publication price!
        </Web3Button>
    );
}