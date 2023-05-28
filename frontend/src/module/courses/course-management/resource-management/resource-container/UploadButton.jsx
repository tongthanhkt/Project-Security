import {
  Add,
  Close,
  CloudDone,
  CloudSync,
  FileUpload,
} from "@mui/icons-material";
import { CircularProgress, IconButton } from "@mui/material";
import React from "react";
import { useQueryClient } from "react-query";
import { API } from "../../../../../common/api";
import RESP from "../../../../../common/respCode";
import FileType from "../../../../../components/icon/FileType";
import { handlePost } from "../../../../../utils/fetch";
import { getFileType } from "../../../../../utils/fileHelper";
import useUpload from "./../../../../../hooks/upload/useUpload";
import CircularPercentLoading from "./../../../../../components/loading/CircularPercentLoading";

const UploadButton = ({ lessonId }) => {
  const [file, setFile] = React.useState(null);
  const fileRef = React.useRef(null);

  const handleCancel = () => {
    setFile(null);
    fileRef.current.value = null;
  };

  return (
    <>
      <input
        type="file"
        ref={fileRef}
        className="hidden"
        onChange={(e) => {
          setFile(e.target?.files?.[0]);
        }}
        accept=".mp4,.png,.jpg,.mp3,.pdf"
      />
      {file ? (
        <FileItem lessonId={lessonId} file={file} handleCancel={handleCancel} />
      ) : (
        <IconButton
          onClick={() => fileRef.current.click()}
          className="!bg-slate-200 !w-12 !h-12"
        >
          <Add />
        </IconButton>
      )}
    </>
  );
};

const FileItem = ({ file, handleCancel, lessonId }) => {
  const {
    uploadPercent,
    isUploading,
    isDone,
    isFailed,
    handleInitUpload,
    handleUpload,
    handleRetry,
    currentResourceId,
  } = useUpload(file);
  const [isAdding, setIsAdding] = React.useState(false);
  const queryClient = useQueryClient();

  async function uploadFile() {
    const resourceId = await handleInitUpload();
    handleUpload(resourceId);
  }

  React.useEffect(() => {
    var timer;

    async function handleAddResource() {
      setIsAdding(true);
      const resourceData = {
        resourceId: currentResourceId,
        lessonId,
      };

      try {
        const resp = await handlePost(API.ADD_RESOURCE, resourceData);
        if (resp.status === RESP.SUCCESS) {
          queryClient.invalidateQueries("lessonResource");
          var msg = "Add resource success";
          console.log(msg);
          // alert(msg);
        } else {
          console.log("Add failed");
          alert(resp.message);
        }
      } catch (error) {
        console.log(
          "🚀 ~ file: UploadButton.jsx:81 ~ handleAddResource ~ error:",
          error
        );
      }

      // Clear file when done upload
      timer = setTimeout(() => {
        handleCancel();
      }, 2000);
      setIsAdding(false);
    }

    if (isDone) {
      // Add resource when upload done
      handleAddResource();
    }

    return () => {
      clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDone]);

  return (
    <div className="bg-slate-500 py-2 px-3 flex justify-between text-white rounded-md w-1/3">
      <div className="flex items-center gap-x-2 overflow-hidden mr-2">
        <FileType type={getFileType(file.name)} />
        <div className="truncate">{file.name}</div>
      </div>
      <div className="flex items-center gap-x-2">
        {!isUploading && !isFailed && !isDone ? (
          <>
            {/* Upload button */}
            <IconButton
              onClick={uploadFile}
              className="!bg-blue-500 !text-white hover:!bg-blue-700 !p-1"
            >
              <FileUpload className="!text-lg" />
            </IconButton>

            {/* Cancel button */}
            <IconButton
              onClick={handleCancel}
              className="!bg-red-500 !text-white hover:!bg-red-700 !p-1"
            >
              <Close className="!text-lg" />
            </IconButton>
          </>
        ) : null}

        {/* Adding resource */}
        {isAdding ? <CircularProgress className="!text-white" /> : null}

        {/* Uploading... */}
        {isUploading ? <CircularPercentLoading value={uploadPercent} /> : null}

        {/* Upload done */}
        {isDone && !isAdding ? <CloudDone /> : null}

        {/* Upload failed check */}
        {isFailed ? (
          <IconButton
            onClick={handleRetry}
            className="!bg-green-500 !text-white hover:!bg-green-700 !p-1"
          >
            <CloudSync className="!text-lg" />
          </IconButton>
        ) : null}
      </div>
    </div>
  );
};

export default UploadButton;
