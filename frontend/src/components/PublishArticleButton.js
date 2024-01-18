import { Web3Button } from "@thirdweb-dev/react";
import { TruthHubAddress, TruthHubAbi } from "../contracts.js";

export default function PublishArticleButton({eventId, publishCost}) {

    function eventIdToHex(eventId) {
        return "0x" + eventId;
    }

    return(
        <Web3Button
        contractAddress={TruthHubAddress}
        contractAbi={TruthHubAbi}
        action={async (contract) => {
            const overrides = {value : publishCost};
            await contract.call("publishArticle", [eventIdToHex(eventId)], overrides);
        }}
        onSuccess={(success) => alert("Congrats on publishing your article!")}
        onError={(error) => alert(error)}
        >
            Publish your article!
        </Web3Button>
    );
}