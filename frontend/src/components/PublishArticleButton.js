import { Web3Button } from "@thirdweb-dev/react";
import { TruthHubAddress, TruthHubAbi } from "../contracts.js";
import { ethers } from "ethers";

export default function PublishArticleButton({eventId, publishCost}) {

    function eventIdToHex(eventId) {
        return "0x" + eventId;
    }

    let provider = new ethers.providers.Web3Provider(window.ethereum);
    let truthHubContractInstance = new ethers.Contract(TruthHubAddress, TruthHubAbi, provider);
    const signer = provider.getSigner();
    truthHubContractInstance = truthHubContractInstance.connect(signer);

    return(
        <Web3Button
        contractAddress={TruthHubAddress}
        contractAbi={TruthHubAbi}
        action={async () => {
            const overrides = {value : String(publishCost*10**18)};
            const publishTransaction = await truthHubContractInstance.publishArticle(eventIdToHex(eventId), overrides);
            await publishTransaction.wait();
        }}
        onError={(error) => alert(error)}
        >
            Publish your article!
        </Web3Button>
    );
}