import { Web3Button } from "@thirdweb-dev/react";
import { TruthHubAddress, TruthHubAbi } from "../contracts.js";
import { ethers } from "ethers";

export default function BuyArticleNFT({articleId, nftAmount, buyPrice}) {

    let provider = new ethers.providers.Web3Provider(window.ethereum);
    let truthHubContractInstance = new ethers.Contract(TruthHubAddress, TruthHubAbi, provider);
    const signer = provider.getSigner();
    truthHubContractInstance = truthHubContractInstance.connect(signer);

    return(
        <Web3Button
        contractAddress={TruthHubAddress}
        contractAbi={TruthHubAbi}
        action={async () => {
            const overrides = {value : String(nftAmount * buyPrice)};
            const buyTransaction = await truthHubContractInstance.buyArticleNFT(articleId, nftAmount, overrides);
            await buyTransaction.wait();
        }}
        onError={(error) => alert(error)}
        >
            Buy NFTs!
        </Web3Button>
    );
}