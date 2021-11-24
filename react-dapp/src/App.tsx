import "./App.css";
import React, { useEffect } from "react";
import { useState } from "react";
import { ethers } from "ethers";
import Greeter from "./artifacts/contracts/Greeter.sol/Greeter.json";
import SimpleButton from "./components/SimpleButton";
import SimpleInput from "./components/SimpleInput";
import PersistentDrawerLeft from "./components/PersistentDrawerLeft";
import VoteOption from "./types/VoteOption";
import VoteOptionCard from "./components/VoteOptionCard";
declare let window: any;
const greeterAddress = "0xd2ec51841904c828E2CE5200107B268D105fA1F8";

function App() {
  // store greeting in local state
  const [currentVote, setCurrentVote] = useState<VoteOption>();
  const [voteOptions, setOptions] = useState<VoteOption[]>([]);
  // request access to the user's MetaMask account
  async function requestAccount() {
    const address = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    return address;
  }

  // call the smart contract, read the current greeting value
  async function getCurrentVote() {
    if (typeof window.ethereum !== "undefined") {
      const address = await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(
        greeterAddress,
        Greeter.abi,
        provider
      );
      try {
        const data = await contract.getCurrentVote(address[0]);
        setCurrentVote(data.name);
        console.log("data: ", data);
      } catch (err) {
        console.log("Error: ", err);
      }
    }
  }

  // call the smart contract, send an update
  async function recordVote(vote: VoteOption) {
    if (typeof window.ethereum !== "undefined") {
      const address = await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(greeterAddress, Greeter.abi, signer);
      const transaction = await contract.recordVote(address[0], vote);
      await transaction.wait();
      getCurrentVote();
    }
  }

  async function getOptions() {
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(
        greeterAddress,
        Greeter.abi,
        provider
      );
      try {
        const options = await contract.getOptions();
        console.log("options: ", options);
        setOptions(options);
      } catch (err) {
        console.log("Error: ", err);
      }
    }
  }

  useEffect(() => {
    getCurrentVote();
    getOptions();
  });

  return (
    <div className="App">
      <header className="App-header">
        <p>{currentVote} is your current vote!</p>
        <div>
          <PersistentDrawerLeft />
        </div>

        {voteOptions.map((x) => (
          <>
            <div>
              <VoteOptionCard
                onClick={() => recordVote(x)}
                name={x.name}
                acronym={x.acronym}
              ></VoteOptionCard>
            </div>
            <br />
          </>
        ))}
      </header>
    </div>
  );
}

export default App;
