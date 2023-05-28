/* eslint-disable no-unused-vars */
import React from "react";
import { API } from "../../common/api";
import { PAGE_PATH } from "../../routes/page-paths";
import { handlePost, handlePut } from "../../utils/fetch";
import useUpload from "./../../hooks/upload/useUpload";
import useMultiUpload from "./../../hooks/upload/useMultiUpload";

function splitFileIntoDataChunks(file, cSize /* in bytes */) {
  let startPointer = 0;
  const endPointer = file.size;
  const chunks = [];
  while (startPointer < endPointer) {
    let newStartPointer = startPointer + cSize;
    chunks.push(file.slice(startPointer, newStartPointer));
    startPointer = newStartPointer;
  }
  return chunks;
}

const UploadResourcePage = () => {
  const [file, setFile] = React.useState(null);
  const [uploader] = React.useState(null);

  // const onCancel = () => {
  //   if (uploader) {
  //     //   uploader.abort();
  //     setFile(null);
  //   }
  // };

  // const onStart = async () => {
  //   if (!file) {
  //     return alert("Please select a file");
  //   }
  //   console.log(file);
  //   const attachData = {
  //     fileName: file.name,
  //   };
  //   const resp = await handlePost(
  //     `${PAGE_PATH.BASE}/${API.UPLOAD_INIT}`,
  //     attachData
  //   );
  //   if (resp.status === 0) {
  //     // split the file into chunks data
  //     const chunks = splitFileIntoDataChunks(file, 5 * 1024 * 1024);
  //     console.log(chunks.length);
  //     const partsInfo = [];
  //     // iterative get presigned url for each chunk and upload it to s3 server
  //     const resourceId = resp.data.resourceId;
  //     for (let i = 0; i < chunks.length; i++) {
  //       const chunk = chunks[i];
  //       const respGetUrl = await handlePost(
  //         `${PAGE_PATH.BASE}/${API.UPLOAD_PART}`,
  //         {
  //           resourceId,
  //           nthPath: i + 1,
  //         }
  //       );
  //       if (respGetUrl.status !== 0) {
  //         alert(respGetUrl.message);
  //         return;
  //       }

  //       const respUploadChunk = await handlePut(
  //         respGetUrl.data.presignedUrl,
  //         chunk
  //       );
  //       console.log(respUploadChunk.headers);
  //       if (respUploadChunk.status !== 200) {
  //         alert("Failed to upload chunk:", i);
  //         return;
  //       }
  //       partsInfo.push({
  //         PartNumber: i + 1,
  //         ETag: respUploadChunk.headers.etag.slice(
  //           1,
  //           respUploadChunk.headers.etag.length - 1
  //         ),
  //       });
  //     }

  //     // send upload complete request
  //     const respCompleteUpload = await handlePost(
  //       `${PAGE_PATH.BASE}/${API.UPLOAD_COMPLETE}`,
  //       {
  //         resourceId,
  //         partInfoList: JSON.stringify(partsInfo),
  //       }
  //     );

  //     if (respCompleteUpload.status === 0) {
  //       alert("Success");
  //       return;
  //     }
  //     alert(respCompleteUpload.message);
  //     return;
  //   } else {
  //     alert(resp.message);
  //   }
  // };

  const [files, setFiles] = React.useState([]);
  const { handleInitUploadMulti, handleUploadMulti } = useMultiUpload(files);

  async function handleUpload() {
    const listResource = await handleInitUploadMulti();
    await handleUploadMulti(listResource);
  }

  return (
    <div className="pt-minus-nav">
      <h1>Upload your file</h1>
      <div>
        <input
          type="file"
          // onChange={(e) => {
          //   // console.log(e.target?.files);
          //   setFile(e.target?.files?.[0]);
          // }}
          onChange={(e) => {
            setFiles([...e.target?.files]);
          }}
          multiple
        />
      </div>
      <div>
        {/* <button onClick={() => onStart()}>Start</button>
        <button onClick={() => onCancel()}>Cancel</button> */}
        <button onClick={handleUpload} className="ml-2">
          Upload
        </button>
      </div>
    </div>
  );
};

export default UploadResourcePage;
