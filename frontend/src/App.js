import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import RegisterAuthor from "./pages/RegisterAuthor";
import Articles from "./pages/Articles";
import PublishArticle from "./pages/PublishArticle";
import UserProfile from "./pages/UserProfile";


function App() {
	return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>}/>
          <Route index element={<Home />} />
          <Route path="register" element={<RegisterAuthor/>}/>
          <Route path="articles" element={<Articles/>}/>
          <Route path="publish" element={<PublishArticle/>}/>
          <Route path="profile" element={<UserProfile/>}/>          
      </Routes>
    </BrowserRouter>
	);
}

/*
{
  "id": "96ee63ae7d88bc0f4a4ce01136a87d311f48a3dabc12faeafbbef3e3a16f9dcd",
  "pubkey": "9b60c3d36e7b2bf1836b7950a2aeab1652f7bcc487b41a236b210a0713894867",
  "created_at": 1705743160,
  "kind": 1,
  "tags": [],
  "content": "prova pagamento",
  "sig": "9e57f1bf4f09e50164231d3fc4d9418c182334b5e7ff5ed5e5b9a6f19b5aeac4b879b33f4103651a7556d9aa35d99784953b479319894a25f90563ba060fc962",
  "relays": [
    "wss://nostr.sats.li/"
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