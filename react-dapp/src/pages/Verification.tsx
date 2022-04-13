import './Voting.css';

import React, { useEffect, useState } from 'react';

import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import DoneOutlinedIcon from '@mui/icons-material/DoneOutlined';
import { Grid, Typography } from '@mui/material';

import { electionAddress, pubKey } from '../Common';
import PersistentDrawerLeft from '../components/PersistentDrawerLeft';
import SimpleDialog from '../components/SimpleDialog';
import {
    getCreator, getOptions, getProofPublished, getResultsPublished, requestAccount
} from '../functions/Common';
import { decodeResult, getVotes, tallyVotes } from '../functions/PublishResults';
import { getResults } from '../functions/Results';
import { getVerification } from '../functions/Verification';
import VoteOption from '../types/VoteOption';
import VoteResult from '../types/VoteResult';

declare let window: any;

function PublishResults() {
  // store greeting in local state-p
  const [tallyCorrect, setTallyCorrect] = useState<boolean>(false);
  const [decodeCorrect, setDecodeCorrect] = useState<boolean>(false);
  const [zeroCorrect, setZeroCorrect] = useState<boolean>(false);
  const [decryptionCorrect, setDecryptionCorrect] = useState<boolean>(false);
  const [proofPublished, setProofPublished] = useState<boolean>(true);
  const [resultsPublished, setResultsPublished] = useState<boolean>(true);

  const [creator, setCreator] = useState<string>("");
  const [currentAddress, setCurrentAddress] = useState<string>("");

  async function verifyProofs() {
    try {
      const [r_encryptedTotal, r_encodedTotal, u, a, z, e, r] =
        await getVerification();

      const raw_results = await getVotes();

      const encrypted_total = tallyVotes(raw_results);

      const encryptedTotalMatch =
        encrypted_total.toString() === r_encryptedTotal;
      setTallyCorrect(encryptedTotalMatch);

      const processed_results = await getResults();
      const options: VoteOption[] = await getOptions();
      const decoded_results = decodeResult(r_encodedTotal);
      const calculated_results = options.map(function (option, i) {
        return new VoteResult(option, decoded_results![i]);
      });
      const resultsCompare = processed_results!.map(
        (entry: VoteResult, i: number) => {
          return calculated_results[i].count === entry.count;
        }
      );

      const resultsMatch = !resultsCompare.includes(false);
      setDecodeCorrect(resultsMatch);
      const negative_Total = BigInt(r_encodedTotal) * BigInt(-1);
      const enc_negativeTotal = pubKey.encrypt(negative_Total, BigInt(r));
      const enc_zero = pubKey.addition(
        BigInt(encrypted_total),
        enc_negativeTotal
      );
      const zeroMatch = u === enc_zero.toString();
      setZeroCorrect(zeroMatch);

      const z_zero = pubKey.encrypt(BigInt(0), BigInt(z));
      const proof = (BigInt(a) * BigInt(u) ** BigInt(e)) % pubKey._n2;
      const zkpMatch = z_zero.toString() === proof.toString();
      setDecryptionCorrect(zkpMatch);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    async function initialLoad() {
      const creator = await getCreator();
      setCreator(creator);
      const address = await requestAccount();
      setCurrentAddress(address[0]);
      const proofPub = await getProofPublished();
      setProofPublished(proofPub);
      const resultsPub = await getResultsPublished();
      setResultsPublished(resultsPub);
      verifyProofs();
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
          {!(proofPublished || resultsPublished) && (
            <SimpleDialog message="Results have not yet been published."></SimpleDialog>
          )}
          <Grid container spacing={3} alignItems="flex-start">
            <Grid container item xs={2}></Grid>
            <Grid container item spacing={3} xs={8} alignItems="flex-start">
              <Grid item xs={12} alignItems="center">
                <Typography color="white" style={{ wordWrap: "break-word" }}>
                  Tallying Correctness:{" "}
                  {tallyCorrect ? (
                    <DoneOutlinedIcon
                      style={{ position: "relative", top: "5px" }}
                    />
                  ) : (
                    <CloseOutlinedIcon
                      style={{ position: "relative", top: "7px" }}
                    />
                  )}
                </Typography>
              </Grid>
              <Grid item xs={12} alignItems="center">
                <Typography color="white" style={{ wordWrap: "break-word" }}>
                  Decoding Correctness:{" "}
                  {decodeCorrect ? (
                    <DoneOutlinedIcon
                      style={{ position: "relative", top: "5px" }}
                    />
                  ) : (
                    <CloseOutlinedIcon
                      style={{ position: "relative", top: "7px" }}
                    />
                  )}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography color="white" style={{ wordWrap: "break-word" }}>
                  Zero Value Correctness:{" "}
                  {zeroCorrect ? (
                    <DoneOutlinedIcon
                      style={{ position: "relative", top: "5px" }}
                    />
                  ) : (
                    <CloseOutlinedIcon
                      style={{ position: "relative", top: "7px" }}
                    />
                  )}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography color="white" style={{ wordWrap: "break-word" }}>
                  Decryption Correctness:{" "}
                  {decryptionCorrect ? (
                    <DoneOutlinedIcon
                      style={{ position: "relative", top: "5px" }}
                    />
                  ) : (
                    <CloseOutlinedIcon
                      style={{ position: "relative", top: "7px" }}
                    />
                  )}
                </Typography>
              </Grid>
            </Grid>
            <Grid container item xs={2}></Grid>
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
