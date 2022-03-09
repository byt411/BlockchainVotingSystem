import "./Voting.css";

import { Grid } from "@mui/material";
import React, { useEffect, useState } from "react";

import PersistentDrawerLeft from "../components/PersistentDrawerLeft";
import VoteOptionCard from "../components/VoteOptionCard";
import {
  getCreator,
  getOptions,
  recordVote,
  requestAccount,
} from "../functions/Common";
import VoteOption from "../types/VoteOption";

function Voting() {
  // store greeting in local state
  const [randomizedOptions, setRandomOptions] = useState<VoteOption[]>([]);
  const [options, setOptions] = useState<VoteOption[]>([]);
  const [creator, setCreator] = useState<string>("");
  const [currentAddress, setCurrentAddress] = useState<string>("");
  // request access to the user's MetaMask account

  function randomize(input: any[]) {
    let array = input.slice();
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  useEffect(() => {
    async function loadOptionsCreatorCurrentAddress() {
      const options = await getOptions();
      setOptions(options);
      setRandomOptions(randomize(options));
      const creator = await getCreator();
      setCreator(creator);
      const address = await requestAccount();
      setCurrentAddress(address[0]);
    }
    loadOptionsCreatorCurrentAddress();
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
                  onClick={() => recordVote(x)}
                  name={x.name}
                  acronym={x.acronym}
                  logourl={x.logourl}
                ></VoteOptionCard>
              </Grid>
            ))}
          </Grid>
        </header>
      </div>
    </>
  );
}

export default Voting;
