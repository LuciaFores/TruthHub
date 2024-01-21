import converter from "bech32-converting";

export default function ArticleVisualizer({ article }) {
    return(
        <div className="card w-auto bg-neutral text-neutral-content py-10">
            <div className="card-body items-left text-left">
                <div className="flex flex-col w-full">
                    <div className="flex w-full">
                        <div className="grid h-20 flex-grow grid grid-cols-2 card bg-base-300 rounded-box place-items-center">
                            <button className="btn btn-circle btn-outline">
                                <svg class="w-6 h-6 text-lime-500 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 14">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13V1m0 0L1 5m4-4 4 4"/>
                                </svg>
                            </button>
                            <button className="btn btn-circle btn-outline">
                                <svg class="w-6 h-6 text-red-600 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 14">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 1v12m0 0 4-4m-4 4L1 9"/>
                                </svg>                                
                            </button>
                        </div>
                        <div className="divider divider-horizontal"></div>
                        <div className="grid h-20 flex-grow card bg-base-300 rounded-box place-items-center">
                            Published by: {converter('npub').toBech32(article.pubKey)}
                        </div>
                    </div>                           
                    <div className="divider"></div> 
                    <div className="grid h-20 flex-grow card bg-base-300 rounded-box place-items-center">
                        <h2 className="card-title">Event id: {article.eventId}<br/>Article id: {article.articleId}</h2>
                    </div>
            </div>
                <div className="grid grid-cols-2">
                    {/** Col 1 */}
                    <p className="mx-auto mt-10" key={article.eventId}>Da aggiungere contenuto</p>
                    {/** Col 2 */}
                    <div className="mx-auto mt-8">
                        <p className="text-xl font-medium">Article Info:</p>
                        <p>Upvotes weights: {article.upvotes}</p>
                        <p>Downvotes weights: {article.downvotes}</p>
                        <p>Upvoters: {article.upvoters}</p>
                        <p>Downvoters: {article.downvoters}</p>
                        <p>Ethers spent to publish: {article.ethersSpentToPublish}</p>
                        <p>Minimum block threshold: {article.minimumBlockThreshold}</p>
                        <p>Maximum block threshold: {article.maximumBlockThreshold}</p>
                        <p>Ethers spent in upvotes: {article.ethersSpentInUpvotes}</p>
                        <p>Ethers spent in downvotes: {article.ethersSpentInDownvotes}</p>
                        <p>Veri spent in upvotes: {article.veriSpentInUpvotes}</p>
                        <p>Veri spent in downvotes: {article.veriSpentInDownvotes}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}