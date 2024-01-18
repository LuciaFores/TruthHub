import { Web3Button, useAddress } from "@thirdweb-dev/react";
import { TruthHubAddress, TruthHubAbi } from "../contracts.js";

export default function ComputePublishPrice({ setPublishPrice }) {

    const authorAddress = useAddress();

    return(
        <Web3Button
        contractAddress={TruthHubAddress}
        contractAbi={TruthHubAbi}
        action={async (contract) => {
            const computedPublishPrice = await contract.call("computePublishPrice", [authorAddress]);
            setPublishPrice(Number(computedPublishPrice));
        }}
        >
            Compute your publication price!
        </Web3Button>
    );
}