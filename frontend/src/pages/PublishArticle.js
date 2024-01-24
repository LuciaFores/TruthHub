import { useState, useEffect } from "react";
import { useConnectionStatus, useAddress } from "@thirdweb-dev/react";
import { TruthHubAddress, TruthHubAbi } from "../contracts";
import { ethers } from "ethers";
import write_article from "../images/write_article.svg";
import PublishArticleButton from "../components/PublishArticleButton";

async function getPublishPrice(address){
    let provider = new ethers.providers.Web3Provider(window.ethereum);
    let truthHubContractInstance = new ethers.Contract(TruthHubAddress, TruthHubAbi, provider);
    let publishPrice = undefined;
    if(address !== undefined){
        publishPrice = await truthHubContractInstance.computePublishPrice(address);
    }
    return publishPrice;
}

async function getIsAuthor(address){
    let provider = new ethers.providers.Web3Provider(window.ethereum);
    let truthHubContractInstance = new ethers.Contract(TruthHubAddress, TruthHubAbi, provider);
    let isAuthor = undefined;
    if(address !== undefined){
        isAuthor = await truthHubContractInstance.isAuthor(address);
    }
    return isAuthor;
}

function Intestation(){
    return (
        <div>
            <div>
                <p className="flex text-8xl font-medium my-10 place-content-center">Publish a new article!</p>
            </div>
            <div className="container grid grid-cols-2">
                <div className="grid mx-auto">
                    <img className="w-96 h-96" src={write_article} />
                </div>
                <div>
                    <p className="flex text-xl pt-28 pb-10 pr-20">
                        Have something that you want to share with the world? <br/>
                        Publish a new article on TruthHub! <br/>
                        Just connect your MetaMask wallet, insert the event Id of your article and you will be ready to go! <br/>
                        Remember that in order to publish an article on TruthHub you must publish it on Nostr first and once published you will start collecting votes by the community. <br/>
                        Remember that you need to be a registered author to publish an article on TruthHub!
                    </p>
                </div>
            </div>
        </div>
    );
}

function PublishArticleDiv({publishPrice}){

    const [articleEventIdValue, setEventIdValue] = useState('');
    const [publishPriceValue, setPublishPriceValue] = useState('');


    const handleEventIdChange = (e) => {
        setEventIdValue(e.target.value);
    };

    const handlePublishPriceChange = (e) => {
        setPublishPriceValue(e.target.value);
    };

    return (
        <div>
            <div className="container mx-20">
                <div className="grid grid-rows-2">
                    {/*Row 1*/}
                    <div className="grid grid-cols-2">
                        {/*Col 2*/}
                        <div className="flex text-l my-10">
                            <p>
                            If you want to publish an article on TruthHub you need to pay at least {Number(publishPrice) * 10 ** -18} Ethers <br/>
                            You can also pay more if you want, just insert the amount you want to pay below.
                            </p>
                        </div>
                    </div>
                    {/*Row 2*/}
                    <div className="grid grid-cols-4">
                        {/*Col 1*/}
                        <div>
                            <label className="form-control w-full max-w-xs">
                                <div className="label">
                                    <span className="label-text">Insert the Nostr Event Id of your article</span>
                                </div>
                                <input className="input input-primary w-full max-w-xs" type="text" placeholder="Nostr Event Id" value={articleEventIdValue} onChange={handleEventIdChange}/>
                            </label>
                        </div>
                        {/*Col 2*/}
                        <div>
                            <label className="form-control w-full max-w-xs">
                                <div className="label">
                                    <span className="label-text">Insert the amount of Ethers you want to pay</span>
                                </div>
                                <input className="input input-primary w-full max-w-xs" type="text" placeholder="Publish Price" value={publishPriceValue} onChange={handlePublishPriceChange}/>
                            </label>
                        </div>
                        {/*Col 3*/}
                        <div className="flex place-content-center mt-8 mb-10 h-12">
                            <PublishArticleButton eventId={articleEventIdValue} publishCost={publishPriceValue}/> 
                        </div>
                    </div> 
                </div>                      
            </div>
        </div>
    )
}

export default function PublishArticle(){

    const connectionStatus = useConnectionStatus();
    const isWalletConnected = connectionStatus === "connected";

    const address = useAddress();

    const [publishPrice, setPublishPrice] = useState(undefined);
    const [isAuthor, setIsAuthor] = useState(undefined);

    useEffect(() => {
        getPublishPrice(address).then(setPublishPrice)
    }, [address]);

    useEffect(() => {
        getIsAuthor(address).then(setIsAuthor)
    } , [address]);

    const isLoading = address === undefined;

    return(
        <div className="flex flex-col min-h-screen">
            <Intestation/>
            {isWalletConnected ? (
                    <div>
                        { isLoading ? (
                            <p className="mx-20">Loading page...</p>
                        ) : (
                            <div>
                            {isAuthor ? (
                                <PublishArticleDiv publishPrice={publishPrice}/>
                            ) :(
                                <p className="mx-20">You are not an author, if you want to publish an article please register yourself as an author</p>
                            )}
                            </div>
                        )}
                    </div>
            ) : (
                <></>
            )} 
        </div>
    );
}