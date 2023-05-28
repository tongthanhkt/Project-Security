import { Add, Book, MenuBook, Remove } from "@mui/icons-material";
import { Collapse } from "@mui/material";

import React from "react";
import ResourceList from "./ResourceList";

const Lessons = React.forwardRef(({ lessonId, lessonName, props }, ref) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleOnClick = () => {
    setIsOpen((prv) => !prv);
  };

  return (
    <div className="mb-4" {...props} ref={ref}>
      {/* Header */}
      <div
        onClick={handleOnClick}
        className={`p-2 text-lg font-semibold flex justify-between cursor-pointer select-none bg-slate-200 
        rounded-md ${isOpen ? "rounded-b-none" : ""}`}
      >
        <div className="flex items-center gap-x-2">
          {isOpen ? <MenuBook /> : <Book />}
          {lessonName}
        </div>
        {isOpen ? <Remove /> : <Add />}
      </div>
      {/* Content */}
      <Collapse in={isOpen} unmountOnExit timeout="auto">
        <ResourceList lessonId={lessonId} />
      </Collapse>
    </div>
  );
});

export default Lessons;
