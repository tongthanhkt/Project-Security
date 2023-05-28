import React from "react";
import Footer from "./footer/Footer";
import CourseManagementHeader from "./header/CourseManagementHeader";

const SidebarLayout = ({ children }) => {
  return (
    <div className="bg-[#fff]">
      <CourseManagementHeader />
      {children}
      <Footer />
    </div>
  );
};

export default SidebarLayout;
