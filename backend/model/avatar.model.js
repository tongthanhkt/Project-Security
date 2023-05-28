import nodeFetch from "node-fetch";
import User from "../schemas/userSchema.js";
import { imgStorageService } from "../service/imgStorage.service.js";
import respCode from "../utils/respCode.js";

export default {
  INTERNAL_ERR: respCode.INTERNAL_ERR,
  INVALID_IMG: respCode.INVALID_DATA,
  SUCCESS: respCode.SUCCESS,

  async getAvtByUid(uid) {
    const userRet = await User.findById({ _id: uid }).select("avt").exec();
    return userRet;
  },

  toPath(uid, filename) {
    return `${uid}/avt/${filename}`;
  },

  async updateAvt(uid, oriFilename, buffer, mimetype) {
    const filePathList = await imgStorageService.listFilenames(`${uid}/avt`);
    const imgPath = this.toPath(uid, oriFilename);
    const avtUrl = await imgStorageService.uploadFile(
      imgPath,
      buffer,
      mimetype
    );
    if (!avtUrl || avtUrl.length === 0) {
      return {
        code: this.INTERNAL_ERR,
        data: null,
      };
    }
    filePathList.forEach((filePath) => {
      if (filePath !== imgPath && filePath.startsWith(uid)) {
        imgStorageService.removeFile(filePath);
      }
    });
    await User.updateOne({ _id: uid }, { avt: avtUrl });
    return {
      code: this.SUCCESS,
      data: avtUrl,
    };
  },

  async removeAvt(uid) {
    await User.updateOne({ _id: uid }, { avt: null });
    await imgStorageService.removeFolder(`${uid}/avt`);
  },

  async reupAvtFromLink(uid, link) {
    try {
      const res = await nodeFetch(link);
      const mimetype = res.headers.get("content-type");
      if (!mimetype.startsWith("image/")) {
        return {
          code: this.INTERNAL_ERR,
          data: null,
        };
      }
      const filename = `avt.${mimetype.split("image/")[1]}`;
      const buffer = Buffer.from(await res.arrayBuffer());
      return await this.updateAvt(uid, filename, buffer, mimetype);
    } catch (err) {
      console.log("avatar.model.js reupAvt:", err);
    }
  },
};
