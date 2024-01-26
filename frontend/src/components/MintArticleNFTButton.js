import { Web3Button } from "@thirdweb-dev/react";
import { TruthHubAddress, TruthHubAbi } from "../contracts.js";
import { ethers } from "ethers";

export default function MintArticleNFT({articleId, nftAmount, veriTokenContractInstance, veriTokenPerArticleMinted}) {
    
    let provider = new ethers.providers.Web3Provider(window.ethereum);
    let truthHubContractInstance = new ethers.Contract(TruthHubAddress, TruthHubAbi, provider);
    const signer = provider.getSigner();
    truthHubContractInstance = truthHubContractInstance.connect(signer);

    return(
        <Web3Button
        contractAddress={TruthHubAddress}
        contractAbi={TruthHubAbi}
        action={async () => {
            const veriTransaction = await veriTokenContractInstance.approve(TruthHubAddress, String(nftAmount * veriTokenPerArticleMinted));
            await veriTransaction.wait();
            const mintTransaction = await truthHubContractInstance.mintArticleNFT(parseInt(articleId), parseInt(nftAmount));
            await mintTransaction.wait();
        }}
        onError={(error) => alert(error)}
        >
            Mint Article NFTs!
        </Web3Button>
    );
}

