import taInvitationModel from "../model/taInvitation.model.js";
import timeUtils from "../utils/timeUtils.js";

const TIME_OUT_RATE_LIMIT_MILLIS = 5 * 60 * 1000; // 5m

export default {
  async canInvite(email) {
    const invitationPaging = await taInvitationModel.getMore(
      { email },
      0,
      1,
      "_id token ts"
    );
    // console.log(invitationPaging);
    if (!invitationPaging || invitationPaging.docs.length === 0) {
      return {
        canInvite: true,
        data: null,
      };
    }

    if (
      timeUtils.getCurrentTs() - invitationPaging.docs[0].ts >=
      TIME_OUT_RATE_LIMIT_MILLIS
    ) {
      return {
        canInvite: true,
        data: invitationPaging.docs[0],
      };
    }

    return {
      canInvite: false,
      data: invitationPaging.docs[0],
    };
  },

  timeInSecondLeft(createdAt) {
    const curMillis = timeUtils.getCurrentTs();
    console.log(curMillis, createdAt + TIME_OUT_RATE_LIMIT_MILLIS);
    return curMillis > createdAt + TIME_OUT_RATE_LIMIT_MILLIS
      ? 0
      : (createdAt + TIME_OUT_RATE_LIMIT_MILLIS - curMillis) / 1000;
  },
};
