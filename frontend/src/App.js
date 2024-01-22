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
  "id": "6bc7a7d8108e9bbfb4f9bc1754067cb9e11f29e9c29c9e2bd5817f88bf192dff",
  "kind": 1,
  "pubkey": "9b60c3d36e7b2bf1836b7950a2aeab1652f7bcc487b41a236b210a0713894867",
  "created_at": 1705766781,
  "content": "sono di 0x7F3D8af22294C930B58E3987202F27CBEfbe76E6",
  "tags": [],
  "sig": "2b960b5f1bdd884afa286cb190ee6dc408526273e4383919cf96355cfdf3f3c529cb9b33c88ebcfaaedde176ab1f115531d6e37eff32022fe68dce3be7c36883",
  "relays": [
    "wss://nostr.hubmaker.io/"
  ]
}


{
  "content": "21",
  "created_at": 1705851969,
  "id": "c8e47b51d77915ff4a00c0b00eec9563d2b588cdfa13b75a74751e7f4fec4d9f",
  "kind": 1,
  "pubkey": "82341f882b6eabcd2ba7f1ef90aad961cf074af15b9ef44a09f9d2a8fbfbe6a2",
  "sig": "9e7fe4a10824a94d49163b02fab4dbc24253ba64464f151dddff7170ec6162f2cbf66bdf0dd62e00e6a9bea923bd8a9ef8231dcb4a34929e6294991f5d895c40",
  "tags": [],
  "relays": [
    "wss://relay.damus.io/"
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