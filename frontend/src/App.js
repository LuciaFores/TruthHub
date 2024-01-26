import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import RegisterAuthor from "./pages/RegisterAuthor";
import Articles from "./pages/Articles";
import PublishArticle from "./pages/PublishArticle";
import UserProfile from "./pages/UserProfile";
import Nft from "./pages/Nft";


function App() {
	return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>}/>
          <Route index element={<Home />} />
          <Route path="register" element={<RegisterAuthor/>}/>
          <Route path="publish" element={<PublishArticle/>}/>
          <Route path="articles" element={<Articles/>}/>
          <Route path="nft" element={<Nft/>}/>
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

{
  "id": "92a65413e11a5ba15353f393025ef6744ac0ca2a4d8c79b8009874e991cf5e29",
  "pubkey": "04c915daefee38317fa734444acee390a8269fe5810b2241e5e6dd343dfbecc9",
  "created_at": 1705934937,
  "kind": 1,
  "tags": [],
  "content": "MOST PEOPLE WHO SAY NOSTR WILL NEVER WORK AT SCALE ARE SIMPLY ADDICTED TO TWITTER AND REFUSE TO ADMIT IT TO THEMSELVES.",
  "sig": "917b78c9d09a11b2558a19511c8b31b591d79f192b3f63dcdd35a8a55c77ec6da5788f2ba9cd9b8da89938a8cfe48adc65a1c32a389716182ec5aca113366b69",
  "relays": [
    "wss://nostr.hifish.org/"
  ]
}

{
  "content": "Good morning ☀️ \n\nToday is my birthday and dinner will consist of braised beef short ribs in red wine, baked artichokes, and mashed potatoes.\n\nI don’t even ask for presents anymore. I just want the dinner.",
  "created_at": 1705867648,
  "id": "dfc7c442ab26c3ae6efb980b3575baf946bb878b5903cfecb57427d25578ec6d",
  "kind": 1,
  "pubkey": "6389be6491e7b693e9f368ece88fcd145f07c068d2c1bbae4247b9b5ef439d32",
  "sig": "99ad3d4fdd1593ec8b0eb0c678c65d927c003f0b6b314102a7792311df9cb0d77e7257892a6c4106fe7566e216ebc01e376ef021c54041a43f2ef3ec6691e602",
  "tags": [],
  "relays": [
    "wss://nostr.wine/"
  ]
}

{
  "id": "963d0707060f6bbe8d83431fb273f286bf50942df2df8261d3fb345aa80fd47b",
  "pubkey": "c48e29f04b482cc01ca1f9ef8c86ef8318c059e0e9353235162f080f26e14c11",
  "created_at": 1705887153,
  "kind": 1,
  "tags": [],
  "content": "I’m not so worried about the old totalitarians—the ones that are 70+ years old—they’ll all be dead soon.\n\nI’m more worried about the young, “woke,” neo-communist totalitarians who want to make it trendy to strip away your freedoms.\n\nThey’re less nefarious but more dangerous.\n\nThese are the ones we need to ridicule into oblivion.\n\nAnyway, have a nice evening 🤙",
  "sig": "599f0ba8a19986a4fcebdcc51c17edaa23b9eeb0f0032f9e767f56df77572145c342039518d6a7b2326b1e79bf9ee13c751e306be390df86e6e5342d456641e9",
  "relays": [
    "wss://nostr.hifish.org/"
  ]
}

{
  "id": "f2b5306797de7f5173710f93534490fcf6c2221fb3700608421357838b92cffe",
  "pubkey": "99bb5591c9116600f845107d31f9b59e2f7c7e09a1ff802e84f1d43da557ca64",
  "created_at": 1705921251,
  "kind": 1,
  "tags": [
    [
      "t",
      "Nostr"
    ],
    [
      "t",
      "nostr"
    ],
    [
      "r",
      "https://noogle.lol"
    ]
  ],
  "content": "I'm building a decentralized #Nostr search client that is built on Data Vending Machines.\n\nThe idea is that multiple Nip90 search DVMs (Kind 5302)  apply whatever search algorithms they offer and the client aggregates the results and shows them to the user in a simplistic web app. The user then can open the event in their favorite client. The goal is to decentralize search.\n\nAn early version can be found and tested here:\n\nhttps://noogle.lol",
  "sig": "58d5badc33e8c91fe77fd8d305153a830c5b7f0c6de47e8b258ba29ccede63fe1292d7ebc1c98f6a795c3a265239be397c84f4f5bc9b2c92db04a8700b7be568",
  "relays": [
    "wss://nostr.hifish.org/"
  ]
}

{
  "id": "89d6ac6b7434b3eef93061c8e94293cca59f03ca04313493764f943628e22913",
  "pubkey": "f8e6c64342f1e052480630e27e1016dce35fc3a614e60434fef4aa2503328ca9",
  "created_at": 1705892950,
  "kind": 1,
  "tags": [
    [
      "imeta",
      "url https://image.nostr.build/573ea3e2ff7723ac932fb1e8334a45f31c0eb2419ad47f34f9a8a23d0ab0849d.jpg",
      "blurhash e%OC{iEkt8j[oL_NxCbbj]j[cEs.s,WBfkaKWWWXoKaxV?WWR*bHju",
      "dim 2048x2048"
    ],
    [
      "r",
      "https://image.nostr.build/573ea3e2ff7723ac932fb1e8334a45f31c0eb2419ad47f34f9a8a23d0ab0849d.jpg"
    ]
  ],
  "content": " https://image.nostr.build/573ea3e2ff7723ac932fb1e8334a45f31c0eb2419ad47f34f9a8a23d0ab0849d.jpg ",
  "sig": "348c23fbd29c9c0291501ffe0c6a32b7af7ef96dd87b441005b278090727b7596cdb55aa1f1af07bf987fc976719bd7c10fdd10b733f3401a64c5e33c6183b48",
  "relays": [
    "wss://nostr.hifish.org/"
  ]
}

{
  "id": "9297f56f2a89fd51128bd0d4e16dec7dcbb7079d70084f018d5e71a534693e80",
  "pubkey": "50d94fc2d8580c682b071a542f8b1e31a200b0508bab95a33bef0855df281d63",
  "created_at": 1705938809,
  "kind": 1,
  "tags": [
    [
      "imeta",
      "url https://void.cat/d/BBUBM5G9RcGXdDZGmkiFq6.webp",
      "dim 798x898",
      "x f0f05c62ec7ed200cfc4e976155babe15d1809f6a8e5c47dc7b2feef3bd5555d"
    ]
  ],
  "content": "LOL I have published multiple research articles and have been quoted in other scientific journals before – but this is the first of its kind.\n\n<3\n \nhttps://void.cat/d/BBUBM5G9RcGXdDZGmkiFq6.webp",
  "sig": "005f0c03c24c6023bddab77cc6d9b024fdb522e1d9708339f59bafde33479869b2fb4feead67c9540e47b5e800f91de9d665e5fb4a76122b370b1f6560c9fd87",
  "relays": [
    "wss://nostr.hifish.org/"
  ]
}

{
  "id": "ec8b33ed96cc589d4bbb2fc1cb33c68e6ab5a45c78c27c99176e3677a4918668",
  "pubkey": "eab0e756d32b80bcd464f3d844b8040303075a13eabc3599a762c9ac7ab91f4f",
  "created_at": 1705954755,
  "kind": 1,
  "tags": [],
  "content": "My social media is basically all memes this week since my mother is in town.\n\nAlso, a fun fact about my mother is that she walks around with a handmade wizard-like staff equal to her height rather than use a cane.",
  "sig": "8064f96e4c3ec69901c04ed8a3076e56c8f7df97216213b64aed4ecba0a573da89173c35c4147b1ba8231f036c81343b0aa252ec0dc12b35e41c91dfd8e65ed5",
  "relays": [
    "wss://nostr.hifish.org/"
  ]
}

{
  "id": "0b5dbbfcb1376ac7b350891377533f60dab40396b44af26208fa035d40f32106",
  "pubkey": "4cfcd2f83cb8e9fe2f3c7b871230434aefc76213639012ecdef96d50794c0e52",
  "created_at": 1705935648,
  "kind": 1,
  "tags": [],
  "content": "who wants a surf class ? we accept ₿ 🏄‍♀️\nhttps://m.primal.net/HYnS.jpg",
  "sig": "9e8e1eb5769292c1e57ab26b6fa56c52b26a95a6fbcdb0837fed406f35b2ca5c634fb386dbf198d7080c51c23267cf4b52540ba5e03baeeb036e53771fcb06cc",
  "relays": [
    "wss://nostr.hifish.org/"
  ]
}

{
  "content": "SURROUND YOURSELF WITH GOOD PEOPLE AND THE REST WILL WORK ITSELF OUT 🫡",
  "created_at": 1705975775,
  "id": "ccd730484a1d1282c9986387014e281e6f5f5abc731b49f3eed72d55b8d93533",
  "kind": 1,
  "pubkey": "04c915daefee38317fa734444acee390a8269fe5810b2241e5e6dd343dfbecc9",
  "sig": "9149593912992bef759924cc9cbaa78d594bd0c28446ed2d8cd0d70e15d93b0075d4189809e1b2f626913f2d9a59fc1bb1af379237abf9be09d2f2e5cb2aa29f",
  "tags": [],
  "relays": [
    "wss://nostr.wine/"
  ]
}

{
  "id": "f237bf0a1266ece0e2bb70793eca9056dbbfd38eca2ea599ae10827c0bc9956d",
  "kind": 1,
  "pubkey": "9b60c3d36e7b2bf1836b7950a2aeab1652f7bcc487b41a236b210a0713894867",
  "created_at": 1705766824,
  "content": "non sono di 0xa96Ec6C037eAFD611AB503EE7550EA17577f8381 ma sono di 0x7F3D8af22294C930B58E3987202F27CBEfbe76E6",
  "tags": [],
  "sig": "a52391bb3cfb65cb754aa5eed8594e02c3eeed3353c501dd7f5ee7ede8c45c4ef4dffb33c2d45870f91b408ecb0bdaf820b303895a6563b3f7cbb17407a8bc94",
  "relays": [
    "wss://nostr.hubmaker.io/"
  ]
}

{
  "id": "96ee63ae7d88bc0f4a4ce01136a87d311f48a3dabc12faeafbbef3e3a16f9dcd",
  "kind": 1,
  "pubkey": "9b60c3d36e7b2bf1836b7950a2aeab1652f7bcc487b41a236b210a0713894867",
  "created_at": 1705743160,
  "content": "prova pagamento",
  "tags": [],
  "sig": "9e57f1bf4f09e50164231d3fc4d9418c182334b5e7ff5ed5e5b9a6f19b5aeac4b879b33f4103651a7556d9aa35d99784953b479319894a25f90563ba060fc962",
  "relays": [
    "wss://nostr.hubmaker.io/"
  ]
}

{
  "id": "4d725a9a382e79abda0e62cda8802e0933ede3f1271daedc14b329d02254489e",
  "kind": 1,
  "pubkey": "9b60c3d36e7b2bf1836b7950a2aeab1652f7bcc487b41a236b210a0713894867",
  "created_at": 1705579365,
  "content": "prova onSuccess",
  "tags": [],
  "sig": "c6a900e687b7d4f9e2c387274990a2fd36bb7cc44058b941b5ab09d954fb7ccf1f1ae0d28ef7a0ac629709288ea5b23f0672d3d42bfa9f1b762514d4dc28e13c",
  "relays": [
    "wss://nostr.hubmaker.io/"
  ]
}

{
  "id": "5a8bbede8bcbeb1df4fe7d3da82a3d54850209d82164e9c297fa3a712303e42e",
  "kind": 1,
  "pubkey": "9b60c3d36e7b2bf1836b7950a2aeab1652f7bcc487b41a236b210a0713894867",
  "created_at": 1706266925,
  "content": "I became a good author",
  "tags": [],
  "sig": "1ed85cf6d9cda8128f7632d0e864af6cd16b561b98f1f060d4ff00eec06373b2b274adbd1caa775d1bdab39bdffdf6df4bc5f2b214cdb2b365584a073b139b9f",
  "relays": [
    "wss://nostr.hubmaker.io/"
  ]
}

{
  "id": "5dd209b34ab91355f0319865da5e8ff05c8c9b8872a20f7304c1836705f400d4",
  "kind": 1,
  "pubkey": "9b60c3d36e7b2bf1836b7950a2aeab1652f7bcc487b41a236b210a0713894867",
  "created_at": 1706266935,
  "content": "Final try",
  "tags": [],
  "sig": "20f03178187d1210cb8195286fc969d2c4554adeb89600ae8c0cdc27eacddc764f91067ec8194d1d8bb8a7ba1b565dfdb6ae5cea5d7d99f97089ae62ca3d93ed",
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