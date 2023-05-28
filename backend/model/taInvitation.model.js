import TAInvitation from "../schemas/taInvitationsSchema.js";
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
    const taInvitationPaging = await TAInvitation.paginate(conditions, {
      page,
      limit,
      select: selections,
      sort,
    });
    return taInvitationPaging;
  },

  async save(invitation) {
    try {
      const ret = await invitation.save();
      return ret;
    } catch (err) {
      console.log(err.code);
    }
    return null;
  },

  async create(email, token) {
    const invitation = new TAInvitation({
      _id: getNewObjectId().toString(),
      email: email.toString().trim(),
      token,
      ts: timeUtils.getCurrentTs(),
    });
    return await this.save(invitation);
  },

  async delete(email) {
    const ret = await TAInvitation.deleteMany({ email }).exec();
    return ret;
  },
};
