import './Voting.css';

import React, { useEffect, useState } from 'react';

import AddIcon from '@mui/icons-material/Add';
import { Grid } from '@mui/material';

import PersistentDrawerLeft from '../components/PersistentDrawerLeft';
import SimpleButton from '../components/SimpleButton';
import SimpleDialog from '../components/SimpleDialog';
import SimpleInput from '../components/SimpleInput';
import VoteOptionEntry from '../components/VoteOptionEntry';
import { getCreator, requestAccount } from '../functions/Common';
import { deployElection } from '../functions/Deploy';
import VoteOption from '../types/VoteOption';

declare let window: any;

function Deploy() {
  const [electionDeployed, setElectionDeployed] = useState<boolean>(false);
  const [address, setAddress] = useState<string>("");
  async function nothing() {
    const options = optionArray.map((option: any) => option.props.voteOption);
    const electionAddress = await deployElection(options, endtime, title);
    setElectionDeployed(true);
    setAddress(electionAddress);
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
          <PersistentDrawerLeft showCreator={currentAddress === creator} />
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
          {electionDeployed && (
            <SimpleDialog
              message={"Election has been deployed at address " + address + "!"}
              title={"Success!"}
            ></SimpleDialog>
          )}
        </header>
      </div>
    </>
  );
}

export default Deploy;
