import './Voting.css';

import React, { useEffect, useState } from 'react';

import { Grid } from '@mui/material';

import { electionAddress } from '../Common';
import PersistentDrawerLeft from '../components/PersistentDrawerLeft';
import SimpleDialog from '../components/SimpleDialog';
import VoteResultCard from '../components/VoteResultCard';
import { getCreator, getResultsPublished, requestAccount } from '../functions/Common';
import { getResults } from '../functions/Results';
import VoteResult from '../types/VoteResult';

declare let window: any;

function Results() {
  // store greeting in local state
  const [results, setResults] = useState<VoteResult[]>([]);
  // request access to the user's MetaMask account

  const [creator, setCreator] = useState<string>("");
  const [currentAddress, setCurrentAddress] = useState<string>("");
  const [resultsPublished, setResultsPublished] = useState<boolean>(true);

  useEffect(() => {
    async function loadResultsCreatorCurrentAddress() {
      const results = await getResults();
      setResults(results);
      const creator = await getCreator();
      setCreator(creator);
      const address = await requestAccount();
      setCurrentAddress(address[0]);
      const resultsPub = await getResultsPublished();
      setResultsPublished(resultsPub);
    }
    electionAddress !== "" && loadResultsCreatorCurrentAddress();
  }, [currentAddress, results]);

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
          {!resultsPublished && (
            <SimpleDialog message="Results have not yet been published."></SimpleDialog>
          )}
          <Grid container spacing={2} columns={2}>
            {results.map((x, y) => (
              <Grid item key={y}>
                <VoteResultCard voteResult={x}></VoteResultCard>
              </Grid>
            ))}
          </Grid>
        </header>
      </div>
      {electionAddress === "" && (
        <SimpleDialog message="You have not selected an election!"></SimpleDialog>
      )}
    </>
  );
}

export default Results;
