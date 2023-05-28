import { Box, Paper, Stack } from "@mui/material";
import React from "react";

const BasicForm = ({ children, maxWidth = "50%" }) => {
  return (
    <Paper
      elevation={20}
      sx={{
        maxWidth: { maxWidth },
        p: 2,
        borderRadius: "5px",
        margin: "auto",
        marginTop: "40px",
      }}
    >
      <Stack direction="row">
        {/* Left side */}
        <Box
          sx={{
            width: "40%",
            pr: 2,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          {/* This is the form content */}
          {children}
        </Box>
        {/* Right side */}
        <Box
          sx={{
            width: "60%",
          }}
        >
          <img
            src="form_img.jpg"
            alt=""
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              borderRadius: "5px 0 0 5px",
            }}
          />
        </Box>
      </Stack>
    </Paper>
  );
};

export default BasicForm;
