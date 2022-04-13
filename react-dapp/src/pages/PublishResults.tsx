import './Voting.css';

import * as paillierBigint from 'paillier-bigint';
import React, { useEffect, useState } from 'react';

import { Grid, Typography } from '@mui/material';

import { electionAddress, pubKey } from '../Common';
import PersistentDrawerLeft from '../components/PersistentDrawerLeft';
import SimpleButton from '../components/SimpleButton';
import SimpleDialog from '../components/SimpleDialog';
import SimpleInput from '../components/SimpleInput';
import VoteResultCard from '../components/VoteResultCard';
import { getCreator, getOptions, requestAccount } from '../functions/Common';
import {
    decodeResult, decryptTotal, getE, getVotes, publishProofs, publishResults, tallyVotes
} from '../functions/PublishResults';
import VoteOption from '../types/VoteOption';
import VoteResult from '../types/VoteResult';

declare let window: any;

function PublishResults() {
  // store greeting in local state-p
  const [encryptedTotal, setEncryptedTotal] = useState<string>("");
  const [encodedTotal, setEncodedTotal] = useState<string>("");
  const [u, setU] = useState<string>("");
  const [a, setA] = useState<string>("");
  const [z, setZ] = useState<string>("");
  const [e, setE] = useState<string>("");
  const [negativeR, setnegativeR] = useState<string>("");
  const [calculatedResults, setCalculatedResults] = useState<VoteResult[]>([]);
  const [lambda, setLambda] = useState<string>("");
  const [mu, setMu] = useState<string>("");
  const [p, setP] = useState<string>("");
  const [q, setQ] = useState<string>("");

  const [creator, setCreator] = useState<string>("");
  const [currentAddress, setCurrentAddress] = useState<string>("");

  async function processVotes() {
    const options: VoteOption[] = await getOptions();
    const privKey = new paillierBigint.PrivateKey(
      BigInt(lambda),
      BigInt(mu),
      pubKey,
      BigInt(p),
      BigInt(q)
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
    console.log(calculatedResults);
  }

  async function generateProofs() {
    const privKey = new paillierBigint.PrivateKey(
      BigInt(lambda),
      BigInt(mu),
      pubKey,
      BigInt(p),
      BigInt(q)
    );
    const r_e = await getE();
    const calcA = pubKey.encrypt(BigInt(0));
    const r = privKey.getRandomFactor(calcA);
    const calcE = BigInt(r_e);

    const negativeTotal = BigInt(encodedTotal) * BigInt(-1);
    const enc_negativeTotal = pubKey.encrypt(negativeTotal);
    const negativeR = privKey.getRandomFactor(enc_negativeTotal);
    const enc_zero = pubKey.addition(BigInt(encryptedTotal), enc_negativeTotal);
    const calcU = enc_zero;
    const calcV = privKey.getRandomFactor(calcU);

    const calcZ = (r * calcV ** calcE) % pubKey.n;
    console.log(pubKey.encrypt(BigInt(0), calcZ));
    console.log((calcA * calcU ** calcE) % pubKey._n2);
    setU(calcU.toString());
    setA(calcA.toString());
    setZ(calcZ.toString());
    setE(calcE.toString());
    setnegativeR(negativeR.toString());
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
    electionAddress !== "" && initialLoad();
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
                  u: {u}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography color="white" style={{ wordWrap: "break-word" }}>
                  a: {a}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography color="white" style={{ wordWrap: "break-word" }}>
                  z: {z}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography color="white" style={{ wordWrap: "break-word" }}>
                  e: {e}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography color="white" style={{ wordWrap: "break-word" }}>
                  Negative r: {negativeR}
                </Typography>
              </Grid>
            </Grid>
            <Grid container item spacing={3} xs={4} alignItems="flex-start">
              <Grid item xs={12}>
                <SimpleInput setState={setLambda} label="Lambda:"></SimpleInput>
              </Grid>
              <Grid item xs={12}>
                <SimpleInput setState={setMu} label="Mu:"></SimpleInput>
              </Grid>
              <Grid item xs={12}>
                <SimpleInput setState={setP} label="P:"></SimpleInput>
              </Grid>
              <Grid item xs={12}>
                <SimpleInput setState={setQ} label="Q:"></SimpleInput>
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
                    publishProofs(
                      encryptedTotal,
                      encodedTotal,
                      u,
                      a,
                      z,
                      negativeR
                    )
                  }
                >
                  Publish Proofs
                </SimpleButton>
              </Grid>
              <Grid item xs={12}>
                <SimpleButton onClick={() => publishResults(calculatedResults)}>
                  Publish Vote Counts
                </SimpleButton>
              </Grid>
            </Grid>
          </Grid>
        </header>
      </div>
      {electionAddress === "" && (
        <SimpleDialog message="You have not selected an election!"></SimpleDialog>
      )}
    </>
  );
}

export default PublishResults;
