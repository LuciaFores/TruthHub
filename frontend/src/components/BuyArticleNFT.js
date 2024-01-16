import { Web3Button } from "@thirdweb-dev/react";
import { TruthHubAddress, TruthHubAbi } from "../contracts.js";

export default function BuyArticleNFT({articleId, nftAmount, buyCost}) {
    return(
        <Web3Button
        contractAddress={TruthHubAddress}
        contractAbi={TruthHubAbi}
        action={async (contract) => {
            const overrides = {value : buyCost};
            await contract.call("buyArticleNFT", [articleId, nftAmount], overrides);
            console.log("Congrats on buying the NFTs!");
        }}
        >
            Claim your reward!
        </Web3Button>
    );
}