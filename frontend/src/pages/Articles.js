import ArticleVisualizer from '../components/ArticleVisualizer.js';
import { TruthHubAbi, TruthHubAddress } from '../contracts.js';
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useContract, useContractRead, useAddress, useConnectionStatus } from "@thirdweb-dev/react";



async function getArticleInfo(truthHubContractInstance, articleId) {

    articleId = parseInt(articleId);
    let [ , 
        eventId,
        author,
        upvotes,
        downvotes,
        etherSpentToPublish,
        upvoters,
        downvoters,
        minimumBlockThreshold,
        maximumBlockThreshold,
        ethersSpentInUpvotes,
        ethersSpentInDownvotes,
        veriSpentInUpvotes,
        veriSpentInDownvotes] = await truthHubContractInstance.articles(articleId);

    eventId = eventId.slice(2);
    upvotes = Number(upvotes);
    downvotes = Number(downvotes);
    upvoters = Number(upvoters);
    downvoters = Number(downvoters);
    etherSpentToPublish = Number(etherSpentToPublish);
    minimumBlockThreshold = Number(minimumBlockThreshold);
    maximumBlockThreshold = Number(maximumBlockThreshold);
    ethersSpentInUpvotes = Number(ethersSpentInUpvotes);
    ethersSpentInDownvotes = Number(ethersSpentInDownvotes);
    veriSpentInUpvotes = Number(veriSpentInUpvotes);
    veriSpentInDownvotes = Number(veriSpentInDownvotes);

    let pubKey = await truthHubContractInstance.authors(author);
    let nostrPubKey = pubKey.slice(2);



    return {
        articleId,
        eventId,
        author,
        upvotes,
        downvotes,
        etherSpentToPublish,
        upvoters,
        downvoters,
        minimumBlockThreshold,
        maximumBlockThreshold,
        ethersSpentInUpvotes,
        ethersSpentInDownvotes,
        veriSpentInUpvotes,
        veriSpentInDownvotes,
        pubKey
    };
}


async function getArticles() {
    // Connect to the network
    let provider = new ethers.providers.Web3Provider(window.ethereum);
    // We connect to the Contract using a Provider, so we will only
    // have read-only access to the Contract
    let truthHubContractInstance = new ethers.Contract(TruthHubAddress, TruthHubAbi, provider);
    const totalArticles = await truthHubContractInstance.totalArticles();
    const articles = [];

    for (let articleId = 1; articleId <= totalArticles; articleId++) {
        const articleInfo = await getArticleInfo(truthHubContractInstance, articleId);
        articles.push(articleInfo);        
    }
    return articles;
}


function RenderArticles() {
    const [articles, setArticles] = useState([]);
    useEffect(() => {
        getArticles().then(setArticles)
    }, []);

    const cards = articles.map((article) => {
        return <div>
            <ArticleVisualizer article={article}/>
        </div>
    });
    return <div align='gird grid-row-1 place-items-center'>{cards}</div>
}

function Articles() {
    const { contract } = useContract(TruthHubAddress);

    const connectionStatus = useConnectionStatus();
    const isWalletConnected = connectionStatus === "connected";

    const address = useAddress();

    const {data: vP, isLoading: isLoadingVP} = useContractRead(contract, "computeVotePrice", [address]);
    const {data: mB, isLoading: isLoadingMB} = useContractRead(contract, "computeMaximumBoost", [address]);

    // metti regole generali della votazione dicendo le tre casisitiche generali di voto
    // dici che il pagamaneto in più non influenza il peso di voto ma solo le reward
    // per boostare il peso di voto si possono usare i veri 
 

    return (
        <div className='flex flex-col min-h-screen'>
            {isWalletConnected ? (
                <div>
                    { isLoadingVP || isLoadingMB ? (
                        <p>Vote Price and maximum boost are computing</p>
                    ) : (
                        <RenderArticles/>
                    )}                    
                </div>
               ) : (
                <h1 className='flex text-4xl font-medium mx-auto mt-10'>Connect your wallet to see the articles</h1>
            )}
        </div>
    );
}

export default Articles; 