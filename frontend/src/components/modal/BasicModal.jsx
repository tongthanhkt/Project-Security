import { Dialog } from "@mui/material";
import React from "react";
import Transition from "./Transition";

const BasicModal = ({
  open,
  handleClose,
  fullWidth = false,
  padding = "40px",
  children,
}) => {
  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      fullWidth={fullWidth}
      maxWidth="lg"
      PaperProps={{
        style: {
          boxShadow: "none",
          padding: padding,
          // overflowX: "hidden",
        },
      }}
    >
      {children}
    </Dialog>
  );
};

export default BasicModal;
