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
  "pubkey": "9b60c3d36e7b2bf1836b7950a2aeab1652f7bcc487b41a236b210a0713894867",
  "content": "sono di 0x7F3D8af22294C930B58E3987202F27CBEfbe76E6",
  "kind": 1,
  "created_at": 1705766781,
  "tags": [],
  "sig": "2b960b5f1bdd884afa286cb190ee6dc408526273e4383919cf96355cfdf3f3c529cb9b33c88ebcfaaedde176ab1f115531d6e37eff32022fe68dce3be7c36883",
  "relays": []
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