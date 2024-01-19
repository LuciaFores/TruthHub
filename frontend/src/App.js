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
  "id": "4d725a9a382e79abda0e62cda8802e0933ede3f1271daedc14b329d02254489e",
  "pubkey": "9b60c3d36e7b2bf1836b7950a2aeab1652f7bcc487b41a236b210a0713894867",
  "content": "prova onSuccess",
  "kind": 1,
  "created_at": 1705579365,
  "tags": [],
  "sig": "c6a900e687b7d4f9e2c387274990a2fd36bb7cc44058b941b5ab09d954fb7ccf1f1ae0d28ef7a0ac629709288ea5b23f0672d3d42bfa9f1b762514d4dc28e13c",
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