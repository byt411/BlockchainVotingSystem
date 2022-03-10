import "./Voting.css";

import { Grid } from "@mui/material";
import React, { useEffect, useState } from "react";

import PersistentDrawerLeft from "../components/PersistentDrawerLeft";
import VoteResultCard from "../components/VoteResultCard";
import { getCreator, requestAccount } from "../functions/Common";
import { getResults } from "../functions/Results";
import VoteResult from "../types/VoteResult";

declare let window: any;

function Results() {
  // store greeting in local state
  const [results, setResults] = useState<VoteResult[]>([]);
  // request access to the user's MetaMask account

  const [creator, setCreator] = useState<string>("");
  const [currentAddress, setCurrentAddress] = useState<string>("");

  useEffect(() => {
    async function loadResultsCreatorCurrentAddress() {
      const results = await getResults();
      setResults(results);
      const creator = await getCreator();
      setCreator(creator);
      const address = await requestAccount();
      setCurrentAddress(address[0]);
    }
    loadResultsCreatorCurrentAddress();
    console.log(results);
  }, [currentAddress]);

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
            {results.map((x, y) => (
              <Grid item key={y}>
                <VoteResultCard voteResult={x}></VoteResultCard>
              </Grid>
            ))}
          </Grid>
        </header>
      </div>
    </>
  );
}

export default Results;
