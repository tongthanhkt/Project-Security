import userVerificationModel from "../model/userVerification.model.js";
import timeUtils from "../utils/timeUtils.js";

const TIME_OUT_RATE_LIMIT_MILLIS = 5 * 60 * 1000; // 5m

export default {
  async canSendVerifyEmail(uid) {
    const userVerificationPaging = await userVerificationModel.getMore(
      { userId: uid },
      0,
      1,
      "_id token ts"
    );
    // console.log(userVerificationPaging);
    if (!userVerificationPaging || userVerificationPaging.docs.length === 0) {
      return {
        canSend: true,
        data: null,
      };
    }

    if (
      timeUtils.getCurrentTs() - userVerificationPaging.docs[0].ts >=
      TIME_OUT_RATE_LIMIT_MILLIS
    ) {
      return {
        canSend: true,
        data: userVerificationPaging.docs[0],
      };
    }

    return {
      canSend: false,
      data: userVerificationPaging.docs[0],
    };
  },

  timeInSecondLeft(createdAt) {
    const curMillis = timeUtils.getCurrentTs();
    // console.log(curMillis, createdAt + TIME_OUT_RATE_LIMIT_MILLIS);
    return curMillis > createdAt + TIME_OUT_RATE_LIMIT_MILLIS
      ? 0
      : (createdAt + TIME_OUT_RATE_LIMIT_MILLIS - curMillis) / 1000;
  },
};
