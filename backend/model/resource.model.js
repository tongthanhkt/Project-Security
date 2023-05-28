import Resource from "../schemas/resourceSchema.js";
import { DEFAULT_LIMIT } from "../utils/database.js";
import uploadWorker from "../worker/upload.worker.js";

export const RESOURCE_TYPE = {
  VIDEO: 1,
  DOCUMENT: 2,
  AUDIO: 3,
  THUMB_COURSE: 4,
};

export const DEFAULT_TIME_IN_SEC = 2 * 60 * 60;

export default {
  async checkSubResourse(resourceIds) {
    const resourceList = await Resource.find();
    const resourceIdList = resourceList.map((resource) => resource._id);
    return resourceIds.every((resourceId) =>
      resourceIdList.includes(resourceId)
    );
  },
  async getResourceInLesson(resoureIds) {
    const promises = resoureIds.map((resource) => {
      return Resource.findById(resource).exec();
    });
    const result = await Promise.all(promises).then((resources) => {
      return resources;
    });
    return result;
  },
  async findById(resId) {
    const resRet = await Resource.findById({ _id: resId }).exec();
    return resRet;
  },

  async isExist(resId) {
    const resRet = await Resource.findById(resId, "_id").select("_id").exec();
    return resRet !== null;
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

  isValidResourceType(type) {
    switch (type) {
      case RESOURCE_TYPE.VIDEO:
      case RESOURCE_TYPE.AUDIO:
      case RESOURCE_TYPE.THUMB_COURSE:
      case RESOURCE_TYPE.DOCUMENT:
        return true;
      default:
        return false;
    }
  },

  async getMore(
    conditions,
    page = 0,
    limit = DEFAULT_LIMIT,
    selections = "_id",
    sort = { _id: -1 }
  ) {
    if (page < 0 || limit <= 0) {
      return null;
    }
    const resources = await Resource.paginate(conditions, {
      page,
      limit,
      select: selections,
      sort,
    });
    return resources;
  },

  async multiGet(resourceIds, selections) {
    const courses = await Resource.find({ _id: { $in: resourceIds } })
      .select(selections)
      .exec();
    const mapRes = new Map();
    if (courses) {
      for (let i = 0; i < courses.length; i++) {
        mapRes.set(courses[i]._id, courses[i]);
      }
    }
    for (let i = 0; i < resourceIds.length; i++) {
      if (!mapRes.get(resourceIds[i])) {
        mapRes.set(resourceIds[i], null);
      }
    }
    return mapRes;
  },

  toResourceKey(resourceId, resourceName) {
    return resourceId + "/" + resourceName;
  },

  async getSignedUrls(resourceIds, time = DEFAULT_TIME_IN_SEC) {
    const resourceUploadIdMap = new Map();
    const resourceKeyIdMap = new Map();
    const resourceKeys = [];
    const resourceNameMap = await this.multiGet(resourceIds, "_id name");
    resourceNameMap.forEach((value, _id) => {
      if (value) {
        resourceKeys.push(this.toResourceKey(_id, value.name));
        resourceKeyIdMap.set(this.toResourceKey(_id, value.name), _id);
      }
    });

    const resKeySignedUrlMap = await this.getSignedUrlsByResKey(
      resourceKeys,
      DEFAULT_TIME_IN_SEC
    );
    resKeySignedUrlMap.forEach((value, resKey) => {
      if (value) {
        resourceUploadIdMap.set(resourceKeyIdMap.get(resKey), value);
      }
    });
    resourceKeys.forEach((resKey) => {
      if (!resourceUploadIdMap.get(resourceKeyIdMap.get(resKey))) {
        resourceUploadIdMap.set(resourceKeyIdMap.get(resKey), null);
      }
    });

    resourceIds.forEach((resId) => {
      if (!resourceUploadIdMap.get(resId)) {
        resourceUploadIdMap.set(resId, null);
      }
    });
    return resourceUploadIdMap;
  },

  async getSignedUrlsByResKey(resourceKeys, time = DEFAULT_TIME_IN_SEC) {
    const res = new Map();
    for (let i = 0; i < resourceKeys.length; i++) {
      const signedUrl = await uploadWorker.getSignedUrl(resourceKeys[i], time);
      res.set(resourceKeys[i], signedUrl);
    }
    return res;
  },

  async remove(resourceId) {
    const ret = await Resource.deleteOne({ _id: resourceId }).exec();
    return ret;
  },

  async unlinkCourseIds(resourceId, courseIds) {
    const ret = await Resource.updateMany(
      { _id: resourceId },
      { $pullAll: { courses: courseIds } }
    ).exec();
    return ret;
  },
};
