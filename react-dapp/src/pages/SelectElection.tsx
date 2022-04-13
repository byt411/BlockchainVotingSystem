import './Voting.css';

import React, { useEffect, useState } from 'react';

import { Grid, Typography } from '@mui/material';

import { electionAddress, electionTitle, setElectionAddress, setElectionTitle } from '../Common';
import PersistentDrawerLeft from '../components/PersistentDrawerLeft';
import SimpleButton from '../components/SimpleButton';
import SimpleInput from '../components/SimpleInput';
import { getCreator, getTitle, requestAccount } from '../functions/Common';

declare let window: any;

function SelectElection() {
  const [inputAddress, setInputAddress] = useState<string>(electionAddress);
  const [displayTitle, setDisplayTitle] = useState<string>(electionTitle);
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
  }, [displayTitle]);

  async function changeElection() {
    await updateVariables();
    setDisplayTitle(electionTitle);
  }
  async function updateVariables() {
    setElectionAddress(inputAddress);
    setElectionTitle(await getTitle(inputAddress));
    console.log(electionTitle);
  }

  return (
    <>
      <div className="App">
        <header className="App-header">
          <PersistentDrawerLeft showCreator={currentAddress === creator} />
          <Grid
            container
            direction="column"
            alignItems="center"
            justifyContent="flex-start"
            spacing={4}
          >
            <Grid item>
              <Typography variant="h6" color="white">
                Current Election is:{" "}
                {electionAddress === "" ? "none" : displayTitle}
              </Typography>
            </Grid>
            <Grid container item alignItems="center" justifyContent="center">
              <SimpleInput
                setState={setInputAddress}
                label="New Election Address:"
              ></SimpleInput>
              &nbsp; &nbsp; &nbsp;
              <SimpleButton onClick={changeElection}>Submit</SimpleButton>
            </Grid>
          </Grid>
        </header>
      </div>
    </>
  );
}

export default SelectElection;
