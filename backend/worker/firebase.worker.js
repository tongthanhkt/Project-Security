import admin from "firebase-admin";
import env from "../utils/env.js";

admin.initializeApp({
  credential: admin.credential.cert(`./cert/${env.STORAGE_CERT_NAME}`),
  storageBucket: env.STORAGE_BUCKET,
});
const bucket = admin.storage().bucket();
/**
 * Class produce functionalities for storing files
 *
 * @class FirebaseWorker
 * @implements {ImgStorageAdapter}
 */
export class FirebaseWorker {
  constructor() {}

  /**
   *
   * @param {string} path
   * @param {ArrayBuffer} file
   * @param {string} mimetype
   * @returns {Promise<string>}
   */
  async uploadFile(path, file, mimetype) {
    const buffer = file;
    // Example code 1
    // const blob = bucket.file(path);
    // const blobWriter = blob.createWriteStream({
    //   metadata: {
    //     contentType: mimetype,
    //   },
    //   public: true,
    // });

    // blobWriter.on("error", (err) => {
    //   console.log("firebase.worker.js: uploadFile", err);
    // });
    // blobWriter.on("finish", () => {
    //   const mediaLink = `https://storage.googleapis.com/${env.STORAGE_BUCKET}/${path}`;
    //   console.log(mediaLink);
    // });

    // blobWriter.end(buffer);

    // Example code 2
    const blob = bucket.file(path);
    try {
      await blob.save(buffer, {
        gzip: true,
        uploadType: "media",
        metadata: {
          contentType: mimetype,
        },
        public: true,
      });
    } catch (err) {
      console.log("firebase.worker.js: uploadFile", err);
    }
    // console.log(blob.publicUrl());
    return blob.publicUrl();
  }

  /**
   *
   * @param {string} path
   * @returns {Promise<Boolean>}
   */
  async removeFile(path) {
    try {
      await bucket.file(path).delete();
      return true;
    } catch (err) {
      console.log("firebase.worker.js: removeFile", err);
    }
    return false;
  }

  /**
   *
   * @param {string} path
   * @returns {{Promise<Boolean>}}
   */
  async removeFolder(path) {
    try {
      await bucket.deleteFiles({ prefix: `${path}/` });
      return true;
    } catch (err) {
      console.log("firebase.worker.js: removeFolder", err);
    }
    return false;
  }

  /**
   *
   * @param {string} path
   * @returns {Promise<Array<string>>}
   */
  async listFilenames(path) {
    const result = [];
    try {
      const listObjList = await bucket.getFiles(path);
      const objList = listObjList[0];
      objList.forEach(({ name }) => {
        result.push(name);
      });
      return result;
    } catch (err) {
      console.log("firebase.worker.js: listFilenames", err);
      return [];
    }
  }
}
