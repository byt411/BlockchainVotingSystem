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
import { Grid } from "@mui/material";
declare let window: any;
const greeterAddress = "0x73ad7864C2Ad7400a3340a04972Dc76c9A6Be024";

function App() {
  // store greeting in local state
  const [currentVote, setCurrentVote] = useState<String>("");
  const [voteOptions, setOptions] = useState<VoteOption[]>([]);
  // request access to the user's MetaMask account
  async function requestAccount() {
    const address = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    return address;
  }

  function randomize(input: any[]) {
    let array = input.slice();
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
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
        const randomized = randomize(options);
        setOptions(randomized);
      } catch (err) {
        console.log("Error: ", err);
      }
    }
  }

  useEffect(() => {
    getCurrentVote();
  }, [currentVote]);

  useEffect(() => {
    getOptions();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <p>{currentVote} is your current vote!</p>
        <div>
          <PersistentDrawerLeft />
        </div>
        <Grid container spacing={2} columns={2}>
          {voteOptions.map((x) => (
            <Grid item>
              {x.name !== currentVote ? (
                <VoteOptionCard
                  onClick={() => recordVote(x)}
                  name={x.name}
                  acronym={x.acronym}
                  logourl={x.logourl}
                ></VoteOptionCard>
              ) : (
                <VoteOptionCard
                  onClick={() => recordVote(x)}
                  name={x.name}
                  acronym={x.acronym}
                  logourl={x.logourl}
                  disabled={true}
                ></VoteOptionCard>
              )}
            </Grid>
          ))}
        </Grid>
      </header>
    </div>
  );
}

export default App;
