import React, { FC } from "react";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import { CardActions } from "@mui/material";
import SimpleButton from "./SimpleButton";
import VoteOption from "../types/VoteOption";
import { borders } from "@mui/system";
interface VoteOptionProps {
  acronym: string;
  name: string;
  onClick: (vote: VoteOption) => Promise<void>;
  logourl: string;
}

const VoteOptionCard: FC<VoteOptionProps> = ({
  acronym,
  name,
  onClick,
  logourl,
}) => {
  return (
    <Card
      sx={{ minWidth: 400 }}
      style={{
        backgroundColor: "#0b0c10",
        justifyContent: "center",
        border: "solid",
        borderColor: "#66fcf1",
      }}
    >
      <CardContent>
        <img src={logourl} width="80px" height="80px" />
        <Typography variant="h5" component="div" color="white">
          {name}
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="white">
          {acronym}
        </Typography>
      </CardContent>
      <CardActions style={{ justifyContent: "center" }}>
        <SimpleButton onClick={onClick}>Vote</SimpleButton>
      </CardActions>
    </Card>
  );
};

export default VoteOptionCard;
