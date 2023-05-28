import { FirebaseWorker } from "../worker/firebase.worker.js";

const firebaseCli = new FirebaseWorker();

export const imgStorageService = {
  /**
   *
   * @param {string} path
   * @param {ArrayBuffer} file
   * @param {string} mimetype
   * @returns {Promise<string>}
   */
  async uploadFile(path, file, mimetype) {
    return await firebaseCli.uploadFile(path, file, mimetype);
  },

  /**
   *
   * @param {string} path
   * @returns {Promise<Boolean>}
   */
  async removeFile(path) {
    return await firebaseCli.removeFile(path);
  },

  /**
   *
   * @param {string} path
   * @returns {Promise<Boolean>}
   */
  async removeFolder(path) {
    return await firebaseCli.removeFolder(path);
  },

  /**
   *
   * @param {string} path
   * @returns {Promise<Array<string>>}
   */
  async listFilenames(path) {
    return await firebaseCli.listFilenames(path);
  },
};
