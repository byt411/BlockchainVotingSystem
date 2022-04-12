import "./Voting.css";

import { Grid, IconButton, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import PersistentDrawerLeft from "../components/PersistentDrawerLeft";
import SimpleButton from "../components/SimpleButton";
import SimpleInput from "../components/SimpleInput";
import VoteResultCard from "../components/VoteResultCard";
import { privKey, pubKey } from "../Election";
import { getCreator, getOptions, requestAccount } from "../functions/Common";
import { deployElection } from "../functions/Deploy";
import VoteResult from "../types/VoteResult";
import VoteOptionEntry from "../components/VoteOptionEntry";
import VoteOption from "../types/VoteOption";

declare let window: any;

function Deploy() {
  function nothing() {
    const options = optionArray.map((option: any) => option.props.voteOption);
    deployElection(options, endtime, title);
  }
  function addOption() {
    const tempArray: React.ReactElement[] = [
      <VoteOptionEntry
        voteOption={new VoteOption("", "", "", optionArray.length)}
      ></VoteOptionEntry>,
    ];

    setOptionArray(optionArray.concat(tempArray));
  }
  const [creator, setCreator] = useState<string>("");
  const [currentAddress, setCurrentAddress] = useState<string>("");
  useEffect(() => {
    async function initialLoad() {
      const creator = await getCreator();
      setCreator(creator);
      const address = await requestAccount();
      setCurrentAddress(address[0]);
    }
    initialLoad();
  }, [currentAddress]);
  const [optionArray, setOptionArray] = useState<
    React.ReactElement<typeof VoteOptionEntry>[]
  >([
    <VoteOptionEntry
      voteOption={new VoteOption("", "", "", 0)}
    ></VoteOptionEntry>,
  ]);
  const [title, setTitle] = useState<string>("");
  const [endtime, setEndtime] = useState<string>("");
  return (
    <>
      <div className="App">
        <header className="App-header">
          <PersistentDrawerLeft
            showCreator={currentAddress === currentAddress}
          />
          <br />
          <br />

          <Grid container alignItems="center" justifyContent="center">
            <Grid
              container
              item
              xs={5}
              spacing={2}
              alignItems="center"
              justifyContent="center"
              direction="column"
            >
              <Grid item>
                <SimpleInput setState={setTitle} label="Title"></SimpleInput>
              </Grid>
              <Grid item>
                <SimpleInput
                  setState={setEndtime}
                  label="Endtime"
                ></SimpleInput>
              </Grid>
              <Grid item>
                <SimpleButton onClick={addOption}>
                  Add Vote Option <AddIcon fontSize="inherit" />
                </SimpleButton>
              </Grid>
            </Grid>
            <Grid
              container
              item
              xs={5}
              direction="column"
              alignItems="center"
              justifyContent="center"
            >
              {optionArray}
            </Grid>
            <Grid
              container
              item
              xs={2}
              alignItems="center"
              justifyContent="center"
            >
              <Grid item xs={12}>
                <SimpleButton onClick={nothing}>Deploy</SimpleButton>
              </Grid>
            </Grid>
          </Grid>
        </header>
      </div>
    </>
  );
}

export default Deploy;
