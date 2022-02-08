import React, { FC } from "react";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import PersonIcon from "@mui/icons-material/Person";
import AddIcon from "@mui/icons-material/Add";
import Typography from "@mui/material/Typography";
import { blue } from "@mui/material/colors";
import VoteOption from "../types/VoteOption";

const emails = ["username@gmail.com", "user02@gmail.com"];

interface SimpleDialogProps {
  open: boolean;
  selectedValue: string;
  onClose: (value: string) => void;
  options: VoteOption[];
  votes: number[];
}

const SimpleDialog: FC<SimpleDialogProps> = ({
  open,
  selectedValue,
  onClose,
  options,
  votes,
}) => {
  const handleClose = () => {
    onClose(selectedValue);
  };

  const handleListItemClick = (value: string) => {
    onClose(value);
  };
  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>Set backup account</DialogTitle>
      <List>
        {options.map((party, index) => (
          <ListItem>
            {party.name}, {votes[index]}
          </ListItem>
        ))}
      </List>
    </Dialog>
  );
};

export default SimpleDialog;
