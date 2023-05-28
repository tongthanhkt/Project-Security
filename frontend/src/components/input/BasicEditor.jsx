import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
export const BasicEditor = ({
  theme = "snow",
  handleChange = (html) => {},
  value,
  className = "",
  children,
  disabled = false,
  ...props
}) => {
  return (
    <>
      <ReactQuill
        theme={theme}
        onChange={handleChange}
        value={value}
        modules={BasicEditor.modules}
        formats={BasicEditor.formats}
        bounds={".app"}
        className={`${
          disabled ? "bg-gray-100 text-gray-500" : ""
        } ${className}`}
        readOnly={disabled}
        {...props}
      />
    </>
  );
};

BasicEditor.formats = [
  "header",
  "font",
  "size",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "indent",
  "link",
  "image",
  "video",
];
BasicEditor.modules = {
  toolbar: [
    [{ header: "1" }, { header: "2" }, { font: [] }],
    [{ size: [] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" },
    ],
    ["link", "image", "video"],
    ["clean"],
  ],
  clipboard: {
    // toggle to add extra line breaks when pasting HTML:
    matchVisual: false,
  },
};
