import { Web3Button } from "@thirdweb-dev/react";
import { TruthHubAddress, TruthHubAbi } from "../contracts.js";
import { BigNumber } from "bignumber.js";

/* global BigInt */

export default function PublishArticle({articleId, voteExpressed, votePrice, veriAmount}) {
    return(
        <Web3Button
        contractAddress={TruthHubAddress}
        contractAbi={TruthHubAbi}
        action={async (contract) => {
            const overrides = {value : String(votePrice*10**18)};
            veriAmount = String(parseInt(veriAmount * 10**18));
            await contract.call("vote", [articleId, voteExpressed, veriAmount], overrides);
        }}
        onError={(error) => alert(error)}
        > Vote Article
        </Web3Button>
    );
}