import { Typography } from "@mui/material";
import React from "react";

const Empty = (
  { className, classNameParent = "", message, imgSrc, ...props },
  ref
) => {
  return (
    <div
      className={`flex items-center justify-center flex-col ${classNameParent}`}
      ref={ref}
      {...props}
    >
      {imgSrc && <img alt="empty" src={imgSrc} className={className} />}
      <Typography variant="h5" className="text-slate-400">
        {message}
      </Typography>
    </div>
  );
};

export default React.forwardRef(Empty);
