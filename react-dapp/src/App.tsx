import "./App.css";
import React, { useEffect } from "react";
import { useState } from "react";
import { ethers } from "ethers";
import Election from "./artifacts/contracts/Election.sol/Election.json";
import SimpleButton from "./components/SimpleButton";
import SimpleInput from "./components/SimpleInput";
import PersistentDrawerLeft from "./components/PersistentDrawerLeft";
import VoteOption from "./types/VoteOption";
import VoteOptionCard from "./components/VoteOptionCard";
import { Button, Grid } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import SimpleDialog from "./components/SimpleDialog";
import VoteResult from "./types/VoteResult";
declare let window: any;
const electionAddress = "0xa78EEA8fb1A986317234c6d5a944351084b9837a";

function App() {
  // store greeting in local state
  const [currentVote, setCurrentVote] = useState<String>("");
  const [voteOptions, setOptions] = useState<VoteOption[]>([]);
  const [randomizedOptions, setRandomOptions] = useState<VoteOption[]>([]);
  const [votes, setVotes] = useState<VoteResult[]>([]);
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
        setCurrentVote(data.name);
      } catch (err: unknown) {
        handleRevert(err);
      }
    }
  }
  const emails = ["username@gmail.com", "user02@gmail.com"];
  const [open, setOpen] = React.useState(false);
  const [selectedValue, setSelectedValue] = React.useState(emails[1]);

  const handleClickOpen = () => {
    getVoteCounts();
    setOpen(true);
  };

  const handleClose = (value: string) => {
    setOpen(false);
    setSelectedValue(value);
  };
  async function getVoteCounts() {
    if (typeof window.ethereum !== "undefined") {
      const address = await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(
        electionAddress,
        Election.abi,
        provider
      );
      try {
        const data = await contract.getVoteCounts();
        setVotes(data);
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
        const transaction = await contract.recordVote(address[0], vote.name);
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
        setOptions(options);
        setRandomOptions(randomize(options));
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
          {randomizedOptions.map((x) => (
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
        <Button onClick={handleClickOpen}>Get counts</Button>
        <SimpleDialog
          selectedValue={selectedValue}
          open={open}
          onClose={handleClose}
          votes={votes}
        />
      </header>
    </div>
  );
}

export default App;
