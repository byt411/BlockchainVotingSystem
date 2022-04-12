import React, { FC, useState } from "react";
import Card from "@mui/material/Card";
import { Grid, Typography } from "@mui/material/";
import CardContent from "@mui/material/CardContent";
import { Button, CardActions } from "@mui/material";
import SimpleButton from "./SimpleButton";
import VoteOption from "../types/VoteOption";
import DoneIcon from "@mui/icons-material/Done";
import SimpleInput from "./SimpleInput";
type VoteOptionEntryProps = {
  voteOption: VoteOption;
};

const VoteOptionEntry: FC<VoteOptionEntryProps> = ({ voteOption }) => {
  function setName(_name: string) {
    voteOption.name = _name;
  }
  function setAcronym(_acronym: string) {
    voteOption.acronym = _acronym;
  }
  function seturl(_url: string) {
    voteOption.logourl = _url;
  }
  return (
    <Grid
      container
      item
      spacing={1}
      padding-bottom={3}
      direction="column"
      alignItems="center"
    >
      <Grid item>
        <SimpleInput setState={setName} label="Name:"></SimpleInput>
      </Grid>
      <Grid item>
        <SimpleInput setState={setAcronym} label="Acronym:"></SimpleInput>
      </Grid>
      <Grid item>
        <SimpleInput setState={seturl} label="URL:"></SimpleInput>
      </Grid>
    </Grid>
  );
};

export default VoteOptionEntry;
