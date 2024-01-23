import { Web3Button } from "@thirdweb-dev/react";
import { TruthHubAddress, TruthHubAbi } from "../contracts.js";

export default function MintArticleNFT({articleId, nftAmount, veriTokenContractInstance, veriTokenPerArticleMinted}) {
    return(
        <Web3Button
        contractAddress={TruthHubAddress}
        contractAbi={TruthHubAbi}
        action={async (contract) => {
            const transaction = await veriTokenContractInstance.approve(TruthHubAddress, String(nftAmount * veriTokenPerArticleMinted));
            // wait for transaction to be mined
            await transaction.wait();
            await contract.call("mintArticleNFT", [parseInt(articleId), parseInt(nftAmount)]);
        }}
        onError={(error) => alert(error)}
        >
            Mint Article NFTs!
        </Web3Button>
    );
}

