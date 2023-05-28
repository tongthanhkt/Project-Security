import React from "react";
import NoteContent from "./NoteContent";
import NoteHeader from "./NoteHeader";

const NotePage = () => {
  return (
    <div className=" p-4  mt-[60px] mb-[50px]">
      <NoteHeader />
      <NoteContent />
    </div>
  );
};

export default NotePage;
