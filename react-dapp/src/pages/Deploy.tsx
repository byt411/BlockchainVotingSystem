import './Voting.css';

import * as paillierBigint from 'paillier-bigint';
import React, { useEffect, useState } from 'react';

import AddIcon from '@mui/icons-material/Add';
import { Grid, styled, TextField, Typography } from '@mui/material';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

import PersistentDrawerLeft from '../components/PersistentDrawerLeft';
import SimpleButton from '../components/SimpleButton';
import SimpleDialog from '../components/SimpleDialog';
import SimpleInput from '../components/SimpleInput';
import VoteOptionEntry from '../components/VoteOptionEntry';
import { requestAccount } from '../functions/Common';
import { deployElection } from '../functions/Deploy';
import VoteOption from '../types/VoteOption';

declare let window: any;

function Deploy() {
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [electionDeployed, setElectionDeployed] = useState<boolean>(false);
  const [message, setMessage] = useState<JSX.Element>(<></>);
  async function createElection() {
    const options = optionArray.map((option: any) => option.props.voteOption);
    const { publicKey, privateKey } = await paillierBigint.generateRandomKeys(
      2048,
      true
    );
    const endTimestamp = (endDate?.getTime() / 1000).toString();
    const electionAddress = await deployElection(
      options,
      endTimestamp,
      title,
      publicKey
    );
    setElectionDeployed(true);
    setMessage(
      <>
        <Typography variant="body2">Election deployed at address:</Typography>
        <Typography variant="caption">{electionAddress}</Typography>
        <Typography variant="body2">Private key lambda:</Typography>
        <Typography variant="caption">
          {privateKey.lambda.toString()}
        </Typography>
        <Typography variant="body2">Private key mu:</Typography>
        <Typography variant="caption">{privateKey.mu.toString()}</Typography>
        <Typography variant="body2">Private key P:</Typography>
        <Typography variant="caption">{privateKey._p.toString()}</Typography>
        <Typography variant="body2">Private key Q:</Typography>
        <Typography variant="caption">{privateKey._q.toString()}</Typography>
      </>
    );
  }
  function addOption() {
    const tempArray: React.ReactElement[] = [
      <VoteOptionEntry
        voteOption={new VoteOption("", "", "", optionArray.length)}
        key={optionArray.length}
      ></VoteOptionEntry>,
    ];

    setOptionArray(optionArray.concat(tempArray));
  }
  const CssTextField = styled(TextField)({
    "& label.Mui-focused": {
      color: "primary",
    },
    "& label": {
      color: "white",
    },
    "& .MuiInput-input": {
      color: "white",
    },
    "& .MuiInput-underline:after": {
      borderBottomColor: "primary",
    },
    "& .MuiInput-underline:before": {
      borderBottomColor: "white",
    },
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "white",
      },
      "&:hover fieldset": {
        borderColor: "primary",
      },
      "&.Mui-focused fieldset": {
        borderColor: "primary",
      },
    },
  });
  const [currentAddress, setCurrentAddress] = useState<string>("");
  useEffect(() => {
    async function initialLoad() {
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
      key={0}
    ></VoteOptionEntry>,
  ]);
  const color = "white";
  const [title, setTitle] = useState<string>("");
  return (
    <>
      <div className="App">
        <header className="App-header">
          <PersistentDrawerLeft showCreator={false} />
          <br />
          <br />

          <Grid container alignItems="center" justifyContent="center">
            <Grid
              container
              item
              xs={4}
              spacing={2}
              alignItems="center"
              justifyContent="center"
              direction="column"
            >
              <Grid item>
                <SimpleInput setState={setTitle} label="Title"></SimpleInput>
              </Grid>
              <Grid item>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DateTimePicker
                    label="End Date:"
                    value={endDate}
                    onChange={(date) => date && setEndDate(date)}
                    renderInput={(params) => (
                      <CssTextField
                        {...params}
                        sx={{
                          svg: { color },
                          input: { color },
                          label: { color },
                        }}
                      />
                    )}
                    minDate={new Date()}
                  />
                </LocalizationProvider>
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
              xs={2}
              direction="column"
              alignItems="center"
              justifyContent="center"
              spacing={5}
            >
              {optionArray}
            </Grid>
            <Grid item xs={4} alignItems="center" justifyContent="center">
              <SimpleButton onClick={createElection}>Deploy</SimpleButton>
            </Grid>
          </Grid>
          {electionDeployed && (
            <SimpleDialog message={message} title={"Success!"}></SimpleDialog>
          )}
        </header>
      </div>
    </>
  );
}

export default Deploy;
