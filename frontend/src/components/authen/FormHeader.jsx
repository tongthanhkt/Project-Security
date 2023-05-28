import { Avatar, Box, Typography } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import { PAGE_PATH } from "../../routes/page-paths";

const FormHeader = ({ title, caption }) => {
  const navigate = useNavigate();

  const goHome = () => {
    navigate(PAGE_PATH.HOME);
  };
  return (
    <Box
      align="center"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        mb: 4,
      }}
    >
      <Avatar
        src="/logo.png"
        variant="square"
        sx={{
          width: "160px",
          height: "120px",
          "& .MuiAvatar-img": {
            objectFit: "scale-down",
          },
          cursor: "pointer",
        }}
        onClick={goHome}
      ></Avatar>
      <Typography
        sx={{
          fontSize: "28px",
          fontWeight: "medium",
        }}
      >
        {title}
      </Typography>
      {caption ? (
        <Typography variant="caption" sx={{ fontSize: "14px" }}>
          {caption}
        </Typography>
      ) : null}
    </Box>
  );
};

export default FormHeader;
