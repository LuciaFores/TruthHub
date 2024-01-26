import { Web3Button } from "@thirdweb-dev/react";
import { TruthHubAddress, TruthHubAbi } from "../contracts.js";
import { ethers } from "ethers";

export default function PublishArticle({articleId, voteExpressed, votePrice, veriAmount, veriTokenContractInstance}) {
    let provider = new ethers.providers.Web3Provider(window.ethereum);
    let truthHubContractInstance = new ethers.Contract(TruthHubAddress, TruthHubAbi, provider);
    const signer = provider.getSigner();
    truthHubContractInstance = truthHubContractInstance.connect(signer);
    
    return(
        <Web3Button
        contractAddress={TruthHubAddress}
        contractAbi={TruthHubAbi}
        action={async () => {
            if(veriAmount > 0){
                veriAmount = String(veriAmount * 10**18)
                const veriTransaction = await veriTokenContractInstance.approve(TruthHubAddress, veriAmount);
                // wait for transaction to be mined
                await veriTransaction.wait();
            }
            const overrides = {value : String(votePrice*10**18)};
            const voteTransaction = await truthHubContractInstance.vote(articleId, voteExpressed, veriAmount, overrides);
            await voteTransaction.wait();
        }}
        onError={(error) => alert(error)}
        > Vote Article
        </Web3Button>
    );
}