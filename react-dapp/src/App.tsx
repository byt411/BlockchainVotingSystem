import "./App.css";
import React, { useEffect } from "react";
import { useState } from "react";
import { ethers } from "ethers";
import Greeter from "./artifacts/contracts/Greeter.sol/Greeter.json";
import SimpleButton from "./components/SimpleButton";
import SimpleInput from "./components/SimpleInput";
declare let window: any;
const greeterAddress = "0x69CFE272aD2A9e264d73D7df49E6bef0B63b7B06";

function App() {
  // store greeting in local state
  const [greeting, setGreetingValue] = useState<string>("");
  const [localGreeting, setLocalGreeting] = useState<string>("");
  // request access to the user's MetaMask account
  async function requestAccount() {
    await window.ethereum.request({ method: "eth_requestAccounts" });
  }

  // call the smart contract, read the current greeting value
  async function fetchGreeting() {
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(
        greeterAddress,
        Greeter.abi,
        provider
      );
      try {
        const data = await contract.greet();
        setGreetingValue(data);
        console.log("data: ", data);
      } catch (err) {
        console.log("Error: ", err);
      }
    }
  }

  // call the smart contract, send an update
  async function sendGreeting() {
    if (!localGreeting) return;
    if (typeof window.ethereum !== "undefined") {
      await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(greeterAddress, Greeter.abi, signer);
      const transaction = await contract.setGreeting(localGreeting);
      await transaction.wait();
      fetchGreeting();
    }
  }

  useEffect(() => {
    fetchGreeting();
  });

  return (
    <div className="App">
      <header className="App-header">
        <p>{greeting} is the current greeting!</p>
        <div>
          <SimpleButton onClick={fetchGreeting}>Fetch Greeting</SimpleButton>
          <SimpleButton onClick={sendGreeting}>Send Greeting</SimpleButton>
        </div>
        <br />
        <div>
          <SimpleInput
            setState={setLocalGreeting}
            state={localGreeting}
            label="New Greeting"
          ></SimpleInput>
        </div>
      </header>
    </div>
  );
}

export default App;
