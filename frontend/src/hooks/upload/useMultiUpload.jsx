import React from "react";
import { UPLOAD_STATUS } from "../../common/constants";
import { handleUpload, initUpload } from "../../utils/resourceHelper";

function fileContructor(
  file,
  id,
  isUploading = false,
  isFailed = false,
  isDone = false
) {
  this.file = file;
  this.resourceId = id;
  // Status
  this.isUploading = isUploading;
  this.isFailed = isFailed;
  this.isDone = isDone;
}

const useMultiUpload = (files = []) => {
  // Upload status
  const [isUploading, setIsUploading] = React.useState(false);

  // Upload info
  const [listResource, setListResource] = React.useState([]);

  async function handleInitUploadMulti() {
    if (files.length === 0) {
      return alert("Please select a file");
    }

    // Init multiple files
    const promises = files.map(async (file, index) => {
      // Init single file
      console.log(`File ${index}: ${file}`);
      const resourceId = await initUpload(file);

      return new fileContructor(file, resourceId);
    });

    const listResource = await Promise.all(promises);
    setListResource(listResource);

    return listResource;
  }

  async function handleUploadMulti(listResource) {
    // setIsUploading(true);

    // const promises = listResource.map(
    //   async (resource) => await handleUpload(resource.resourceId, resource.file)
    // );

    // // Upload multi files
    // const uploadInfo = await Promise.all(promises);

    // // Check if need retry
    // // { resourceId, chunks, failedChunkIndex, partsInfo, status }
    // const errFile = uploadInfo.find(
    //   (item) => item.status === UPLOAD_STATUS.FAILED
    // );
    // if (!!errFile) {
    //   console.log(errFile);
    //   return false;
    // }

    // setIsUploading(false);
    // return true;
    setIsUploading(true);

    const promises = listResource.map(
      async (resource) => await handleUpload(resource.resourceId, resource.file)
    );

    const results = await Promise.allSettled(promises);

    const isSuccess = results.every((result) => result.status === "fulfilled");

    setIsUploading(false);
    return isSuccess;
  }

  // async function retry(file, resourceId, chunks, chunkIndex) {
  //   handleRetry(file, resourceId, chunks, chunkIndex);
  // }

  React.useEffect(() => {
    setListResource([]);
  }, [files]);

  return {
    // Handler function
    handleInitUploadMulti,
    handleUploadMulti,

    // Resource info
    listResource,

    // Upload status
    isUploading,
  };
};

export default useMultiUpload;
