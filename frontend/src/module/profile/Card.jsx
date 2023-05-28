import React from "react";

const Card = ({ width, children }) => {
  return (
    <div className={`${width} h-full p-3 bg-white shadow-md rounded-md`}>
      {children}
    </div>
  );
};

export default Card;
