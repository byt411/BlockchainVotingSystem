import "./Voting.css";
import React, { useEffect } from "react";
import { useState } from "react";
import { ethers } from "ethers";
import Election from "./artifacts/contracts/Election.sol/Election.json";
import * as paillierBigint from "paillier-bigint";
import PersistentDrawerLeft from "./components/PersistentDrawerLeft";
import VoteOption from "./types/VoteOption";
import { Button, Grid } from "@mui/material";
import SimpleDialog from "./components/SimpleDialog";
import VoteResult from "./types/VoteResult";
import VoteResultCard from "./components/VoteResultCard";
import { electionAddress, pubKey, privKey, maxVotes } from "./Election";
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
    const options: VoteOption[] = await getOptions();
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        electionAddress,
        Election.abi,
        signer
      );
      try {
        const raw_results = await contract.tallyVotes();

        let voteResult = BigInt(raw_results[0]);
        console.log(raw_results.length);
        for (let i = 1; i < raw_results.length; i++) {
          voteResult = pubKey.addition(voteResult, BigInt(raw_results[i]));
        }
        let decryptedResult = privKey.decrypt(voteResult).toString();

        while (decryptedResult.length < maxVotes * options.length)
          decryptedResult = "0" + decryptedResult;
        console.log(decryptedResult);
        const decodedResult = decryptedResult
          .toString()
          .match(/\d{1,9}/g)
          ?.map((x) => +x.toString());
        decodedResult?.reverse();
        const results = options.map(function (option, i) {
          return new VoteResult(option, decodedResult![i]);
        });

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
            <PersistentDrawerLeft />
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
