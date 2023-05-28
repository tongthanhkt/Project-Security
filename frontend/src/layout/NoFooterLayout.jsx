import React from "react";
import Header from "./header/Header";

const NoFooterLayout = ({ children }) => {
  return (
    <div className="bg-[#fff]">
      <Header></Header>
      {children}
    </div>
  );
};

export default NoFooterLayout;
