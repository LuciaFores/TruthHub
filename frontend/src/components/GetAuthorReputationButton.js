import { Web3Button } from "@thirdweb-dev/react";
import { TruthHubAddress, TruthHubAbi } from "../contracts.js";

export default function GetAuthorReputation({authorAddress}) {
    return(
        <Web3Button
        contractAddress={TruthHubAddress}
        contractAbi={TruthHubAbi}
        action={async (contract) => {
            const result = await contract.call("getAuthorReputation", [authorAddress]);
            if (result === 0) {
                console.log("This address is not an author!");
            }
            else {
                console.log("The reputation of this author is: ", result);
            }
        }}
        >
            Find the reputation of the author!
        </Web3Button>
    );
}