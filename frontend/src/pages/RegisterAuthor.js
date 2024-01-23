import { useState } from "react";
import { useConnectionStatus, useContract, useContractRead, useAddress } from "@thirdweb-dev/react";
import { TruthHubAddress } from "../contracts";
import RegisterAuthorButton from "../components/RegisterAuthorButton";
import registration_author from "../images/registration_author.svg";

export default function RegisterAuthor() {
    const { contract } = useContract(TruthHubAddress);

    const [nostrPubKeyValue, setnostrPubKeyValue] = useState('');
    const [signatureValue, setSignatureValue] = useState('');

    const handlePubKeyChange = (e) => {
        setnostrPubKeyValue(e.target.value);
    };

    const handleSignatureChange = (e) => {
        setSignatureValue(e.target.value);
    };

    const connectionStatus = useConnectionStatus();
    const isWalletConnected = connectionStatus === "connected";

    const address = useAddress();

    const {data: isAuthor, isLoading: isLoadingAuthor} = useContractRead(contract, "isAuthor", [address]);


    return(
        <div className="flex flex-col min-h-screen">
            <div>
                <p className="flex text-8xl font-medium my-10 place-content-center">Become a TruthHub author!</p>
            </div>
            <div className="container grid grid-cols-2">
                <div className="grid mx-auto">
                    <img className="w-96 h-96" src={registration_author} />
                </div>
                <div>
                    <p className="flex text-xl pt-28 pb-10 pr-20">
                        Can't wait to start writing your articles on TruthHub? <br/>
                        No need to worry you are just a few steps away from becoming a TruthHub author! <br/>
                        Just connect your MetaMask wallet, insert your Nostr public key and your signature and you will be ready to go! <br/>
                        No idea of what the signature is? No problem! Just follow the steps below and the signature will be created for you!
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
                                <p className="mx-20">You are already a TruthHub author!</p>
                            ) : (
                                <div className="container grid grid-cols-3 mx-20">
                                    <div>
                                        <label className="form-control w-full max-w-xs">
                                            <div className="label">
                                                <span className="label-text">Insert your Signature</span>
                                            </div>
                                            <input type="text" placeholder="Signature" value={signatureValue} onChange={handleSignatureChange} className="input input-bordered w-full max-w-xs" />
                                        </label>
                                    </div>
                                    <div>
                                        <label className="form-control w-full max-w-xs">
                                        <div className="label">
                                            <span className="label-text">Insert your Nostr Public Key</span>
                                        </div>
                                        <input type="text" placeholder="Nostr Public Key" value={nostrPubKeyValue} onChange={handlePubKeyChange} className="input input-bordered w-full max-w-xs" />
                                        </label>
                                    </div>
                                    <div className="flex place-content-center my-8">
                                        <RegisterAuthorButton signature={signatureValue} nostrPublicKey={nostrPubKeyValue}/> 
                                    </div>
                                </div>
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