import React, { FC } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import VoteResult from "../types/VoteResult";

interface SimpleDialogProps {
  open: boolean;
  selectedValue: string;
  onClose: (value: string) => void;
  votes: VoteResult[];
}

const SimpleDialog: FC<SimpleDialogProps> = ({
  open,
  selectedValue,
  onClose,
  votes,
}) => {
  const handleClose = () => {
    onClose(selectedValue);
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>Election Results</DialogTitle>
      <List>
        {votes.map((voteResult, index) => (
          <ListItem>
            {voteResult.option.name}, {voteResult.count}
          </ListItem>
        ))}
      </List>
    </Dialog>
  );
};

export default SimpleDialog;
