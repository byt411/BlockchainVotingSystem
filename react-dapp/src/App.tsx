import "./App.css";
import React, { useEffect } from "react";
import { useState } from "react";
import { ethers } from "ethers";
import Greeter from "./artifacts/contracts/Greeter.sol/Greeter.json";
import SimpleButton from "./components/SimpleButton";
import SimpleInput from "./components/SimpleInput";
import PersistentDrawerLeft from "./components/PersistentDrawerLeft";
declare let window: any;
const greeterAddress = "0xD2D76C8d875789B34798D618072fBc0D4Dec85D0";

function App() {
  // store greeting in local state
  const [greeting, setGreetingValue] = useState<string>("");
  const [localGreeting, setLocalGreeting] = useState<string>("");
  // request access to the user's MetaMask account
  async function requestAccount() {
    const address = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    return address;
  }

  // call the smart contract, read the current greeting value
  async function fetchGreeting() {
    if (typeof window.ethereum !== "undefined") {
      const address = await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(
        greeterAddress,
        Greeter.abi,
        provider
      );
      try {
        const data = await contract.greet(address[0]);
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
      const address = await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(greeterAddress, Greeter.abi, signer);
      const transaction = await contract.setGreeting(address[0], localGreeting);
      await transaction.wait();
      fetchGreeting();
    }
  }

  async function getAllGreetings() {
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(
        greeterAddress,
        Greeter.abi,
        provider
      );
      try {
        const data = await contract.getAllGreetings();
        console.log("data: ", data);
      } catch (err) {
        console.log("Error: ", err);
      }
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
          <SimpleInput
            setState={setLocalGreeting}
            state={localGreeting}
            label="New Greeting"
          ></SimpleInput>
          <SimpleButton onClick={sendGreeting}>Send Greeting</SimpleButton>
          <SimpleButton onClick={getAllGreetings}>Get all</SimpleButton>
          <PersistentDrawerLeft />
        </div>
      </header>
    </div>
  );
}

export default App;
