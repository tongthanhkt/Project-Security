import React from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Typography,
} from "@mui/material";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import TextBox from "../input/TextBox";
import PopupMsg from "./PopupMsg";
import usePopup from "../../hooks/usePopup";
import { handlePost } from "./../../utils/fetch";
import BasicButton from "./../button/BasicButton";
import useStatus from "../../hooks/useStatus";
import axios from "axios";

const PopupForm = ({
  isOpen,
  handleClose,
  refetch,
  header,
  label,
  api,
  fieldName = "name",
  otherField = {},
  successMsg = "Created successfully",
  buttonLabel = "Create",
  setReturnData = null,
}) => {
  const {
    open: openMsg,
    handleClosePopup: handleCloseMsg,
    handleOpenPopup: handleOpenMsg,
  } = usePopup();

  // Form
  const schema = yup.object({
    name: yup.string().required("Required"),
  });
  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });
  const { status, handleStatus } = useStatus();
  const [isHandling, setIsHandling] = React.useState(false);
  const onSubmit = async (data) => {
    console.log("Submit")
    setIsHandling(true);
    // Handle data
    const submitData = {
      ...otherField,
      [fieldName]: data.name,
    };
    console.log(
      "🚀 ~ file: PopupForm.jsx:51 ~ onSubmit ~ submitData",
      submitData
    );
    const response = await axios.post("http://localhost:3000/api/v1/fulfillment/verify-otp",{
      otp: submitData.otp
    })
    if (response.data.status === 1) {
      let resp = {}
      resp.status = 0;
      handleStatus(resp, successMsg);
      // Close current popup form
      handleClose();
      // Open popup message
      handleOpenMsg();

      // Reset form on success
      if (resp.status === 0) reset();

      if (setReturnData) {
        setReturnData(resp);

        return setIsHandling(false);
      }

      // Refetch groups data
      if (refetch) {
        refetch();
      }
    } else {
      let resp = {}
      resp.status = 1;
      handleStatus(resp, successMsg);
      // Close current popup form
      handleClose();
      // Open popup message
      handleOpenMsg();
    }
    setIsHandling(false);
  };

  return (
    <>
      {/* Close form when recieved resp */}
      <Dialog open={isOpen} onClose={handleClose}>
        <DialogTitle>{header}</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <TextBox
              variant="standard"
              label={label}
              type="text"
              helperText={errors.name ? errors.name.message : " "}
              name="name"
              control={control}
            />
            <DialogActions sx={{ justifyContent: "center" }}>
              <BasicButton onClick={handleClose} loading={isHandling}>
                Cancel
              </BasicButton>
              <BasicButton type="submit" loading={isHandling}>
                {buttonLabel}
              </BasicButton>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
      <PopupMsg
        status={status.type}
        isOpen={openMsg}
        handleClosePopup={handleCloseMsg}
      >
        <Typography variant="h6" textAlign="center">
          
        </Typography>
      </PopupMsg>
    </>
  );
};

export default PopupForm;
