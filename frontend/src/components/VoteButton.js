import { Web3Button } from "@thirdweb-dev/react";
import { TruthHubAddress, TruthHubAbi } from "../contracts.js";

export default function PublishArticle({articleId, voteExpressed, tokenSpentToVote}) {
    return(
        <Web3Button
        contractAddress={TruthHubAddress}
        contractAbi={TruthHubAbi}
        action={async (contract) => {
            await contract.call("vote", [articleId, voteExpressed, tokenSpentToVote]);
            console.log("Congrats on expressing your vote!");
        }}
        >
            {/*da controllare come fare a farlo diventare l'icona di upvote e quella di downvote*/}
        </Web3Button>
    );
}