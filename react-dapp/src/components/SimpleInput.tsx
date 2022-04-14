import React, { FC } from 'react';

import { styled, TextField } from '@mui/material';

interface InputProps {
  setState: (newState: string) => void;
  label: string;
}

const CssTextField = styled(TextField)({
  "& label.Mui-focused": {
    color: "primary",
  },
  "& label": {
    color: "white",
  },
  "& .MuiInput-input": {
    color: "white",
  },
  "& .MuiInput-underline:after": {
    borderBottomColor: "primary",
  },
  "& .MuiInput-underline:before": {
    borderBottomColor: "white",
  },
});

const SimpleInput: FC<InputProps> = ({ setState, label }) => {
  return (
    <CssTextField
      onChange={(e) => setState(e.target.value)}
      variant="standard"
      label={label}
      InputLabelProps={{ shrink: true }}
    ></CssTextField>
  );
};

export default SimpleInput;
