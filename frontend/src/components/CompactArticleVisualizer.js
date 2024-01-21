export default function CompactArticleVisualizer({article}){
    return(
        <div className="grid grid-cols-5">
            <span>Article Id : {article.articleId}</span>
            <span>{article.isValidClaimer ? "Claimable" : "Pending"}</span>
            <span>Upvotes Weight : {article.upvotes * 10**-18}</span>
            <span>Downvotes Weight : {article.downvotes *10**-18}</span>
            <span><button className="btn btn-primary">More Info</button></span>
        </div>
    );
}