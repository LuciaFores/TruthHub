import React from "react";
import { ethers } from "ethers";

export default function ConnectWalletButton({ updateWalletData }) {
  const btnhandler = () => {
    if (window.ethereum) {
      window.ethereum
        .request({ method: "eth_requestAccounts" })
        .then((res) => accountChangeHandler(res[0]));
    } else {
      alert("Install MetaMask extension!");
    }
  };

  const getbalance = (address) => {
    window.ethereum
      .request({
        method: "eth_getBalance",
        params: [address, "latest"],
      })
      .then((balance) => {
        updateWalletData({
          address,
          balance: ethers.utils.formatEther(balance),
        });
      });
  };

  const accountChangeHandler = (account) => {
    updateWalletData({
      address: account,
    });

    getbalance(account);
  };

  return (
    <div>
      <button class="btn btn-primary" onClick={btnhandler}>
        Connect Wallet
      </button>
    </div>
  );
}
