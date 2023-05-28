import { CircularProgress } from "@mui/material";
import React from "react";

const CircularPercentLoading = ({ value }) => {
  return (
    <div className="relative inline-flex">
      <CircularProgress
        className="!text-white"
        variant="determinate"
        value={value}
      />
      <div className="top-0 left-0 bottom-0 right-0 absolute flex items-center justify-center text-xs">
        {`${Math.round(value)}%`}
      </div>
    </div>
  );
};

export default CircularPercentLoading;
