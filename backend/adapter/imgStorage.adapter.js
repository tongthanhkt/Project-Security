class ImgStorageAdapter {
  constructor() {}

  /**
   *
   * @param {string} path
   * @param {ArrayBuffer} file
   * @param {string} mimetype
   * @returns {Promise<string>}
   */
  async uploadFile(path, file, mimetype) {
    throw new Error("not implemented");
  }

  /**
   *
   * @param {string} path
   * @returns {Promise<Boolean>}
   */
  async removeFile(path) {
    throw new Error("not implemented");
  }

  /**
   *
   * @param {string} path
   * @returns {Promise<Boolean>}
   */
  async removeFolder(path) {
    throw new Error("not implemented");
  }

  /**
   *
   * @param {string} path
   * @returns {Promise<Array<string>>}
   */
  async listFilenames(path) {
    throw new Error("not implemented");
  }
}
