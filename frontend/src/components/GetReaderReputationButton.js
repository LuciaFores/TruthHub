import { Web3Button, useAddress } from "@thirdweb-dev/react";
import { TruthHubAddress, TruthHubAbi } from "../contracts.js";

export default function GetReaderReputation() {

    const readerAddress = useAddress();

    return(
        <Web3Button
        contractAddress={TruthHubAddress}
        contractAbi={TruthHubAbi}
        action={async (contract) => {
            const result = await contract.call("getReaderReputation", [readerAddress]);
            console.log("The reputation of this author is: ", result);
        }}
        >
            Find out your reputation!
        </Web3Button>
    );
}