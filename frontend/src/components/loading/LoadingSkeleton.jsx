import React from "react";

const LoadingSkeleton = ({ height, width, className }) => {
  return (
    <div
      style={{ height: height, width: width }}
      className={`animate-pulse bg-gray-200 rounded-md ${className}`}
    ></div>
  );
};

export default LoadingSkeleton;
