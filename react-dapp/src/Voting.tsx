import { Grid } from "@mui/material";
import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import Election from "./artifacts/contracts/Election.sol/Election.json";
import PersistentDrawerLeft from "./components/PersistentDrawerLeft";
import VoteOptionCard from "./components/VoteOptionCard";
import { electionAddress, maxVotes, privKey, pubKey } from "./Election";
import VoteOption from "./types/VoteOption";
import VoteResult from "./types/VoteResult";
import "./Voting.css";

declare let window: any;
function Voting() {
  // store greeting in local state
  const [options, setOptions] = useState<VoteOption[]>([]);
  const [currentVote, setCurrentVote] = useState<String>("");
  const [randomizedOptions, setRandomOptions] = useState<VoteOption[]>([]);
  const [votes, setVotes] = useState<VoteResult[]>([]);
  const [creator, setCreator] = useState<string>("");
  const [currentAddress, setCurrentAddress] = useState<string>("");
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
        electionAddress,
        Election.abi,
        provider
      );
      try {
        const data = await contract.getCurrentVote(address[0]);
        setCurrentVote(data);
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

  // call the smart contract, send an update
  async function recordVote(vote: VoteOption) {
    if (typeof window.ethereum !== "undefined") {
      const address = await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        electionAddress,
        Election.abi,
        signer
      );
      try {
        const voteAsInt = BigInt(10) ** (BigInt(9) * BigInt(vote.power));
        console.log(voteAsInt);
        const encryptedVote = pubKey.encrypt(voteAsInt);
        console.log(encryptedVote);
        const transaction = await contract.recordVote(
          encryptedVote.toString(),
          {
            gasPrice: provider.getGasPrice(),
            gasLimit: 1000000,
          }
        );
        await transaction.wait();
        getCurrentVote();
      } catch (err: unknown) {
        handleRevert(err);
      }
    }
  }

  async function getOptions() {
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
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
        setOptions(options);
        setRandomOptions(randomize(options));
      } catch (err) {
        console.log("Error: ", err);
      }
    }
  }

  useEffect(() => {
    getOptions();
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
            {randomizedOptions.map((x, y) => (
              <Grid item key={y}>
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
    </>
  );
}

export default Voting;
