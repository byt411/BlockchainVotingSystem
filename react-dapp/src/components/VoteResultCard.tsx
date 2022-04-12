import { CardActions } from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import React, { FC } from "react";
import VoteResult from "../types/VoteResult";
interface VoteResultProps {
  voteResult: VoteResult;
}

const VoteResultCard: FC<VoteResultProps> = ({ voteResult }) => {
  return (
    <Card
      sx={{ minWidth: 400, minHeight: 260 }}
      style={{
        backgroundColor: "#0b0c10",
        justifyContent: "center",
        border: "solid",
        borderColor: "#66fcf1",
      }}
    >
      <CardContent>
        <img
          src={voteResult.option.logourl}
          width="80px"
          height="80px"
          alt={voteResult.option.name}
        />
        <Typography variant="h5" component="div" color="white">
          {voteResult.option.name}
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="white">
          {voteResult.option.acronym}
        </Typography>
        <Typography sx={{ mb: 2.5 }} color="white">
          Votes: {voteResult.count}
        </Typography>
      </CardContent>
      <CardActions style={{ justifyContent: "center" }}></CardActions>
    </Card>
  );
};

export default VoteResultCard;
