import React from "react";

import Navbar from "./components/Navbar";

function App() {
  return (
    <div data-theme='synthwave'>
    <Navbar/>
    <div>
        <p>Address:</p>
        <p>Balance:</p>
    </div>
    </div>
  );
}

export default App;