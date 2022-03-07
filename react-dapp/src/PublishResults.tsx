import { Grid, Typography } from "@mui/material";
import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import Election from "./artifacts/contracts/Election.sol/Election.json";
import PersistentDrawerLeft from "./components/PersistentDrawerLeft";
import VoteResultCard from "./components/VoteResultCard";
import * as paillierBigint from "paillier-bigint";
import {
  electionAddress,
  maxVotes,
  pubKey,
  tallyVotes,
  decryptTotal,
  decodeResult,
} from "./Election";
import VoteOption from "./types/VoteOption";
import VoteResult from "./types/VoteResult";
import "./Voting.css";
import SimpleInput from "./components/SimpleInput";
import SimpleButton from "./components/SimpleButton";
declare let window: any;

function PublishResults() {
  // store greeting in local state-p
  const [encryptedTotal, setEncryptedTotal] = useState<string>("");
  const [encodedTotal, setEncodedTotal] = useState<string>("");
  const [decodedTotal, setDecodedTotal] = useState<string>("");
  const [options, setOptions] = useState<VoteOption[]>([]);
  const [calculatedResults, setCalculatedResults] = useState<VoteResult[]>([]);
  const [lambda, setLambda] = useState<string>("");
  const [mu, setMu] = useState<string>("");
  // request access to the user's MetaMask account
  async function requestAccount() {
    const address = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    return address;
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
        setOptions(options);
        return options;
      } catch (err) {
        console.log("Error: ", err);
      }
    }
  }
  // call the smart contract, send an update
  async function publishVoteCounts() {
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
        const transaction = await contract.publishResults(calculatedResults, {
          gasPrice: provider.getGasPrice(),
          gasLimit: 1000000,
        });
        await transaction.wait();
      } catch (err: unknown) {
        handleRevert(err);
      }
    }
  }
  async function getVotes() {
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      console.log(provider);
      const contract = new ethers.Contract(
        electionAddress,
        Election.abi,
        provider
      );
      try {
        const raw_results = await contract.getVotes();
        return raw_results;
      } catch (err) {
        console.log("Error: ", err);
      }
    }
  }

  async function processVotes() {
    const options: VoteOption[] = await getOptions();
    const privKey = new paillierBigint.PrivateKey(
      BigInt(lambda),
      BigInt(mu),
      pubKey
    );
    const raw_results = await getVotes();
    const encrypted_total = tallyVotes(raw_results);

    setEncryptedTotal(encryptedTotal);
    const encoded_total = decryptTotal(
      privKey,
      encrypted_total,
      options.length
    );
    setEncodedTotal(encoded_total);
    const decoded_results = decodeResult(encoded_total);
    setDecodedTotal(decoded_results!.toString());
    const results = options.map(function (option, i) {
      return new VoteResult(option, decoded_results![i]);
    });
    setCalculatedResults(results);
    console.log(results);
  }

  useEffect(() => {}, [encodedTotal]);

  return (
    <>
      <div className="App">
        <header className="App-header">
          <PersistentDrawerLeft
            showCreator={currentAddress == creator.toLowerCase()}
          />
          <br />
          <br />

          <Grid container spacing={3} alignItems="flex-start">
            <Grid container item spacing={3} xs={6} alignItems="flex-start">
              {calculatedResults.map((x, y) => (
                <Grid item key={y} xs={12}>
                  <VoteResultCard voteResult={x}></VoteResultCard>
                </Grid>
              ))}
            </Grid>
            <Grid container item spacing={3} xs={6} alignItems="flex-start">
              <Grid item xs={12}>
                <SimpleInput
                  setState={setLambda}
                  state={lambda}
                  label="Lambda:"
                ></SimpleInput>
              </Grid>
              <Grid item xs={12}>
                <SimpleInput
                  setState={setMu}
                  state={mu}
                  label="Mu:"
                ></SimpleInput>
              </Grid>
              <Grid item xs={12}>
                <SimpleButton onClick={processVotes}>
                  Process Votes
                </SimpleButton>
              </Grid>
              {calculatedResults && (
                <Grid item xs={12}>
                  <SimpleButton onClick={publishVoteCounts}>
                    Publish Vote Counts
                  </SimpleButton>
                </Grid>
              )}
            </Grid>
          </Grid>
        </header>
      </div>
    </>
  );
}

export default PublishResults;
