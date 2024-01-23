import ArticleVisualizer from '../components/ArticleVisualizer.js';
import VoteTableInformations from '../components/VoteTableInformations.js';
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
    let vote = null;



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
        pubKey,
        vote
    };
}


async function getArticles(address) {
    // Connect to the network
    let provider = new ethers.providers.Web3Provider(window.ethereum);
    // We connect to the Contract using a Provider, so we will only
    // have read-only access to the Contract
    let truthHubContractInstance = new ethers.Contract(TruthHubAddress, TruthHubAbi, provider);
    const totalArticles = await truthHubContractInstance.totalArticles();
    const articles = [];
    let votedArticles = await truthHubContractInstance.getReaderArticlesVoted(address);

    // map votedArticles hexadecimal x to decimal x
    votedArticles = votedArticles.map((x) => parseInt(x._hex, 16));

    for (let articleId = 1; articleId <= totalArticles; articleId++) {
        const articleInfo = await getArticleInfo(truthHubContractInstance, articleId);
        const isVoteOpen = await truthHubContractInstance.isVoteOpen(articleId);
        // if the article is not in votedArticles
        if (isVoteOpen && !votedArticles.includes(articleId)) {
            articles.push(articleInfo); 
        }            
    }
    return articles;
}


function RenderArticles({ address, userVotePrice, userMaximumBoost }) {
    const [articles, setArticles] = useState([]);
    useEffect(() => {
        getArticles(address).then(setArticles)
    }, []);

    const cards = articles.map((article) => {
        return <div>
            <ArticleVisualizer article={article} userVotePrice={userVotePrice} userMaximumBoost={userMaximumBoost}/>
        </div>
    });
    return <div align='gird grid-row-1 place-items-center'>{cards}</div>
}

function Articles() {
    const { contract } = useContract(TruthHubAddress);

    const connectionStatus = useConnectionStatus();
    const isWalletConnected = connectionStatus === "connected";

    const address = useAddress();

    const {data: vP, isLoading: isLoadingVP} = useContractRead(contract, "etherVotePrice");
    const {data: eWV, isLoading: isLoadingEWV} = useContractRead(contract, "endWeightVote");
    const {data: uVP, isLoading: isLoadingUVP} = useContractRead(contract, "computeVotePrice", [address]);
    const {data: uMB, isLoading: isLoadingUMB} = useContractRead(contract, "computeMaximumBoost", [address]);
 
    const isLoadingAll = isLoadingUVP || isLoadingUMB || isLoadingVP || isLoadingEWV;     

    return (
        <div className='flex flex-col min-h-screen'>
            {isWalletConnected ? (
                <div>
                    { isLoadingAll ? (
                        <p className="mx-20 my-10">Vote Price and maximum boost are computing</p>
                    ) : (
                        <div className="grid grid-rows-4">
                            {/**Row 1 */}
                            <div className='mx-20 my-10'>
                                <p className='text-l mb-8'>
                                    In the following table are presented all the information about the voting system
                                </p>
                                <VoteTableInformations ethVotePrice={Number(vP) * 10 ** -18}/>
                                <p className='text-l my-8'>
                                    Notice that:<br/>
                                    Each Veri you spend will boost your vote weight by 1<br/>
                                    By paying more ETH you won't increase your vote weight but you will have higher rewards at the end of the vote<br/>
                                    The vote for an article will close upon reaching the vote weight threshold {parseInt(Number(eWV) * 10 ** -18)} or upon reaching the maximum block threshold
                                </p>
                                <RenderArticles address={address} userVotePrice={Number(uVP) * 10 ** -18} userMaximumBoost={Number(uMB) * 10 ** -18}/>
                            </div>
                        </div>
                        
                    )}                    
                </div>
               ) : (
                <h1 className='flex text-4xl font-medium mx-auto mt-10'>Connect your wallet to see the articles</h1>
            )}
        </div>
    );
}

export default Articles; 