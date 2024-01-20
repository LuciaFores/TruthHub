import { Web3Button } from "@thirdweb-dev/react";
import { TruthHubAddress, TruthHubAbi } from "../contracts.js";

export default function MintArticleNFT({articleId, nftAmount}) {
    return(
        <Web3Button
        contractAddress={TruthHubAddress}
        contractAbi={TruthHubAbi}
        action={async (contract) => {
            await contract.call("mintArticleNFT", [articleId, nftAmount]);
            console.log("Congrats on minting the NFTs!");
        }}
        onError={(error) => console.log(error)}
        >
            Claim your reward!
        </Web3Button>
    );
}