import { DialogContent, DialogContentText } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import React, { FC, useState } from "react";

interface SimpleDialogProps {
  title?: string;
  message: string;
}

const SimpleDialog: FC<SimpleDialogProps> = ({
  title = "Warning",
  message,
}) => {
  const [open, setOpen] = useState<boolean>(true);
  const handleClose = () => {
    setOpen(false);
  };
  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{message}</DialogContentText>
      </DialogContent>
    </Dialog>
  );
};

export default SimpleDialog;
