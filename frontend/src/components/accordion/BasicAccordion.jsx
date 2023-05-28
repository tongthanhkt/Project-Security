import { Add, Remove } from "@mui/icons-material";
import { Collapse } from "@mui/material";
import React from "react";

const BasicAccordion = ({
  title,
  children,
  openIcon = <Remove />,
  closeIcon = <Add />,
  subInfo = "",
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleOnClick = () => {
    setIsOpen((prv) => !prv);
  };

  return (
    <div>
      {/* Header */}
      <button
        onClick={handleOnClick}
        className={`w-full p-2 text-lg font-semibold flex justify-between cursor-pointer select-none 
        transition duration-300 bg-slate-200 rounded-md group ${
          isOpen ? "rounded-b-none bg-gradient text-white" : ""
        } hover:bg-gradient hover:text-white`}
      >
        <div className="flex items-center gap-x-2">
          {isOpen ? openIcon : closeIcon}
          {title}
        </div>
        <div
          className={`text-slate-600 font-normal group-hover:text-white ${
            isOpen ? "text-white" : ""
          }`}
        >
          {subInfo}
        </div>
      </button>
      {/* Content */}
      <Collapse in={isOpen} unmountOnExit timeout="auto">
        <div className="border border-t-0 p-4 rounded-b-md">{children}</div>
      </Collapse>
    </div>
  );
};

export default BasicAccordion;
