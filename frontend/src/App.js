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
  "id": "f237bf0a1266ece0e2bb70793eca9056dbbfd38eca2ea599ae10827c0bc9956d",
  "pubkey": "9b60c3d36e7b2bf1836b7950a2aeab1652f7bcc487b41a236b210a0713894867",
  "content": "non sono di 0xa96Ec6C037eAFD611AB503EE7550EA17577f8381 ma sono di 0x7F3D8af22294C930B58E3987202F27CBEfbe76E6",
  "kind": 1,
  "created_at": 1705766824,
  "tags": [],
  "sig": "a52391bb3cfb65cb754aa5eed8594e02c3eeed3353c501dd7f5ee7ede8c45c4ef4dffb33c2d45870f91b408ecb0bdaf820b303895a6563b3f7cbb17407a8bc94",
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