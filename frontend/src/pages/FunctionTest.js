import { useState } from "react";
import RegisterAuthorButton from "../components/RegisterAuthorButton";
import GetAuthorReputation from "../components/GetAuthorReputationButton";

export default function FunctionTest() {
    const [nostrPubKeyValue, setnostrPubKeyValue] = useState('');

    const handleInputChange = (e) => {
        setnostrPubKeyValue(e.target.value);
    };

    return(
        <div>
            <label className="form-control w-full max-w-xs">
            <div className="label">
                <span className="label-text">Insert your Nostr Public Key</span>
            </div>
            <input type="text" placeholder="Nostr Public Key" value={nostrPubKeyValue} onChange={handleInputChange} className="input input-bordered w-full max-w-xs" />
            <RegisterAuthorButton signature={nostrPubKeyValue} nostrPublicKey={nostrPubKeyValue}/>
            </label>
        </div>
    );

    /*
    // AUTHOR REPUTATION
    const [authorAddress, setAuthorAddress] = useState('');

    const handleInputChange = (e) => {
        setAuthorAddress(e.target.value);
    };

    return(
        <div>
            <label className="form-control w-full max-w-xs">
            <div className="label">
                <span className="label-text">Insert the author Ethereum Address</span>
            </div>
            <input type="text" placeholder="Ethereum Address" value={authorAddress} onChange={handleInputChange} className="input input-bordered w-full max-w-xs" />
            <GetAuthorReputation authorAddress={authorAddress}/>
            </label>
        </div>
    );
    */

    /*
    // AUTHOR REGISTRATION

    const [nostrPubKeyValue, setnostrPubKeyValue] = useState('');

    const handleInputChange = (e) => {
        setnostrPubKeyValue(e.target.value);
    };

    return(
        <div>
            <label className="form-control w-full max-w-xs">
            <div className="label">
                <span className="label-text">Insert your Nostr Public Key</span>
            </div>
            <input type="text" placeholder="Nostr Public Key" value={nostrPubKeyValue} onChange={handleInputChange} className="input input-bordered w-full max-w-xs" />
            <RegisterAuthorButton signature={nostrPubKeyValue} nostrPublicKey={nostrPubKeyValue}/>
            </label>
        </div>
    );
    */
}