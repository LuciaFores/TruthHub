import converter from "bech32-converting";
import VoteButton from "./VoteButton";
import { useState } from "react";

export default function ArticleVisualizer({ article, userVotePrice, userMaximumBoost }) {
    const [votePriceValue, setVotePriceValue] = useState('');
    const [veriAmountValue, setVeriAmountValue] = useState('');


    const handlevotePriceChange = (e) => {
        setVotePriceValue(e.target.value);
    };

    const handleVeriAmountChange = (e) => {
        setVeriAmountValue(e.target.value);
    };

    function updateVote(article, vote) {
        article.vote = vote;
        console.log(article.vote)
    }

    return(
        <div className="card w-auto bg-neutral text-neutral-content mb-8">
            <div className="card-body items-left text-left">
                <div className="flex flex-col w-full">
                    <div className="flex w-full">
                        <div className="flex-grow grid grid-cols-2 card bg-base-300 rounded-box place-items-center">
                            <div className="join mt-8">
                                <svg className="w-6 h-6 text-lime-500 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 14">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13V1m0 0L1 5m4-4 4 4"/>
                                </svg>
                                <input className="join-item btn mx-8 w-8" type="radio" name="options" aria-label="Upvote" onClick={() => updateVote(article, true)}/>                          
                                <input className="join-item btn mx-8 w-8" type="radio" name="options" aria-label="Downvote" onClick={() => updateVote(article, false)}/>
                                <svg className="w-6 h-6 text-red-600 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 14">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 1v12m0 0 4-4m-4 4L1 9"/>
                                </svg>  
                            </div>
                            <div className="mt-8">
                                <VoteButton articleId={article.articleId} voteExpressed={article.vote} votePrice={votePriceValue} veriAmount={veriAmountValue}/>
                            </div>
                            <label className="form-control max-w-xs">
                                <div className="label">
                                    <span className="label-text">Ethers</span>
                                </div>
                                <input className="input input-primary max-w-xs" type="text" placeholder="Vote Price" value={votePriceValue} onChange={handlevotePriceChange}/>
                            </label>
                            <label className="form-control max-w-xs">
                                <div className="label">
                                    <span className="label-text">Veri</span>
                                </div>
                                <input className="input input-primary max-w-xs" type="text" placeholder="Veri" value={veriAmountValue} onChange={handleVeriAmountChange}/>
                            </label>
                            <div className="my-8">
                                <p className="text-xl font-medium">Article Info:</p>
                                <p>Upvotes weights: {article.upvotes * 10**-18}</p>
                                <p>Downvotes weights: {article.downvotes * 10**-18}</p>
                                <p>Upvoters: {article.upvoters}</p>
                                <p>Downvoters: {article.downvoters}</p>
                                <p>Ethers spent to publish: {article.etherSpentToPublish * 10**-18}</p>
                                <p>Minimum block threshold: {article.minimumBlockThreshold}</p>
                                <p>Maximum block threshold: {article.maximumBlockThreshold}</p>
                                <p>Ethers spent in upvotes: {article.ethersSpentInUpvotes * 10**-18}</p>
                                <p>Ethers spent in downvotes: {article.ethersSpentInDownvotes *10**-18}</p>
                                <p>Veri spent in upvotes: {article.veriSpentInUpvotes * 10**-18}</p>
                                <p>Veri spent in downvotes: {article.veriSpentInDownvotes * 10**-18}</p>
                            </div>
                            <p>
                                Min ETH: {userVotePrice} <br/>
                                Max Veri: {userMaximumBoost} <br/>
                            </p>
                        </div>
                        <div className="divider divider-horizontal"></div>
                        <div className="grid grid-rows-2 gap-0">
                            <span className="h-24 card bg-base-300 rounded-box">
                                <p className="text-l mx-4"> Author (Nostr address): {converter('npub').toBech32(article.pubKey)}</p>
                                <p className="text-l mx-4"> Author (Ethereum address): {article.author}</p>
                                <p className="text-l mx-4">Event Id: {article.eventId}</p>
                                <p className="text-l mx-4">Article Id: {article.articleId}</p>
                            </span>
                            <span>Da aggiungere contenuto</span>
                        </div>
                    </div>                           
                </div>
            </div>
        </div>
    );
}