import { Web3Button } from "@thirdweb-dev/react";
import converter from "bech32-converting";
import { TruthHubAddress, TruthHubAbi } from "../contracts.js";
import { ethers } from "ethers";

export default function RegisterAuthorButton({signature, nostrPublicKey}) {
    
    function bech32ToHex(str, prefix = '') {
        return converter(prefix).toHex(str);
    }

    let provider = new ethers.providers.Web3Provider(window.ethereum);
    let truthHubContractInstance = new ethers.Contract(TruthHubAddress, TruthHubAbi, provider);
    const signer = provider.getSigner();
    truthHubContractInstance = truthHubContractInstance.connect(signer);

    return(
        <Web3Button
        contractAddress={TruthHubAddress}
        contractAbi={TruthHubAbi}
        action={async () => {
            const registerTransaction = await truthHubContractInstance.registerAuthor(bech32ToHex(signature, 'npub'), bech32ToHex(nostrPublicKey, 'npub'));
            await registerTransaction.wait();
        }}
        onError={(error) => alert(error)}
        >
            Register Author!
        </Web3Button>
    );
}