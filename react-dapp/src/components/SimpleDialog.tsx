import React, { FC, useState } from 'react';

import { DialogContent, DialogContentText } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';

interface SimpleDialogProps {
  title?: string;
  message: string | JSX.Element;
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
