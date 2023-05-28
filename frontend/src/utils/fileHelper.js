import _ from "lodash";
import { RESOURCE_TYPE } from "../common/constants";

function getFileType(fileName) {
  const fileExtention = fileName.split(".").pop();

  var fileType;
  switch (fileExtention) {
    case "mp3":
      fileType = RESOURCE_TYPE.AUDIO;
      break;
    case "mp4":
      fileType = RESOURCE_TYPE.VIDEO;
      break;
    case "pdf":
      fileType = RESOURCE_TYPE.DOCUMENT;
      break;
    case "txt":
      fileType = RESOURCE_TYPE.DOCUMENT;
      break;
    case "png":
    case "jpg":
      fileType = RESOURCE_TYPE.THUMB_COURSE;
      break;

    default:
      break;
  }
  return fileType;
}

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

function mergeTwoArrSameKey(arr1, arr2, key) {
  const result = _.values(_.merge(_.keyBy(arr1, key), _.keyBy(arr2, key)));
  return result;
}
function mergeTwoCourseSameId(arr1, arr2) {
  // const newArr = _.map(arr1, (a) => {
  //   const b = _.find(arr2, { _id: a.course });
  //   console.log("🚀 ~ file: fileHelper.js:48 ~ newArr ~ b:", b);

  //   return _.merge(_.omit(a, "_id"), { _id: b._id, title: b.title });
  // });

  // return newArr;
  const newArr = _.map(arr2, (b) => {
    const a = _.find(arr1, { course: b._id });
    return _.merge(_.omit(a, "_id"), b);
  });

  return newArr;
}
function convertSecondsToMinutes(seconds) {
  const newSecond = Math.floor(seconds);
  var minutes = Math.floor(newSecond / 60);
  var remainingSeconds = newSecond % 60;
  var formattedSeconds =
    remainingSeconds < 10 ? "0" + remainingSeconds : remainingSeconds;
  return minutes + ":" + formattedSeconds;
}

async function getDuration(file) {
  const video = document.createElement("video");
  video.src = URL.createObjectURL(file);

  return new Promise((resolve) => {
    video.muted = true;
    video.preload = "metadata";
    video.onloadedmetadata = function () {
      resolve(Math.round(video.duration));
    };
  });
}

function formatBytes(bytes, decimals = 2) {
  if (!+bytes) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));
  console.log(
    `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
  );

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

function htmlToPlainText(html) {
  // if (
  //   html.replace(/<(.|\n)*?>/g, "").trim().length === 0 &&
  //   !html.includes("<img")
  // ) {
  //   // Empty editor
  //   return "";
  // } else {
  //   // Not empty editor
  //   return html;
  // }
  return /<\/?[a-z][\s\S]*>/i.test(html)
    ? html.replace(/<(.|\n)*?>/g, "").trim()
    : html;
}

async function readText(file) {
  const reader = new FileReader();
  reader.readAsText(file);

  return new Promise((resolve) => {
    reader.onload = () => {
      resolve(reader.result.replace(/\r/g, ""));
    };
  });
}

export {
  getFileType,
  splitFileIntoDataChunks,
  getDuration,
  mergeTwoArrSameKey,
  formatBytes,
  mergeTwoCourseSameId,
  convertSecondsToMinutes,
  htmlToPlainText,
  readText,
};
