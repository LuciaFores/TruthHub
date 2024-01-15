import { useState } from "react";
import { useConnectionStatus } from "@thirdweb-dev/react";
import write_article from "../images/write_article.svg";

export default function WriteArticle(){
    const [articleTitleValue, setArticleTitleValue] = useState('');
    const [articleValue, setArticleValue] = useState('');

    const handleTitleChange = (e) => {
        setArticleTitleValue(e.target.value);
    };

    const handleArticleChange = (e) => {
        setArticleValue(e.target.value);
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
                        Just connect your MetaMask wallet, insert the title of your article and the article itself and you will be ready to go! <br/>
                        Remember that by publishing an article on TruthHub you will store it on a Nostr relay and you will start collecting votes by the community. <br/>
                        Remember that you need to be a registered author to write an article on TruthHub!
                    </p>
                </div>
            </div>
            {isWalletConnected ? (
                <div className="container grid grid-rows-2 mx-20">
                    <div>
                        <label className="form-control w-full max-w-xs">
                            <div className="label">
                                <span className="label-text">Insert the title of your article</span>
                            </div>
                            <input className="input input-primary w-full max-w-xs" type="text" placeholder="Article Title" value={articleTitleValue} onChange={handleTitleChange}/>
                        </label>
                    </div>
                    <div>
                        <div className="grid grid-cols-2">
                            <label className="form-control w-full max-w-4xl mb-4">
                                <div className="label">
                                    <span className="label-text">Write your article</span>
                                </div>
                                <textarea className="textarea textarea-secondary" placeholder="Article" value={articleValue} onChange={handleArticleChange}></textarea>                        
                            </label>
                            <div className="flex place-content-center mt-12">
                                {/** Va sostituito con un web3 button che prima pubblica su nostr, recupera l'event id e poi pubblica su blockchain */}
                                <button className="btn btn-primary">Publish Article!</button> 
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