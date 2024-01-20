import { useNostrEvents } from "nostr-react";
import { TruthHubAddress, TruthHubAbi } from "../contracts";
import { useConnectionStatus, useContract, useContractRead } from "@thirdweb-dev/react";
import { useEffect, useState } from "react";
import { ethers } from 'ethers';


export default function Articles() {
    //const { contract, isLoading: isLoadingContract} = useContract(TruthHubAddress);
    let [contract, setContract] = useState(null);
    let [totalArticlesValue, setTotalArticles] = useState(0);

    useEffect(() => {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const truthHubcontract = new ethers.Contract(
            TruthHubAddress,
            TruthHubAbi,
            provider
        );
        setContract(truthHubcontract);
    }, []);

    console.log(contract);

    

    console.log(totalArticlesValue);

    const connectionStatus = useConnectionStatus();
    const isWalletConnected = connectionStatus === "connected";

    {/** 
    const {data: tA, isLoading: isLoadingTA} = useContractRead(contract, "totalArticles");
    let articles = [];
    for (let i = 1; i <= tA; i++) {
        const {data: article, isLoading: isLoadingA} = useContractRead(contract, "articles", [i]);
        const {data: authorNPubKey, isLoading: isLoadingAU} = useContractRead(contract, "authors", [article.author]);
        const { authorEvents } = useNostrEvents({
            filter: {
            authors: [
                {authorNPubKey},
            ],
            since: 0,
            kinds: [1],
            },
        });
        articles.push(article);
    }
    */}

    /*
    async function getTotalArticles(contract) {
        const tA = await contract.call("totalArticles");
        return tA;
    }

    const [totalArticles, setTotalArticles] = useState([]);

    useEffect(() => {
        if(contract){
            getTotalArticles(contract).then(setTotalArticles);
        }
      }, []
    );
    */

    return(
        <div className="flex flex-col min-h-screen">
        {/** {isWalletConnected ? (
            <>
            {events.map((event) => (
               
            ))}
            </>
        ) : (
            <p className="flex text-4xl font-medium mx-auto mt-10">Connect your wallet to read articles!</p>
            )}*/}
            {/**
             * {isLoadingContract ? (
                <p className="flex text-4xl font-medium mx-auto mt-10">Loading Articles...</p>
            ) : (
                <p className="flex text-4xl font-medium mx-auto mt-10">Total Articles: {Number(totalArticlesValue)}</p>
            )} 
             */}
            <p className="flex text-4xl font-medium mx-auto mt-10">Total Articles: {Number(totalArticlesValue)}</p>
        </div>        
    );
}


