import { TruthHubAbi, TruthHubAddress, VeriAbi, VeriAddress, ArticleNFTAbi, ArticleNFTAddress } from '../contracts.js';
import { useConnectionStatus, useAddress } from "@thirdweb-dev/react";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import CompactBestArticleVisualizer from "../components/CompactBestArticleVisualizer";
import CompactNFTVisualizer from '../components/CompactNFTVisualizer.js';
import MintArticleNFT from "../components/MintArticleNFTButton";
import BuyArticleNFT from '../components/BuyArticleNFT.js';

async function getIsBestAuthor(address){
    let provider = new ethers.providers.Web3Provider(window.ethereum);
    let truthHubContractInstance = new ethers.Contract(TruthHubAddress, TruthHubAbi, provider);
    let isBestAuthor = undefined;
    if(address !== undefined){
        isBestAuthor = await truthHubContractInstance.isBestAuthor(address);
    }
    return isBestAuthor;
}

async function getMintPrice(){
    let provider = new ethers.providers.Web3Provider(window.ethereum);
    let truthHubContractInstance = new ethers.Contract(TruthHubAddress, TruthHubAbi, provider);
    let mintPrice = await truthHubContractInstance.articleNFTMintInVeri();
    return mintPrice;
}

async function getBuyPrice(){
    let provider = new ethers.providers.Web3Provider(window.ethereum);
    let truthHubContractInstance = new ethers.Contract(TruthHubAddress, TruthHubAbi, provider);
    let buyPrice = await truthHubContractInstance.articleNFTBuyInEther();
    return buyPrice;
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


async function getBestArticles(address) {
    // Connect to the network
    let provider = new ethers.providers.Web3Provider(window.ethereum);
    // We connect to the Contract using a Provider, so we will only
    // have read-only access to the Contract
    let truthHubContractInstance = new ethers.Contract(TruthHubAddress, TruthHubAbi, provider);
    const articles = [];
    let publishedArticles = await truthHubContractInstance.getAuthorArticlesPublished(address);

    // map votedArticles hexadecimal x to decimal x
    publishedArticles = publishedArticles.map((x) => parseInt(x._hex, 16));

    // for each element of publishedArticles
    for (let articleId of publishedArticles) {
        const isBestArticle = await truthHubContractInstance.isBestArticle(articleId);
        if(isBestArticle){
            const articleInfo = await getArticleInfo(truthHubContractInstance, articleId);
            articles.push(articleInfo);
        }
        
    }
    return articles;
}


function RenderCompactBestArticles({ address, mintPrice }) {

    const provider = new ethers.providers.Web3Provider(window.ethereum)
    let veriTokenContractInstance = new ethers.Contract(VeriAddress, VeriAbi, provider);
    const signer = provider.getSigner();
    veriTokenContractInstance = veriTokenContractInstance.connect(signer);

    const [articles, setArticles] = useState([]);

    const [articleIdValue, setArticleIdValue] = useState('');

    const handleArticleIdChange = (e) => {
        setArticleIdValue(e.target.value);
    };

    const [nftAmountValue, setNftAmountValue] = useState('');

    const handleNftAmountChange = (e) => {
        setNftAmountValue(e.target.value);
    };

    useEffect(() => {
        getBestArticles(address).then(setArticles)
    }, [address]);

    if (articles.length === 0) {
        return <div></div>
    }

    const cards = articles.map((article) => {
        return <div>
        <CompactBestArticleVisualizer article={article}/>
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
            <div className="mt-10 ml-20">
                <label className="form-control w-full max-w-xs">
                    <div className="label">
                        <span className="label-text">Insert the amount of NFT</span>
                    </div>
                    <input className="input input-primary w-full max-w-xs" type="text" placeholder="NFT amount" value={nftAmountValue} onChange={handleNftAmountChange}/>
                </label>
            </div>  
            <div className="flex mt-20 h-10">
                <MintArticleNFT articleId={articleIdValue} nftAmount={nftAmountValue} veriTokenContractInstance={veriTokenContractInstance} veriTokenPerArticleMinted={mintPrice}/>
            </div>
        </div>
        </div>
}

function RenderNFTsAvailable({buyPrice}) {
    const [articles, setArticles] = useState([]);

    const [articleIdValue, setArticleIdValue] = useState('');

    const handleArticleIdChange = (e) => {
        setArticleIdValue(e.target.value);
    };

    const [nftAmountValue, setNftAmountValue] = useState('');

    const handleNftAmountChange = (e) => {
        setNftAmountValue(e.target.value);
    };

    useEffect(() => {
        getArticlesNFT().then(setArticles)
    }, []);

    if (articles.length === 0) {
        return <div></div>
    }

    const cards = articles.map((article) => {
        return <div>
        <CompactNFTVisualizer article={article}/>
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
        <div className="mt-10 ml-20">
            <label className="form-control w-full max-w-xs">
                <div className="label">
                    <span className="label-text">Insert the amount of NFTs to buy</span>
                </div>
                <input className="input input-primary w-full max-w-xs" type="text" placeholder="NFT amount" value={nftAmountValue} onChange={handleNftAmountChange}/>
            </label>
        </div>  
        <div className="flex mt-20 h-10">
            <BuyArticleNFT articleId={articleIdValue} nftAmount={nftAmountValue} buyPrice={buyPrice}/>
        </div>
    </div>
    </div>}

async function getArticlesNFT() {
    // Connect to the network
    let provider = new ethers.providers.Web3Provider(window.ethereum);
    // We connect to the Contract using a Provider, so we will only
    // have read-only access to the Contract
    let truthHubContractInstance = new ethers.Contract(TruthHubAddress, TruthHubAbi, provider);
    let articleNFTContractInstance = new ethers.Contract(ArticleNFTAddress, ArticleNFTAbi, provider);
    const totalArticles = await truthHubContractInstance.totalArticles();
    const articles = [];

    for (let articleId = 1; articleId <= totalArticles; articleId++) {
        
        let amount = await articleNFTContractInstance.balanceOf(TruthHubAddress, articleId);
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

function Nft(){
    // controllo se utente è autore o meno
    // se è autore carico la sezione con il bottone per il mint
    // indipendentemente da tutto carico la sezione con il compra

    const connectionStatus = useConnectionStatus();
    const isWalletConnected = connectionStatus === "connected";

    const address = useAddress();

    const [isBestAuthor, setIsBestAuthor] = useState(undefined);
    useEffect(() => {
        getIsBestAuthor(address).then(setIsBestAuthor)
    }, [address]);

    const [mintPrice, setMintPrice] = useState(undefined);
    useEffect(() => {
        getMintPrice().then(setMintPrice)
    }, []);

    const [buyPrice, setBuyPrice] = useState(undefined);
    useEffect(() => {
        getBuyPrice().then(setBuyPrice)
    }, []);

    const isLoading = address === undefined;

    return(
        <div className='flex flex-col min-h-screen'>
            {isWalletConnected ? (
                <div>
                    { isLoading ? (
                        <p className="mx-20 my-10">Loading the page...</p>
                    ) : (
                        <div>
                            <div>
                                { isBestAuthor ? (
                                    <div>
                                        <p className="text-2xl font-medium mx-20 mt-10">Mint Article NFTs for your best articles</p>
                                        <p className="mx-20 mt-10">Each NFT you mint costs: {Number(mintPrice)*10**-18} Veri</p>
                                        <RenderCompactBestArticles address={address} mintPrice={Number(mintPrice)}/>
                                    </div>
                                ) : (
                                    <></>
                                )}
                            </div>
                            <div>
                                <p className="text-2xl font-medium mx-20 mt-10">Buy available Article NFTs</p>
                                <p className="mx-20 mt-10">Each NFT you buy costs: {Number(buyPrice)*10**-18} ETH</p>
                                <RenderNFTsAvailable buyPrice={Number(buyPrice)}/>
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

export default Nft;

