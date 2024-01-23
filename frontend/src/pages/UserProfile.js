import { useEffect, useState } from "react";
import { useConnectionStatus, useAddress, useContract, useContractRead } from "@thirdweb-dev/react";
import { TruthHubAddress, TruthHubAbi, VeriAddress, VeriAbi, ArticleNFTAbi, ArticleNFTAddress } from '../contracts.js';
import ClaimReward from "../components/ClaimRewardButton";
import UserTableInformations from "../components/UserTableInformations";
import CompactArticleVisualizer from "../components/CompactArticleVisualizer";
import CompactNFTVisualizer from "../components/CompactNFTVisualizer";
import { ethers } from "ethers";

// 1000000000000000 -> 0.0001
// 1000000000000000 

// 1000000000000000


async function getArticleInfo(truthHubContractInstance, articleId, isClaimable) {

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
        pubKey,
        isClaimable
    };
}


async function getArticles(address) {
    // Connect to the network
    let provider = new ethers.providers.Web3Provider(window.ethereum);
    // We connect to the Contract using a Provider, so we will only
    // have read-only access to the Contract
    let truthHubContractInstance = new ethers.Contract(TruthHubAddress, TruthHubAbi, provider);
    const articles = [];
    let votedArticles = await truthHubContractInstance.getReaderArticlesVoted(address);
    let publishedArticles = await truthHubContractInstance.getAuthorArticlesPublished(address);

    // map votedArticles hexadecimal x to decimal x
    votedArticles = votedArticles.map((x) => parseInt(x._hex, 16));
    publishedArticles = publishedArticles.map((x) => parseInt(x._hex, 16));

    // create the set of the union of votedArticles and publishedArticles
    const involvedArticles = new Set([...votedArticles, ...publishedArticles]);

    // for each element of involvedArticles
    for (let articleId of involvedArticles) {
        const isVoteOpen = await truthHubContractInstance.isVoteOpen(articleId);
        const isVoteClosed = await truthHubContractInstance.isVoteClosed(articleId);
        const isValidClaimer = await truthHubContractInstance.isValidClaimer(address, articleId);
        if(isVoteOpen || (isValidClaimer && isVoteClosed)){
            const articleInfo = await getArticleInfo(truthHubContractInstance, articleId, isValidClaimer && isVoteClosed);
            articles.push(articleInfo);
        }
        
    }
    return articles;
}


function RenderCompactArticles({ address }) {
    const [articles, setArticles] = useState([]);

    const [articleIdValue, setArticleIdValue] = useState('');

    const handleArticleIdChange = (e) => {
        setArticleIdValue(e.target.value);
    };

    useEffect(() => {
        getArticles(address).then(setArticles)
    }, [address]);

    if (articles.length === 0) {
        return <div></div>
    }

    const cards = articles.map((article) => {
        return <div>
        <CompactArticleVisualizer article={article}/>
        </div>
    });
    return <div>
        <div align='gird grid-row-1 place-items-center'>{cards}</div>
        <div className="grid grid-cols-3">
            <div className="mt-10 ml-20">
                <label className="form-control w-full max-w-xs">
                    <div className="label">
                        <span className="label-text">Insert the Article Id</span>
                    </div>
                    <input className="input input-primary w-full max-w-xs" type="text" placeholder="Article Id" value={articleIdValue} onChange={handleArticleIdChange}/>
                </label>
            </div>  
            <div className="flex mt-20 h-10">
                <ClaimReward articleId={articleIdValue} />
            </div>
        </div>
        </div>
}

async function getAmountVeri(address) {
    // Connect to the network
    let provider = new ethers.providers.Web3Provider(window.ethereum);
    // We connect to the Contract using a Provider, so we will only
    // have read-only access to the Contract
    let veriContractInstance = new ethers.Contract(VeriAddress, VeriAbi, provider);
    let veriAmount = 0;
    if (address !== undefined) {
        veriAmount = await veriContractInstance.balanceOf(address);
    }
    return veriAmount;
}

function RenderNFTsOwned({ address }) {
    const [articles, setArticles] = useState([]);

    useEffect(() => {
        getArticlesNFT(address).then(setArticles)
    }, [address]);

    if (articles.length === 0) {
        return <div></div>
    }

    const cards = articles.map((article) => {
        return <div>
        <CompactNFTVisualizer article={article}/>
        </div>
    });
    return <div align='gird grid-row-1 place-items-center'>{cards}</div>
}

async function getArticlesNFT(address) {
    // Connect to the network
    let provider = new ethers.providers.Web3Provider(window.ethereum);
    // We connect to the Contract using a Provider, so we will only
    // have read-only access to the Contract
    let truthHubContractInstance = new ethers.Contract(TruthHubAddress, TruthHubAbi, provider);
    let articleNFTContractInstance = new ethers.Contract(ArticleNFTAddress, ArticleNFTAbi, provider);
    const totalArticles = await truthHubContractInstance.totalArticles();
    const articles = [];

    for (let articleId = 1; articleId <= totalArticles; articleId++) {
        
        let amount = await articleNFTContractInstance.balanceOf(address, articleId);
        amount = parseInt(amount._hex, 16);
        // if the article is not in votedArticles
        if (amount > 0) {
            const articleInfo = await getArticleInfo(truthHubContractInstance, articleId);
            // create new field in articleInfo struct called amount
            articleInfo.amount = amount;
            articles.push(articleInfo); 
        }            
    }
    return articles;
}

function UserProfile() {
    const address = useAddress();

    const [amountVeri, setAmountVeri] = useState(0);
    useEffect(() => {
        getAmountVeri(address).then(setAmountVeri)
    }, [address]);

    const { contract } = useContract(TruthHubAddress);

    const connectionStatus = useConnectionStatus();
    const isWalletConnected = connectionStatus === "connected";

    const {data: aR, isLoading: isLoadingAR} = useContractRead(contract, "getAuthorReputation", [address]);
    const {data: rR, isLoading: isLoadingrR} = useContractRead(contract, "getReaderReputation", [address]);
    const {data: pP, isLoading: isLoadingPP} = useContractRead(contract, "computePublishPrice", [address]);
    const {data: vP, isLoading: isLoadingVP} = useContractRead(contract, "computeVotePrice", [address]);
    const {data: mB, isLoading: isLoadingMB} = useContractRead(contract, "computeMaximumBoost", [address]);

    const isLoadingAll = (isLoadingAR || isLoadingrR || isLoadingPP || isLoadingVP || isLoadingMB);


    return (
        <div className="flex flex-col min-h-screen">
            {isWalletConnected ? (
                <div>
                    {
                        isLoadingAll && address === undefined ? (
                            <p className="flex text-4xl font-medium mx-auto mt-10">Loading Profile Page...</p>
                            ):(
                            <div className="grid grid-rows-8">
                                <p className="text-4xl font-medium mx-auto mt-10">Welcome {address}!</p>
                                <p className="text-2xl font-medium mx-20 mt-10">User Statistics</p>
                                <UserTableInformations
                                amountVeri={Number(amountVeri) * 10 ** -18}
                                authorReputation={aR}
                                readerReputation={rR}
                                publishPrice={Number(pP) * 10 ** -18}
                                votePrice={Number(vP) * 10 ** -18}
                                maximumBoost={Number(mB) * 10 ** -18}
                                />
                                <p className="text-2xl font-medium mx-20 mt-10">Claim Rewards</p> 
                                <RenderCompactArticles address={address}/>  
                                <p className="text-2xl font-medium mx-20 mt-10">NFTs Owned</p>
                                <RenderNFTsOwned address={address}/>                
                            </div> 
                            )
                    }
                </div>
            ) : (
                    <p className="flex text-4xl font-medium mx-auto mt-10">Connect your wallet to see your profile!</p>
                )}
        </div>
    );
}

export default UserProfile;
