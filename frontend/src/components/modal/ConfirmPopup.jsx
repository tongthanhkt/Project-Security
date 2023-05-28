import { Help } from "@mui/icons-material";
import { Dialog, DialogActions, DialogContent, Stack } from "@mui/material";
import React from "react";
import BasicButton from "./../button/BasicButton";
import Transition from "./Transition";

const ConfirmPopup = ({
  isOpen,
  handleClose,
  handleConfirm = () => console.log("confirm"),
  handleReject = handleClose,
  isConfirming,
  children,
  noBtnLabel = "Hủy",
  yesBtnLabel = "Xóa",
}) => {
  return (
    <Dialog
      open={isOpen}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
    >
      <DialogContent
        sx={{
          pt: 4,
          pb: 0,
          margin: "auto",
          width: "450px",
          textAlign: "center",
        }}
      >
        <Stack>
          <Help sx={{ fontSize: "50px", alignSelf: "center" }}></Help>
          {children}
        </Stack>
      </DialogContent>
      <DialogActions sx={{ margin: "auto", gap: 1, pb: 4 }}>
        <BasicButton
          variant="none"
          onClick={handleReject}
          loading={isConfirming}
          noGradient={true}
          className="!px-8 !py-1 !rounded-lg !font-bold"
        >
          {noBtnLabel}
        </BasicButton>
        <BasicButton
          variant="none"
          onClick={() => {
            handleConfirm();
            handleReject();
          }}
          loading={isConfirming}
          noGradient={true}
          className="!bg-red-500 !text-white !px-8 !py-1 !rounded-lg"
        >
          {yesBtnLabel}
        </BasicButton>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmPopup;
