import React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import CircularProgress from "@mui/material/CircularProgress";
import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { PAGE_PATH } from "../../routes/page-paths";
import { SUBMIT_STATUS } from "./../../common/constants";
import Transition from "./Transition";

const PopupMsg = ({
  children,
  status,
  isOpen,
  handleClosePopup,
  navigateTo,
  hasOk = true,
  hideOnSuccess = false,
  sx,
  navOnErr = false,
  navigateOnErr = PAGE_PATH.HOME,
  disableBackDropClick = false,
}) => {
  const navigate = useNavigate();

  const handleClose = (event, reason) => {
    if (disableBackDropClick && reason && reason === "backdropClick") return;
    // Close the popup
    handleClosePopup();
    // Navigate to a page on success
    if (status === SUBMIT_STATUS.SUCCESS && navigateTo) {
      navigate(navigateTo);
    }

    if (navOnErr === true && status === SUBMIT_STATUS.ERROR) {
      navigate(navigateOnErr);
    }
  };
  const renderIcon = () => {
    switch (status) {
      case SUBMIT_STATUS.ERROR:
        return (
          <CancelRoundedIcon
            color="error"
            sx={{ fontSize: "60px" }}
          ></CancelRoundedIcon>
        );
      case SUBMIT_STATUS.SUCCESS:
        return (
          <CheckCircleRoundedIcon
            color="success"
            sx={{ fontSize: "60px" }}
          ></CheckCircleRoundedIcon>
        );
      case SUBMIT_STATUS.LOADING:
        return (
          <CircularProgress
            color="secondary"
            sx={{ fontSize: "60px" }}
          ></CircularProgress>
        );
      default:
        return (
          <CheckCircleRoundedIcon
            color="success"
            sx={{ fontSize: "60px" }}
          ></CheckCircleRoundedIcon>
        );
    }
  };
  return (
    <Dialog
      open={hideOnSuccess && status === SUBMIT_STATUS.SUCCESS ? false : isOpen}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      sx={[...(Array.isArray(sx) ? sx : [sx])]}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "10px 50px 10px 50px",
        }}
      >
        {/* {status === SUBMIT_STATUS.ERROR ? (
          <CancelRoundedIcon
            color="error"
            sx={{ fontSize: "60px" }}
          ></CancelRoundedIcon>
        ) : (
          <CheckCircleRoundedIcon
            color="success"
            sx={{ fontSize: "60px" }}
          ></CheckCircleRoundedIcon>
        )} */}
        {renderIcon()}

        {/* Message content */}
        {children}

        {/* Modal buttons */}
        <DialogActions>
          {hasOk ? (
            <Button variant="contained" onClick={handleClose}>
              Ok
            </Button>
          ) : (
            ""
          )}
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default PopupMsg;
