import "./Voting.css";

import { Grid, Typography } from "@mui/material";
import * as paillierBigint from "paillier-bigint";
import React, { useEffect, useState } from "react";

import PersistentDrawerLeft from "../components/PersistentDrawerLeft";
import SimpleButton from "../components/SimpleButton";
import SimpleInput from "../components/SimpleInput";
import VoteResultCard from "../components/VoteResultCard";
import { pubKey } from "../Election";
import { getCreator, getOptions, requestAccount } from "../functions/Common";
import {
  decodeResult,
  decryptTotal,
  getVotes,
  publishResultsAndProof,
  tallyVotes,
} from "../functions/PublishResults";
import VoteOption from "../types/VoteOption";
import VoteResult from "../types/VoteResult";

declare let window: any;

function PublishResults() {
  // store greeting in local state-p
  const [encryptedTotal, setEncryptedTotal] = useState<string>("");
  const [encodedTotal, setEncodedTotal] = useState<string>("");
  const [encryptedZero, setEncryptedZero] = useState<string>("");
  const [negativeTotal, setNegativeTotal] = useState<string>("");
  const [calculatedResults, setCalculatedResults] = useState<VoteResult[]>([]);
  const [lambda, setLambda] = useState<string>("");
  const [mu, setMu] = useState<string>("");

  const [creator, setCreator] = useState<string>("");
  const [currentAddress, setCurrentAddress] = useState<string>("");

  async function processVotes() {
    const options: VoteOption[] = await getOptions();
    const privKey = new paillierBigint.PrivateKey(
      BigInt(lambda),
      BigInt(mu),
      pubKey
    );
    const raw_results = await getVotes();
    const encrypted_total = tallyVotes(raw_results);

    setEncryptedTotal(encrypted_total.toString());
    const encoded_total = decryptTotal(
      privKey,
      encrypted_total,
      options.length
    );
    setEncodedTotal(encoded_total);
    const decoded_results = decodeResult(encoded_total);
    const results = options.map(function (option, i) {
      return new VoteResult(option, decoded_results![i]);
    });
    setCalculatedResults(results);
  }

  function generateProofs() {
    const privKey = new paillierBigint.PrivateKey(
      BigInt(lambda),
      BigInt(mu),
      pubKey
    );
    const negativeTotal = BigInt(encodedTotal) * BigInt(-1);
    const enc_negativeTotal = pubKey.encrypt(negativeTotal, BigInt(7703));
    const enc_zero = pubKey.addition(BigInt(encryptedTotal), enc_negativeTotal);
    setNegativeTotal(enc_negativeTotal.toString());
    setEncryptedZero(enc_zero.toString());
    console.log(privKey.decrypt(enc_zero));
  }

  useEffect(() => {
    async function initialLoad() {
      const options: VoteOption[] = await getOptions();
      const results = options.map(function (option, i) {
        return new VoteResult(option, 0);
      });
      setCalculatedResults(results);
      const creator = await getCreator();
      setCreator(creator);
      const address = await requestAccount();
      setCurrentAddress(address[0]);
    }
    initialLoad();
  }, [currentAddress]);

  return (
    <>
      <div className="App">
        <header className="App-header">
          <PersistentDrawerLeft
            showCreator={currentAddress === creator.toLowerCase()}
          />
          <br />
          <br />

          <Grid container spacing={3} alignItems="flex-start">
            <Grid container item spacing={3} xs={4} alignItems="flex-start">
              {calculatedResults.map((x, y) => (
                <Grid item key={y} xs={12}>
                  <VoteResultCard voteResult={x}></VoteResultCard>
                </Grid>
              ))}
            </Grid>
            <Grid container item spacing={3} xs={4} alignItems="flex-start">
              <Grid item xs={12}>
                <Typography color="white" style={{ wordWrap: "break-word" }}>
                  Encrypted Total: {encryptedTotal}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography color="white" style={{ wordWrap: "break-word" }}>
                  Encoded Total: {encodedTotal}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography color="white" style={{ wordWrap: "break-word" }}>
                  Encrypted Negative Total: {negativeTotal}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography color="white" style={{ wordWrap: "break-word" }}>
                  Encrypted Zero: {encryptedZero}
                </Typography>
              </Grid>
            </Grid>
            <Grid container item spacing={3} xs={4} alignItems="flex-start">
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
              <Grid item xs={12}>
                <SimpleButton onClick={generateProofs}>
                  Generate Proofs
                </SimpleButton>
              </Grid>
              <Grid item xs={12}>
                <SimpleButton
                  onClick={() =>
                    publishResultsAndProof(
                      calculatedResults,
                      encryptedTotal,
                      encodedTotal,
                      negativeTotal,
                      encryptedZero
                    )
                  }
                >
                  Publish Vote Counts & Proofs
                </SimpleButton>
              </Grid>
            </Grid>
          </Grid>
        </header>
      </div>
    </>
  );
}

export default PublishResults;
