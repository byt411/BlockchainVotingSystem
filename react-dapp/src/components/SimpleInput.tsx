import React, { FC } from "react";
import { styled, TextField } from "@mui/material";
interface InputProps {
  setState: (newState: string) => void;
  state: string;
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
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "red",
    },
    "&:hover fieldset": {
      borderColor: "yellow",
    },
    "&.Mui-focused fieldset": {
      borderColor: "green",
    },
  },
});

const SimpleInput: FC<InputProps> = ({ setState, state, label }) => {
  return (
    <CssTextField
      onChange={(e) => setState(e.target.value)}
      variant="standard"
      label={label}
    ></CssTextField>
  );
};

export default SimpleInput;
