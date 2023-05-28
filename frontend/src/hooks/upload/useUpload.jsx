import React from "react";
import { API } from "../../common/api";
import { RESOURCE_TYPE } from "../../common/constants";
import { PAGE_PATH } from "../../routes/page-paths";
import { handlePost, handlePut } from "../../utils/fetch";
import {
  getDuration,
  getFileType,
  splitFileIntoDataChunks,
} from "../../utils/fileHelper";

function calPercentage(array) {
  return Math.round((1 / array.length) * 100);
}

const useUpload = (file) => {
  // Upload status
  const [isUploading, setIsUploading] = React.useState(false);
  const [isFailed, setIsFailed] = React.useState(false);
  const [isDone, setIsDone] = React.useState(false);
  const [uploadPercent, setUploadPercent] = React.useState(0);

  // Upload info
  const [currentChunkIndex, setCurrentChunkIndex] = React.useState(0);
  const [chunks, setChunks] = React.useState([]);
  const [currentResourceId, setCurrentResourceId] = React.useState(null);
  const [currentPartsInfo, setCurrentPartsInfo] = React.useState([]);

  // Fake upload effect
  // const [nextPercent, setNextPercent] = React.useState(0);
  // const timerRef = React.useRef();

  async function handleInitUpload() {
    if (!file) {
      return alert("Please select a file");
    }
    console.log(file);
    const attachData = {
      fileName: file.name,
    };
    const resp = await handlePost(
      `${PAGE_PATH.BASE}/${API.UPLOAD_INIT}`,
      attachData
    );
    var resourceId = null;
    if (resp.status === 0) {
      resourceId = resp.data.resourceId;
      setCurrentResourceId(resourceId);
    } else {
      alert(resp.message);
    }
    console.log("Done init");

    return resourceId;
  }

  async function handlePartUpload(resourceId, chunks) {
    const partsInfo = currentPartsInfo;
    var failedChunkIndex = null;
    const chunkPercentage = calPercentage(chunks);

    var currPercent = uploadPercent;
    for (let i = currentChunkIndex; i < chunks.length; i++) {
      // Set next progress percent
      var nextPercent = currPercent + chunkPercentage;
      // setNextPercent(nextPercent >= 100 ? 99 : nextPercent);

      const chunk = chunks[i];
      const respGetUrl = await handlePost(
        `${PAGE_PATH.BASE}/${API.UPLOAD_PART}`,
        {
          resourceId,
          nthPath: i + 1,
        }
      );
      if (respGetUrl.status !== 0) {
        alert(respGetUrl.message);
        failedChunkIndex = i;
        break;
      }

      // Upload chunk
      const respUploadChunk = await handlePut(
        respGetUrl.data.presignedUrl,
        chunk
      );
      console.log(respUploadChunk.headers);
      if (respUploadChunk.status !== 200) {
        alert("Failed to upload chunk:", i);
        failedChunkIndex = i;
        break;
      }
      // Add percent to UI
      currPercent = nextPercent;
      setUploadPercent(currPercent >= 100 ? 99 : currPercent);
      partsInfo.push({
        PartNumber: i + 1,
        ETag: respUploadChunk.headers.etag.slice(
          1,
          respUploadChunk.headers.etag.length - 1
        ),
      });
    }

    // Set chunks to retry if failed
    setChunks(chunks);
    console.log("Done part");

    return { partsInfo, failedChunkIndex };
  }

  async function handleRetry() {
    setIsUploading(true);
    setIsFailed(false);
    const { partsInfo, failedChunkIndex } = await handlePartUpload(
      currentResourceId,
      chunks
    );

    // Set state to retry again
    if (failedChunkIndex !== null) {
      setIsUploading(false);
      setCurrentChunkIndex(failedChunkIndex);
      setCurrentPartsInfo(partsInfo);
      setIsFailed(true);
      return;
    }

    // send upload complete request
    const respCompleteUpload = await handleUploadComplete(
      currentResourceId,
      partsInfo
    );
    if (respCompleteUpload.status === 0) {
      console.log("Success");
      setIsUploading(false);
      setUploadPercent(100);
      setIsDone(true);
    } else {
      setIsFailed(true);
      alert(respCompleteUpload.message);
    }
  }

  async function handleUploadComplete(resourceId, partsInfo) {
    const resourceData = {
      resourceId,
      partInfoList: JSON.stringify(partsInfo),
      type: getFileType(file.name),
    };
    console.log(
      "🚀 ~ file: useUpload.jsx:134 ~ handleUploadComplete ~ resourceData:",
      resourceData
    );

    if (
      resourceData.type === RESOURCE_TYPE.AUDIO ||
      resourceData.type === RESOURCE_TYPE.VIDEO
    ) {
      resourceData.length = await getDuration(file);
    }

    const respCompleteUpload = await handlePost(
      `${PAGE_PATH.BASE}/${API.UPLOAD_COMPLETE}`,
      resourceData
    );
    console.log("Done complete");

    return respCompleteUpload;
  }

  async function handleUpload(resourceId) {
    setIsUploading(true);

    // split the file into chunks data
    const chunks = splitFileIntoDataChunks(file, 5 * 1024 * 1024);
    console.log(chunks.length);
    // iterative get presigned url for each chunk and upload it to s3 server
    const { partsInfo, failedChunkIndex } = await handlePartUpload(
      resourceId,
      chunks
    );

    // Set state to retry
    if (failedChunkIndex !== null) {
      console.log("Prepare retry");
      setIsUploading(false);
      setCurrentChunkIndex(failedChunkIndex);
      setCurrentPartsInfo(partsInfo);
      setIsFailed(true);
      return;
    }

    // send upload complete request
    const respCompleteUpload = await handleUploadComplete(
      resourceId,
      partsInfo
    );
    if (respCompleteUpload.status === 0) {
      console.log("Success");
      setIsUploading(false);
      setUploadPercent(100);
      setIsFailed(false);
      setIsDone(true);
    } else {
      setIsFailed(true);
      alert(respCompleteUpload.message);
    }
  }

  // React.useEffect(() => {
  //   const amount = 30;
  //   const newPercent = uploadPercent + amount;
  //   console.log(`New: ${newPercent} vs Next: ${nextPercent}`);
  //   console.log(`Compare: ${isUploading && newPercent < nextPercent - 1}`);

  //   timerRef.current = setInterval(() => {
  //     if (isUploading && newPercent < nextPercent - 1) {
  //       setUploadPercent((prv) => prv + amount);
  //     }
  //   }, 1000);

  //   return () => {
  //     clearInterval(timerRef.current);
  //   };
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [isUploading, nextPercent]);

  return {
    // Handler function
    handleInitUpload,
    handleUpload,
    handleRetry,

    // Resource info
    currentResourceId,

    // Upload status
    uploadPercent,
    isUploading,
    isFailed,
    isDone,
  };
};

export default useUpload;
