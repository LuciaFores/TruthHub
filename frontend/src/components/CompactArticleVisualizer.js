export default function CompactArticleVisualizer({article}){
    return(
        <div className="grid grid-cols-5 mx-20">
            <span className="mb-4">Article Id : {article.articleId}</span>
            <span className="mb-4">{article.isClaimable ? "Claimable" : "Pending"}</span>
            <span className="mb-4">Upvotes Weight : {parseInt(article.upvotes * 10**-18)}</span>
            <span className="mb-4">Downvotes Weight : {parseInt(article.downvotes *10**-18)}</span>
            <span className="mb-4"><button className="btn btn-primary">More Info</button></span>
        </div>
    );
}