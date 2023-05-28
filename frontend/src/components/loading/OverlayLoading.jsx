import { CircularProgress } from "@mui/material";
import React from "react";

const OverlayLoading = ({
  width = "100%",
  height = "100%",
  className,
  children = (
    <CircularProgress className="!text-white absolute top-1/2 left-1/2" />
  ),
}) => {
  return (
    <div
      style={{ width: width, height: height }}
      className={`bg-black absolute top-0 left-0 z-[9999] opacity-30 m-auto ${className}`}
    >
      {children}
    </div>
  );
};

export default OverlayLoading;
