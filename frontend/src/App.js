import React from "react";
import { ThirdwebProvider, metamaskWallet } from "@thirdweb-dev/react";
import { Sepolia } from "@thirdweb-dev/chains";

import Navbar from "./components/Navbar";

function App() {
  return (
    <ThirdwebProvider
      activeChain={ Sepolia }
      clientId="bbf4b688f278621fb82c20026e80eb1d"
      supportedWallets={[metamaskWallet()]}
    >
      <div data-theme='synthwave'>
        <Navbar/>
        <div>
          <p>Address:</p>
          <p>Balance:</p>
        </div>
      </div>
    </ThirdwebProvider>
  );
}

export default App;

/*
import {
  ThirdwebProvider,
  ConnectWallet,
  metamaskWallet,
} from "@thirdweb-dev/react";

export default function App() {
  return (
    <ThirdwebProvider
      activeChain="mumbai"
      clientId="YOUR_CLIENT_ID"
      locale={en()}
      supportedWallets={[metamaskWallet()]}
    >
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
    </ThirdwebProvider>
  );
}

*/
