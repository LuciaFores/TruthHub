import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { ThirdwebProvider, metamaskWallet } from "@thirdweb-dev/react";
import { Sepolia } from "@thirdweb-dev/chains";
import { NostrProvider } from "nostr-react";

import "./index.css";


const container = document.getElementById("root");
const root = createRoot(container);
const relayUrls = [
	"wss://relay.damus.io",
  ];

root.render(
	<React.StrictMode>
		<NostrProvider relayUrls={relayUrls} debug={true}>
			<ThirdwebProvider
				activeChain={Sepolia}
				clientId={process.env.REACT_APP_TEMPLATE_CLIENT_ID}
				supportedWallets={[metamaskWallet()]}
			>
				<App />
			</ThirdwebProvider>
		</NostrProvider>
	</React.StrictMode>
);