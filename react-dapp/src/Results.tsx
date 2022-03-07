import { Grid } from "@mui/material";
import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import Election from "./artifacts/contracts/Election.sol/Election.json";
import PersistentDrawerLeft from "./components/PersistentDrawerLeft";
import VoteResultCard from "./components/VoteResultCard";
import { electionAddress, maxVotes, privKey, pubKey } from "./Election";
import VoteOption from "./types/VoteOption";
import VoteResult from "./types/VoteResult";
import "./Voting.css";
declare let window: any;

function Results() {
  // store greeting in local state
  const [votes, setVotes] = useState<VoteResult[]>([]);
  // request access to the user's MetaMask account
  async function requestAccount() {
    const address = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    return address;
  }

  async function getVoteCounts() {
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(
        electionAddress,
        Election.abi,
        provider
      );
      try {
        const results = await contract.getVoteCounts();

        setVotes(results);
        //console.log(results);
      } catch (err: unknown) {
        handleRevert(err);
      }
    }
  }

  function handleRevert(err: unknown) {
    if (err instanceof Error) {
      console.log(err.message);
      const message = err.message.match(/"message":"(.*?)"/)![0].slice(11, -1);
      alert(message.replace("execution reverted: ", ""));
    }
  }
  const [creator, setCreator] = useState<string>("");
  const [currentAddress, setCurrentAddress] = useState<string>("");
  async function getOptions() {
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      console.log(provider);
      const contract = new ethers.Contract(
        electionAddress,
        Election.abi,
        provider
      );
      try {
        const options = await contract.getOptions();
        const address = await requestAccount();
        const creator = await contract.getCreator();
        setCurrentAddress(address);
        setCreator(creator);
        return options;
      } catch (err) {
        console.log("Error: ", err);
      }
    }
  }

  useEffect(() => {
    getVoteCounts();
  }, []);

  return (
    <>
      <div className="App">
        <header className="App-header">
          <div>
            <PersistentDrawerLeft
              showCreator={currentAddress == creator.toLowerCase()}
            />
          </div>
          <br />
          <br />
          <Grid container spacing={2} columns={2}>
            {votes.map((x, y) => (
              <Grid item key={y}>
                <VoteResultCard voteResult={x}></VoteResultCard>
              </Grid>
            ))}
          </Grid>
        </header>
      </div>
    </>
  );
}

export default Results;
