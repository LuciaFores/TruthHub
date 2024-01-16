import React from "react";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import RegisterAuthor from "./pages/RegisterAuthor";
import Articles from "./pages/Articles";
import WriteArticle from "./pages/WriteArticle";
import FunctionTest from "./pages/FunctionTest";


function App() {
	return (
		<div data-theme='synthwave'>
			<Navbar/>
			<WriteArticle/>
      <Footer/>
		</div>
	);
}

/*
{
  "id": "3ced97b0561b9660a5d32af357cb6053350fb3ac3224cc459b06472b9394719e",
  "kind": 1,
  "pubkey": "9b60c3d36e7b2bf1836b7950a2aeab1652f7bcc487b41a236b210a0713894867",
  "created_at": 1705141340,
  "content": "prova ",
  "tags": [],
  "sig": "be4c97c0cd35220a047e3aa95239e01edd1f985d02f624b201dbb8d200bcc406ddf16f75a0a84a489800343709982fd4426861f89ac8b0db2e038628eaca85df",
  "relays": [
    "wss://nostr.hubmaker.io/"
  ]
}
*/

export default App;

/*
To get address and balance of the connected wallet:

// Depenedencies:
import { useBalance, useAddress } from "@thirdweb-dev/react";
import { NATIVE_TOKEN_ADDRESS } from "@thirdweb-dev/sdk"; // this is the address of eth, for custom tokens check thirdweb docs

// Usage:
function App() {
  // ...
  const { data, isLoading } = useBalance(NATIVE_TOKEN_ADDRESS);
  const address = useAddress();
  return (
    // ...
    <div>
        <span>Address:</span>{address && <span> {address} </span>} <br/>
        <span>Balance:</span>{!isLoading && <span> {data.displayValue}</span>}
    </div>
    // ...
  );
}
*/