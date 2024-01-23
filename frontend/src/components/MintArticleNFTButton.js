import { Web3Button } from "@thirdweb-dev/react";
import { TruthHubAddress, TruthHubAbi } from "../contracts.js";

export default function MintArticleNFT({articleId, nftAmount}) {
    return(
        <Web3Button
        contractAddress={TruthHubAddress}
        contractAbi={TruthHubAbi}
        action={async (contract) => {
            await contract.call("mintArticleNFT", [parseInt(articleId), parseInt(nftAmount)]);
        }}
        onError={(error) => alert(error)}
        >
            Mint Article NFTs!
        </Web3Button>
    );
}