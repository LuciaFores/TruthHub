import { Web3Button } from "@thirdweb-dev/react";
import { TruthHubAddress, TruthHubAbi } from "../contracts.js";

export default function BuyArticleNFT({articleId, nftAmount, buyPrice}) {
    return(
        <Web3Button
        contractAddress={TruthHubAddress}
        contractAbi={TruthHubAbi}
        action={async (contract) => {
            const overrides = {value : String(buyPrice)};
            await contract.call("buyArticleNFT", [articleId, nftAmount], overrides);
        }}
        onError={(error) => alert(error)}
        >
            Buy NFTs!
        </Web3Button>
    );
}