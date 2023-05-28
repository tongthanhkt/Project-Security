/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import "../module/homepage/styles/homepageStyle.css";
import { Box, TextField } from "@mui/material";
import BasicButton from "./../components/button/BasicButton";
import Banner from "../module/homepage/Banner";
import BasicTitle from "./../components/title/BasicTitle";
import FeatureCourses from "../module/courses/FeatureCourses";
import ChooseOur from "../module/homepage/ChooseOur";
import CareerPath from "../module/homepage/CareerPath";
import { PasssedProvider } from "../contexts/passedContext";

const HomePage = () => {
  return (
    <PasssedProvider>
      <Banner></Banner>
      <FeatureCourses></FeatureCourses>
      <ChooseOur></ChooseOur>
      <CareerPath></CareerPath>
    </PasssedProvider>

    // <Box sx={{ display: "flex", p: 2 }}>
    //   <TextField inputRef={linkTextbox} placeholder="Invite link here" />
    //   <BasicButton
    //     onClick={() => window.location.replace(linkTextbox.current.value)}
    //   >
    //     Join
    //   </BasicButton>
    // </Box>
  );
};

export default HomePage;
