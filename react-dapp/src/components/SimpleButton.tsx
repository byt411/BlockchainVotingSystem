import React, { FC } from "react";
import { Button } from "@mui/material";
interface ButtonProps {
  children?: React.ReactNode;
  onClick: (a: any) => void;
}

const SimpleButton: FC<ButtonProps> = ({ children, onClick }) => {
  return (
    <Button size="small" variant="outlined" onClick={onClick}>
      {children}
    </Button>
  );
};

export default SimpleButton;
