import Resource from "../schemas/resourceSchema.js";
import { getNewObjectId, UPLOAD_STATUS } from "../utils/database.js";
import timeUtils from "../utils/timeUtils.js";
import { RESOURCE_TYPE } from "./resource.model.js";

export default {
  DEFAULT_EXPIRED_RESOURCE: 2 * 60 * 60, // in seconds

  async findById(id) {
    const resourceRet = await Resource.findById({ _id: id }).exec();
    return resourceRet;
  },

  async save(resource) {
    try {
      const ret = await resource.save();
      return ret;
    } catch (err) {
      console.log(err.code);
    }
    return null;
  },

  genId() {
    return getNewObjectId().toString();
  },

  toFilePath(resourceId, fileName) {
    return resourceId + "/" + fileName;
  },

  async create({
    _id,
    fileName,
    uploadId,
    uploaderId,
    type = RESOURCE_TYPE.VIDEO,
  }) {
    const resource = new Resource({
      _id,
      name: fileName,
      uploadId,
      uploaderId,
      size: 0,
      createdAt: 0,
      status: UPLOAD_STATUS.UPLOADING,
      type,
      length: 0,
      courses: [],
    });
    const newResource = await this.save(resource);
    return newResource ? newResource : null;
  },

  async update({ _id, size, type, length }) {
    const res = await Resource.findOneAndUpdate(
      { _id },
      {
        size,
        createdAt: timeUtils.getCurrentTs(),
        status: UPLOAD_STATUS.DONE,
        type,
        length,
      }
    ).exec();
    return res !== null;
  },

  async deleteAll() {
    return await Resource.deleteMany();
  },
};
