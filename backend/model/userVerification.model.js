import UserVerification from "../schemas/userVerificationsSchema.js";
import { DEFAULT_LIMIT, getNewObjectId } from "../utils/database.js";
import timeUtils from "../utils/timeUtils.js";

export default {
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
    const userVerificationPaging = await UserVerification.paginate(conditions, {
      page,
      limit,
      select: selections,
      sort,
    });
    return userVerificationPaging;
  },

  async save(userVerification) {
    try {
      const ret = await userVerification.save();
      return ret;
    } catch (err) {
      console.log(err.code);
    }
    return null;
  },

  async create(uid, token) {
    const userVerification = new UserVerification({
      _id: getNewObjectId().toString(),
      userId: uid,
      token,
      ts: timeUtils.getCurrentTs(),
    });
    return await this.save(userVerification);
  },

  async delete(uid) {
    const ret = await UserVerification.deleteMany({ userId: uid }).exec();
    return ret;
  },
};
