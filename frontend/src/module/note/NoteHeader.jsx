import React, { useState } from "react";
import uuid from "react-uuid";
const options = [
  {
    id: uuid(),
    title: "Chương hiện tại",
    onclick: () => {
      console.log("Chương hiện tại");
    },
  },
  {
    id: uuid(),
    title: "Tất cả các chương",
    onclick: () => {
      console.log("Tất cả các chương");
    },
  },
];
const NoteHeader = () => {
  return (
    <div>
      <h3 className="font-bold text-lg">Ghi chú của tôi</h3>
    </div>
  );
};

export default NoteHeader;
