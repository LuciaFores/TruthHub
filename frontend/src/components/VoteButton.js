import { Web3Button } from "@thirdweb-dev/react";
import { TruthHubAddress, TruthHubAbi } from "../contracts.js";

export default function PublishArticle({articleId, voteExpressed, votePrice, veriAmount, veriTokenContractInstance}) {
    return(
        <Web3Button
        contractAddress={TruthHubAddress}
        contractAbi={TruthHubAbi}
        action={async (contract) => {
            veriAmount = String(veriAmount * 10**18)
            const transaction = await veriTokenContractInstance.approve(TruthHubAddress, veriAmount);
            // wait for transaction to be mined
            await transaction.wait();
            const overrides = {value : String(votePrice*10**18)};
            await contract.call("vote", [articleId, voteExpressed, veriAmount], overrides);
        }}
        onError={(error) => alert(error)}
        > Vote Article
        </Web3Button>
    );
}