import React, { useState } from "react";
import Navbar from "./components/Navbar";

function App() {
  const [state, setState] = useState({
    address: "",
    balance: null,
  });

  const updateWalletData = (newData) => {
    setState((prevState) => ({
      ...prevState,
      ...newData,
    }));
  };

  return (
    <div data-theme='synthwave'>
      <Navbar updateWalletData={updateWalletData}/>
      <div>
        <p>Address: {state.address}</p>
        <p>Balance: {state.balance}</p>
      </div>
    </div>
  );
}

export default App;
