import React from "react";
import ArticleIcon from "@mui/icons-material/Article";
import DeleteIcon from "@mui/icons-material/Delete";
import HourglassBottomIcon from "@mui/icons-material/HourglassBottom";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import usePopup from "../../../hooks/usePopup";
import ConfirmPopup from "../../../components/modal/ConfirmPopup";
const FileList = ({ files, setFiles = () => {} }) => {
  const deleteFileHandler = (file) => {
    let index = -1;
    for (let i = 0; i < files.length; i++) {
      if (
        file?.name === files[i].name &&
        file?.size === files[i].size &&
        file?.lastModified === files[i].lastModified
      )
        index = i;
    }
    const temp1 = files.slice(0, index);
    const temp2 = files.slice(index + 1, files.length);
    const newArr = temp1.concat(temp2);
    setFiles([...newArr]);
  };
  return (
    <div>
      <ul className="file-list flex flex-col gap-2">
        {files &&
          files.map((f) => (
            <FileItem key={f.name} file={f} deleteFile={deleteFileHandler} />
          ))}
      </ul>
    </div>
  );
};

const FileItem = ({ file, deleteFile }) => {
  const { open, handleOpenPopup, handleClosePopup } = usePopup();
  return (
    <>
      <li
        className="file-item flex px-4 py-2 justify-between bg-blue-100 rounded-lg hover:bg-blue-200 cursor-pointer"
        key={file.name}
      >
        <div className="flex gap-2">
          <span className="mr-1">
            {file.type === "video/mp4" ? (
              <PlayCircleIcon className="text-red-500" />
            ) : (
              <ArticleIcon className="text-blue-500" />
            )}
          </span>
          <p>{file.name}</p>
        </div>
        <div className="actions">
          <div className="loading"></div>
          {file.isUploading && (
            <HourglassBottomIcon onClick={() => deleteFile(file.name)} />
          )}
          {!file.isUploading && (
            <DeleteIcon className="text-red-500" onClick={handleOpenPopup} />
          )}
        </div>
      </li>
      <ConfirmPopup
        isOpen={open}
        handleClose={handleClosePopup}
        handleConfirm={() => {
          deleteFile(file);
          handleClosePopup();
        }}
      >
        Bạn có chắc chắn xóa <strong>{file.name}</strong>
      </ConfirmPopup>
    </>
  );
};

export default FileList;
