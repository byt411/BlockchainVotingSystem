import './Voting.css';

import React, { useEffect, useState } from 'react';

import { Grid, Typography } from '@mui/material';

import { electionAddress } from '../Common';
import PersistentDrawerLeft from '../components/PersistentDrawerLeft';
import SimpleDialog from '../components/SimpleDialog';
import VoteOptionCard from '../components/VoteOptionCard';
import { getCreator, getOptions, requestAccount } from '../functions/Common';
import { recordVote } from '../functions/Voting';
import VoteOption from '../types/VoteOption';

function Voting() {
  const [message, setMessage] = useState<JSX.Element>(<></>);
  const [voteCast, setVoteCast] = useState<boolean>(false);
  const [randomizedOptions, setRandomOptions] = useState<VoteOption[]>([]);
  const [options, setOptions] = useState<VoteOption[]>([]);
  const [creator, setCreator] = useState<string>("");
  const [currentAddress, setCurrentAddress] = useState<string>("");
  // request access to the user's MetaMask account

  function randomize(input: any[]) {
    if (input === undefined) {
      return [];
    }
    let array = input.slice();
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  async function castVote(option: VoteOption) {
    const response = await recordVote(option);
    const timestamp = new Date(response.timestamp * 1000);
    setMessage(
      <>
        <Typography variant="body2">
          Your vote for {option.name} has been cast successfully!
        </Typography>
        <Typography variant="body2">Encrypted Vote:</Typography>
        <Typography variant="caption">{response.vote}</Typography>
        <Typography variant="body2">Vote recorded at:</Typography>
        <Typography variant="caption">{timestamp.toUTCString()}</Typography>
      </>
    );
    setVoteCast(true);
  }

  useEffect(() => {
    async function loadOptionsCreatorCurrentAddress() {
      const options = await getOptions();
      console.log(options);
      setOptions(options);
      setRandomOptions(randomize(options));
      const creator = await getCreator();
      setCreator(creator);
      const address = await requestAccount();
      setCurrentAddress(address[0]);
    }
    electionAddress !== "" && loadOptionsCreatorCurrentAddress();
  }, []);
  return (
    <>
      <div className="App">
        <header className="App-header">
          <div>
            <PersistentDrawerLeft
              showCreator={currentAddress === creator.toLowerCase()}
            />
          </div>
          <br />
          <br />
          <Grid container spacing={2} columns={2}>
            {randomizedOptions.map((x, y) => (
              <Grid item key={y}>
                <VoteOptionCard
                  onClick={() => castVote(x)}
                  name={x.name}
                  acronym={x.acronym}
                  logourl={x.logourl}
                ></VoteOptionCard>
              </Grid>
            ))}
          </Grid>
        </header>
      </div>
      {voteCast && (
        <SimpleDialog message={message} title={"Success!"}></SimpleDialog>
      )}
      {electionAddress === "" && (
        <SimpleDialog message="You have not selected an election!"></SimpleDialog>
      )}
    </>
  );
}

export default Voting;
