import React, { useEffect, useState } from "react";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import "./multipleFile.css";
import BasicButton from "../../button/BasicButton";
const isExisted = (currentFile, fileList) => {
  for (let i = 0; i < fileList.length; i++) {
    if (
      currentFile?.name === fileList[i].name &&
      currentFile?.size === fileList[i].size &&
      currentFile?.lastModified === fileList[i].lastModified
    )
      return true;
  }
  return false;
};
const MultipleFileUpload = ({
  files,
  setFiles,
  removeFile,
  loading = false,
}) => {
  const [fileExisted, setFileExisted] = useState([]);

  const uploadHandler = (event) => {
    const newFile = event.target.files;
    if (!newFile) return;
    // newFile.isUploading = true;
    const tempNewFile = [];
    const tempExistedFile = [];
    for (let i = 0; i < newFile.length; i++) {
      if (!isExisted(newFile[i], files)) tempNewFile.push(newFile[i]);
      else tempExistedFile.push(newFile[i]);
    }
    setFileExisted([...tempExistedFile]);
    setFiles([...files, ...tempNewFile]);
  };
  return (
    <>
      <h1 className="font-semibold">Tài liệu</h1>
      <div className="file-card">
        <div className="w-24 mt-4">
          <img src="/images/course/upload_files.png" alt="upload files" />
        </div>
        <div className="italic text-gray-500 mt-4">
          Tải lên các tập tin của bạn
        </div>
        <div className="file-inputs">
          <input
            key={Math.random()}
            type="file"
            onChange={uploadHandler}
            disabled={loading}
            multiple
          />
          <BasicButton className="hover:opacity-60">
            <UploadFileIcon /> Upload
          </BasicButton>
        </div>
      </div>
      {fileExisted?.length > 0 && (
        <div className="text-red-500 italic mt-2 -mb-4">
          Tập tin{" "}
          <span className="font-semibold">
            {fileExisted.map((item) => item?.name).join(", ")}
          </span>{" "}
          đã tồn tại.
        </div>
      )}
    </>
  );
};

export default MultipleFileUpload;
