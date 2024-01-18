import { useState } from "react";
import { useConnectionStatus } from "@thirdweb-dev/react";
import write_article from "../images/write_article.svg";
import PublishArticleButton from "../components/PublishArticleButton";
import ComputePublishPrice from "../components/ComputePublishPriceButton";

export default function PublishArticle(){
    const [articleEventIdValue, setEventIdValue] = useState('');
    const [publishCostValue, setPublishCostValue] = useState('');


    const handleEventIdChange = (e) => {
        setEventIdValue(e.target.value);
    };

    const handlePublishCostChange = (e) => {
        setPublishCostValue(e.target.value);
    };

    const [publishPrice, setPublishPrice] = useState(0);

    const isPriceComputed = publishPrice !== 0;


    const connectionStatus = useConnectionStatus();
    const isWalletConnected = connectionStatus === "connected";

    return(
        <div className="flex flex-col min-h-screen">
            <div>
                <p className="flex text-8xl font-medium my-10 place-content-center">Write a new article!</p>
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
                        Remember that in order to publish an article on TruthHub you must publish it on Nostr first and you will start collecting votes by the community. <br/>
                        Remember that you need to be a registered author to write an article on TruthHub!
                    </p>
                </div>
            </div>
            {isWalletConnected ? (
                <div className="container mx-20">
                    <div className="grid grid-rows-2">
                        {/*Row 1*/}
                        <div className="grid grid-cols-3">
                            {/*Col 1*/}
                            <div className="my-10">
                                <ComputePublishPrice setPublishPrice={setPublishPrice}/>
                            </div>
                            {/*Col 2*/}
                            <div className="flex text-l my-10">
                                { isPriceComputed ? (
                                <p>
                                    If you want to publish an article on TruthHub you need to pay at least {publishPrice} Wei <br/>
                                    You can also pay more if you want, just insert the amount you want to pay below.
                                </p>
                                ) : (
                                <p>
                                    Click on the button to compute the minimum amount you need to pay to publish an article on TruthHub!
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
                                    <span className="label-text">Insert the amount you want to pay (in Wei)</span>
                                </div>
                                <input className="input input-primary w-full max-w-xs" type="text" placeholder="Publish Cost" value={publishCostValue} onChange={handlePublishCostChange}/>
                            </label>
                            </div>
                            {/*Col 3*/}
                            <div className="flex place-content-center mt-8 mb-10 h-12">
                                <PublishArticleButton eventId={articleEventIdValue} publishCost={publishCostValue}/> 
                            </div>
                        </div> 
                    </div>                      
                </div>
            ) : (
                <></>
            )} 
        </div>
    );
}