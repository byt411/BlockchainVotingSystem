import "./Voting.css";
import { Grid, Typography } from "@mui/material";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import * as paillierBigint from "paillier-bigint";
import React, { useEffect, useState } from "react";
import DoneOutlinedIcon from "@mui/icons-material/DoneOutlined";
import PersistentDrawerLeft from "../components/PersistentDrawerLeft";
import SimpleButton from "../components/SimpleButton";
import SimpleInput from "../components/SimpleInput";
import VoteResultCard from "../components/VoteResultCard";
import { pubKey, privKey } from "../Election";
import { getCreator, getOptions, requestAccount } from "../functions/Common";
import {
  decodeResult,
  decryptTotal,
  getVotes,
  tallyVotes,
} from "../functions/PublishResults";
import VoteOption from "../types/VoteOption";
import VoteResult from "../types/VoteResult";
import { getVerification } from "../functions/Verification";
import { getResults } from "../functions/Results";

declare let window: any;

function PublishResults() {
  // store greeting in local state-p
  const [tallyCorrect, setTallyCorrect] = useState<boolean>(false);
  const [decodeCorrect, setDecodeCorrect] = useState<boolean>(false);
  const [zeroCorrect, setZeroCorrect] = useState<boolean>(false);
  const [decryptionCorrect, setDecryptionCorrect] = useState<boolean>(false);

  const [creator, setCreator] = useState<string>("");
  const [currentAddress, setCurrentAddress] = useState<string>("");

  async function verifyProofs() {
    const [r_encryptedTotal, r_encodedTotal, r_u, r_a, r_z, r_e, r_r] =
      await getVerification();

    const raw_results = await getVotes();

    const encrypted_total = tallyVotes(raw_results);
    const encryptedTotalMatch = encrypted_total.toString() == r_encryptedTotal;
    setTallyCorrect(encryptedTotalMatch);

    const processed_results = await getResults();
    const options: VoteOption[] = await getOptions();
    const decoded_results = decodeResult(r_encodedTotal);
    const calculated_results = options.map(function (option, i) {
      return new VoteResult(option, decoded_results![i]);
    });
    const resultsCompare = processed_results!.map(
      (entry: VoteResult, i: number) => {
        return calculated_results[i].count == entry.count;
      }
    );

    const resultsMatch = !resultsCompare.includes(false);
    setDecodeCorrect(resultsMatch);
    const negative_Total = BigInt(r_encodedTotal) * BigInt(-1);
    const enc_negativeTotal = pubKey.encrypt(negative_Total, BigInt(r_r));
    const enc_zero = pubKey.addition(
      BigInt(encrypted_total),
      enc_negativeTotal
    );
    const zeroMatch = r_u == enc_zero.toString();
    setZeroCorrect(zeroMatch);

    const z_zero = pubKey.encrypt(BigInt(0), BigInt(r_z));
    const proof = (BigInt(r_a) * BigInt(r_u) ** BigInt(r_e)) % pubKey._n2;
    const zkpMatch = z_zero.toString() == proof.toString();
    setDecryptionCorrect(zkpMatch);
  }

  useEffect(() => {
    async function initialLoad() {
      const creator = await getCreator();
      setCreator(creator);
      const address = await requestAccount();
      setCurrentAddress(address[0]);
      verifyProofs();
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
    </>
  );
}

export default PublishResults;
