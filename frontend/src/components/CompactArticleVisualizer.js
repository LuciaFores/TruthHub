import converter from "bech32-converting";

function ModalArticle({article}){
    const modal = <div>
        {/* You can open the modal using document.getElementById('ID').showModal() method */}
        <button className="btn" onClick={()=>document.getElementById('my_modal_3').showModal()}>More Info</button>
        <dialog id="my_modal_3" className="modal">
        <div className="modal-box">
            <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
            </form>
            <h3 className="font-bold text-lg pb-4">Article Id: {article.articleId}</h3>
            <p> <span className="font-bold">Author (Nostr address):</span> {converter('npub').toBech32(article.pubKey)}</p>
            <p> <span className="font-bold">Author (Ethereum address):</span> {article.author}</p>
            <p className="pb-4"> <span className="font-bold">Event Id:</span> {article.eventId}</p>
            <p><span className="font-bold">Upvotes weights:</span> {parseInt(article.upvotes * 10**-18)}</p>
            <p><span className="font-bold">Downvotes weights:</span> {parseInt(article.downvotes * 10**-18)}</p>
            <p><span className="font-bold">Upvoters:</span> {article.upvoters}</p>
            <p><span className="font-bold">Downvoters:</span> {article.downvoters}</p>
            <p><span className="font-bold">Ethers spent to publish:</span> {article.etherSpentToPublish * 10**-18}</p>
            <p><span className="font-bold">Minimum block threshold:</span> {article.minimumBlockThreshold}</p>
            <p><span className="font-bold">Maximum block threshold:</span> {article.maximumBlockThreshold}</p>
            <p><span className="font-bold">Ethers spent in upvotes:</span> {article.ethersSpentInUpvotes * 10**-18}</p>
            <p><span className="font-bold">Ethers spent in downvotes:</span> {article.ethersSpentInDownvotes *10**-18}</p>
            <p><span className="font-bold">Veri spent in upvotes:</span> {article.veriSpentInUpvotes * 10**-18}</p>
            <p><span className="font-bold">Veri spent in downvotes:</span> {article.veriSpentInDownvotes * 10**-18}</p>
            <p><span className="font-bold">isLegit: </span> {String(article.isLegit)}</p>
            <br/>
            <p><span className="font-bold">Content: </span> {article.isLegit ? (
                <div>
                    <p>{article.content}</p>
                </div>
            ) : (
                <div>
                    <div className="card w-96 bg-error text-error-content">
                        <div className="card-body items-center text-center">
                            <h2 className="card-title">Article Not Legit!</h2>
                            <p>Article content not displayed due to mismatch between
                                who published the article and Nostr PubKey of original author on Nostr</p>
                        </div>
                    </div>
                </div>
            )}</p>
        </div>
        </dialog>
    </div>
    return <div>{modal}</div>
}

export default function CompactArticleVisualizer({article}){
    return(
        <div className="grid grid-cols-5 mx-20">
            <span className="mb-4">Article Id : {article.articleId}</span>
            <span className="mb-4">{article.isClaimable ? "Claimable" : "Pending"}</span>
            <span className="mb-4">Upvotes Weight : {parseInt(article.upvotes * 10**-18)}</span>
            <span className="mb-4">Downvotes Weight : {parseInt(article.downvotes *10**-18)}</span>
            <span className="mb-4 ml-10">isLegit : {String(article.isLegit)}</span>
            <ModalArticle article={article}/>
        </div>
    );
}