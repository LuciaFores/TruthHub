import { useState } from "react";
import { useConnectionStatus, useAddress, useContract, useContractRead } from "@thirdweb-dev/react";
import { TruthHubAddress } from "../contracts";
import write_article from "../images/write_article.svg";
import PublishArticleButton from "../components/PublishArticleButton";

export default function PublishArticle(){
    const { contract } = useContract(TruthHubAddress);

    const [articleEventIdValue, setEventIdValue] = useState('');
    const [publishPriceValue, setPublishPriceValue] = useState('');


    const handleEventIdChange = (e) => {
        setEventIdValue(e.target.value);
    };

    const handlePublishPriceChange = (e) => {
        setPublishPriceValue(e.target.value);
    };


    const connectionStatus = useConnectionStatus();
    const isWalletConnected = connectionStatus === "connected";

    const address = useAddress();

    const {data: pP, isLoading: isLoadingPP} = useContractRead(contract, "computePublishPrice", [address]);
    const {data: isAuthor, isLoading: isLoadingAuthor} = useContractRead(contract, "isAuthor", [address]);


    return(
        <div className="flex flex-col min-h-screen">
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
            {isWalletConnected ? (
                    <div>
                        { isLoadingAuthor ? (
                            <p className="mx-20">Loading page...</p>
                        ) : (
                            <div>
                            {isAuthor ? (
                                <div className="container mx-20">
                                <div className="grid grid-rows-2">
                                    {/*Row 1*/}
                                    <div className="grid grid-cols-2">
                                        {/*Col 2*/}
                                        <div className="flex text-l my-10">
                                            { isLoadingPP ? (
                                            <p>
                                            Loading Publish Price...
                                            </p>
                                            ) : (
                                            <p>
                                            If you want to publish an article on TruthHub you need to pay at least {Number(pP) * 10 ** -18} Ethers <br/>
                                            You can also pay more if you want, just insert the amount you want to pay below.
                                            </p>
                                            )}
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