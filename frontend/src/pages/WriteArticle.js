import { useState } from "react";
import { useConnectionStatus } from "@thirdweb-dev/react";
import write_article from "../images/write_article.svg";
import PublishArticle from "../components/PublishArticleButton";
import ComputePublishPrice from "../components/ComputePublishPriceButton";

export default function WriteArticle(){
    const [articleeventIdValue, seteventIdValue] = useState('');
    const [publishCostValue, setPublishCostValue] = useState('');


    const handleeventIdChange = (e) => {
        seteventIdValue(e.target.value);
    };

    const handlePublishCostChange = (e) => {
        setPublishCostValue(e.target.value);
    };

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
                        Write a new article on TruthHub! <br/>
                        Just connect your MetaMask wallet, insert the event Id of your article and you will be ready to go! <br/>
                        Remember that in order to publish an article on TruthHub you must publish it on Nostr first and you will start collecting votes by the community. <br/>
                        Remember that you need to be a registered author to write an article on TruthHub!
                    </p>
                </div>
            </div>
            {isWalletConnected ? (
                <div className="container mx-20">
                    <div>
                        <div className="grid grid-cols-2">
                            <label className="form-control w-full max-w-xs">
                                <div className="label">
                                    <span className="label-text">Insert the event id of your article</span>
                                </div>
                                <input className="input input-primary w-full max-w-xs" type="text" placeholder="event id" value={articleeventIdValue} onChange={handleeventIdChange}/>
                            </label>
                            <label className="form-control w-full max-w-xs">
                                <div className="label">
                                    <span className="label-text">Insert the amount you want to pay for you article (in Wei)</span>
                                </div>
                                <input className="input input-primary w-full max-w-xs" type="text" placeholder="Publish Cost" value={publishCostValue} onChange={handlePublishCostChange}/>
                            </label>
                            <div className="flex place-content-center mt-12">
                                <ComputePublishPrice/>
                                {/** Va sostituito con un web3 button che prima pubblica su nostr, recupera l'event id e poi pubblica su blockchain */}
                                <PublishArticle eventId={articleeventIdValue} publishCost={publishCostValue}/> 
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