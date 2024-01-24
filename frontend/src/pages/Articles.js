import ArticleVisualizer from '../components/ArticleVisualizer.js';
import VoteTableInformations from '../components/VoteTableInformations.js';
import { TruthHubAbi, TruthHubAddress, VeriAbi, VeriAddress } from '../contracts.js';
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useConnectionStatus, useAddress } from "@thirdweb-dev/react";

async function getEtherVotePrice(){
    let provider = new ethers.providers.Web3Provider(window.ethereum);
    let truthHubContractInstance = new ethers.Contract(TruthHubAddress, TruthHubAbi, provider);
    let etherVotePrice = await truthHubContractInstance.etherVotePrice();
    return etherVotePrice;
}

async function getEndWeightVote(){
    let provider = new ethers.providers.Web3Provider(window.ethereum);
    let truthHubContractInstance = new ethers.Contract(TruthHubAddress, TruthHubAbi, provider);
    let endWeightVote = await truthHubContractInstance.endWeightVote();
    return endWeightVote;
}

async function getUserVotePrice(address){
    let provider = new ethers.providers.Web3Provider(window.ethereum);
    let truthHubContractInstance = new ethers.Contract(TruthHubAddress, TruthHubAbi, provider);
    let userVotePrice = undefined;
    if(address !== undefined){
        userVotePrice = await truthHubContractInstance.computeVotePrice(address);
    }
    return userVotePrice;
}

async function getUserMaximumBoost(address){
    let provider = new ethers.providers.Web3Provider(window.ethereum);
    let truthHubContractInstance = new ethers.Contract(TruthHubAddress, TruthHubAbi, provider);
    let userMaximumBoost = undefined;
    if(address !== undefined){
        userMaximumBoost = await truthHubContractInstance.computeMaximumBoost(address);
    }
    return userMaximumBoost;
}

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
    let publishedArticles = await truthHubContractInstance.getAuthorArticlesPublished(address);

    // map votedArticles hexadecimal x to decimal x
    votedArticles = votedArticles.map((x) => parseInt(x._hex, 16));
    publishedArticles = publishedArticles.map((x) => parseInt(x._hex, 16));


    for (let articleId = 1; articleId <= totalArticles; articleId++) {
        const articleInfo = await getArticleInfo(truthHubContractInstance, articleId);
        const isVoteOpen = await truthHubContractInstance.isVoteOpen(articleId);
        
        // if the article is not in votedArticles
        if (isVoteOpen && !votedArticles.includes(articleId) && !publishedArticles.includes(articleId)) {
            articles.push(articleInfo); 
        }            
    }
    return articles;
}


function RenderArticles({ address, userVotePrice, userMaximumBoost }) {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    let veriTokenContractInstance = new ethers.Contract(VeriAddress, VeriAbi, provider);
    const signer = provider.getSigner();
    veriTokenContractInstance = veriTokenContractInstance.connect(signer);

    const [articles, setArticles] = useState([]);
    useEffect(() => {
        getArticles(address).then(setArticles)
    }, []);

    const cards = articles.map((article) => {
        return <div>
            <ArticleVisualizer article={article} userVotePrice={userVotePrice} userMaximumBoost={userMaximumBoost} veriTokenContractInstance={veriTokenContractInstance}/>
        </div>
    });
    return <div align='gird grid-row-1 place-items-center'>{cards}</div>
}

function Articles() {
    const connectionStatus = useConnectionStatus();
    const isWalletConnected = connectionStatus === "connected";

    const address = useAddress();

    const [etherVotePrice, setEtherVotePrice] = useState(undefined);
    useEffect(() => {
        getEtherVotePrice().then(setEtherVotePrice);
    }, []);

    const [endWeightVote, setEndWeightVote] = useState(undefined);
    useEffect(() => {
        getEndWeightVote().then(setEndWeightVote);
    }, []);

    const [userVotePrice, setUserVotePrice] = useState(undefined);
    useEffect(() => {
        getUserVotePrice(address).then(setUserVotePrice);
    }, [address]);

    const [userMaximumBoost, setUserMaximumBoost] = useState(undefined);
    useEffect(() => {
        getUserMaximumBoost(address).then(setUserMaximumBoost);
    }, [address]);
 
    const isLoading = address === undefined;     

    return (
        <div className='flex flex-col min-h-screen'>
            {isWalletConnected ? (
                <div>
                    { isLoading ? (
                        <p className="mx-20 my-10">Loading page...</p>
                    ) : (
                        <div className="grid grid-rows-4">
                            {/**Row 1 */}
                            <div className='mx-20 my-10'>
                                <p className='text-l mb-8'>
                                    In the following table are presented all the information about the voting system
                                </p>
                                <VoteTableInformations ethVotePrice={Number(etherVotePrice) * 10 ** -18}/>
                                <p className='text-l my-8'>
                                    Notice that:<br/>
                                    Each Veri you spend will boost your vote weight by 1<br/>
                                    By paying more ETH you won't increase your vote weight but you will have higher rewards at the end of the vote<br/>
                                    The vote for an article will close upon reaching the vote weight threshold {parseInt(Number(endWeightVote) * 10 ** -18)} or upon reaching the maximum block threshold
                                </p>
                                <RenderArticles address={address} userVotePrice={Number(userVotePrice) * 10 ** -18} userMaximumBoost={Number(userMaximumBoost) * 10 ** -18}/>
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