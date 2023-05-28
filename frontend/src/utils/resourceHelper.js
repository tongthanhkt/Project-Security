import { API } from "../common/api";
import { RESOURCE_TYPE, UPLOAD_STATUS } from "../common/constants";
import { PAGE_PATH } from "../routes/page-paths";
import { handleGet, handlePost, handlePut } from "./fetch";
import {
  getDuration,
  getFileType,
  splitFileIntoDataChunks,
} from "./fileHelper";

export const getLessonsResource = async (lessonId) => {
  try {
    const res = await handleGet(API.GET_LIST_RESOURCE(lessonId));
    return res;
  } catch (error) {
    console.log(
      "🚀 ~ file: resourceHelper.js:9 ~ getLessonsResource ~ error:",
      error
    );
  }
};

export const removeResourceInLesson = async (resourceId, lessonId) => {
  try {
    const reqData = {
      resourceId: resourceId,
      lessonId: lessonId,
    };
    console.log(
      "🚀 ~ file: resourceHelper.js:22 ~ removeResourceInLesson ~ reqData:",
      reqData
    );
    const res = await handlePost(API.REMOVE_RESOURCE, reqData);
    return res;
  } catch (error) {
    console.log(
      "🚀 ~ file: resourceHelper.js:25 ~ removeResourceInLesson ~ error:",
      error
    );
  }
};

export const removeResourcePerma = async (resourceId) => {
  try {
    const reqData = {
      resourceId: resourceId,
    };
    const res = await handlePost(API.REMOVE_RESOURCE_PERMANENT, reqData);
    return res;
  } catch (error) {
    console.log(
      "🚀 ~ file: resourceHelper.js:40 ~ removeResourcePerma ~ error:",
      error
    );
  }
};

// Upload
export const initUpload = async (file) => {
  if (!file) {
    return alert("Please select a file");
  }
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
  } else {
    console.log(
      "🚀 ~ file: resourceHelper.js:69 ~ initUpload ~ resp.message:",
      resp.message
    );
    // alert(resp.message);
  }
  console.log(`Done init ${file.name}`);

  return resourceId;
};

async function handlePartUpload(
  resourceId,
  chunks,
  chunkIndex = 0,
  currentPartsInfo = []
) {
  var failedChunkIndex = null;
  var partsInfo = currentPartsInfo;

  for (let i = chunkIndex; i < chunks.length; i++) {
    const chunk = chunks[i];
    const respGetUrl = await handlePost(
      `${PAGE_PATH.BASE}/${API.UPLOAD_PART}`,
      {
        resourceId,
        nthPath: i + 1,
      }
    );
    if (respGetUrl.status !== 0) {
      // alert(respGetUrl.message);
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

    partsInfo.push({
      PartNumber: i + 1,
      ETag: respUploadChunk.headers.etag.slice(
        1,
        respUploadChunk.headers.etag.length - 1
      ),
    });
  }

  return {
    partsInfo,
    chunks,
    failedChunkIndex,
    resourceId,
  };
}

async function handleUploadComplete(resourceId, partsInfo, file) {
  const resourceData = {
    resourceId,
    partInfoList: JSON.stringify(partsInfo),
    type: getFileType(file.name),
  };
  console.log(
    "🚀 ~ file: resourceHelper.js:125 ~ handleUploadComplete ~ resourceData:",
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

  return respCompleteUpload;
}

export async function handleUpload(resourceId, file) {
  // split the file into chunks data
  const chunks = splitFileIntoDataChunks(file, 5 * 1024 * 1024);
  console.log(chunks.length);
  // iterative get presigned url for each chunk and upload it to s3 server
  const { partsInfo, failedChunkIndex } = await handlePartUpload(
    resourceId,
    chunks
  );

  // Return data for retry
  if (failedChunkIndex !== null) {
    console.log("Prepare retry");
    return {
      partsInfo,
      chunks,
      failedChunkIndex,
      resourceId,
      status: UPLOAD_STATUS.FAILED,
    };
  }

  // send upload complete request
  const respCompleteUpload = await handleUploadComplete(
    resourceId,
    partsInfo,
    file
  );
  if (respCompleteUpload.status === 0) {
    console.log(`Upload success ${file.name}`);
    return { status: UPLOAD_STATUS.SUCCESS };
  } else {
    console.log(respCompleteUpload.message);
    console.log(`Fail upload ${file}`);
    alert(respCompleteUpload.message);
    return {
      partsInfo,
      chunks,
      failedChunkIndex,
      resourceId,
      status: UPLOAD_STATUS.FAILED,
    };
  }
}

export async function handleRetry(
  file,
  resourceId,
  chunks,
  chunkIndex,
  curPartsInfo
) {
  const { partsInfo, failedChunkIndex } = await handlePartUpload(
    resourceId,
    chunks,
    chunkIndex,
    curPartsInfo
  );

  // Return data for retry
  if (failedChunkIndex !== null) {
    return {
      partsInfo,
      failedChunkIndex,
      chunks,
      resourceId,
      status: UPLOAD_STATUS.FAILED,
    };
  }

  // send upload complete request
  const respCompleteUpload = await handleUploadComplete(
    resourceId,
    partsInfo,
    file
  );
  if (respCompleteUpload.status === 0) {
    console.log(`Upload complete ${file}`);
    return { status: UPLOAD_STATUS.SUCCESS };
  } else {
    console.log(respCompleteUpload.message);
    console.log(`Fail upload ${file}`);
    alert(respCompleteUpload.message);
    return {
      partsInfo,
      chunks,
      failedChunkIndex,
      resourceId,
      status: UPLOAD_STATUS.FAILED,
    };
  }
}
