import { ConnectWallet } from "@thirdweb-dev/react";

export default function MetaMaskButton(){
    return(
        <ConnectWallet
            theme={"dark"}
            btnTitle={"Connect Wallet"}
            modalTitle={"Choose your wallet"}
            switchToActiveChain={true}
            modalSize={"wide"}
            welcomeScreen={{
            title:
                "Your gateway to the real truth and complete free speech",
            }}
            modalTitleIconUrl={""}
        />
    );
}