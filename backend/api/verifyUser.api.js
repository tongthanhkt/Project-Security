/* eslint-disable no-console */
/* eslint-disable import/extensions */
/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
import express from "express";
import authenMw from "../middleware/authen.mw.js";
import authenModel from "../model/authen.model.js";
import mailingModel from "../model/mailing.model.js";
import userModel from "../model/user.model.js";
import userVerificationModel from "../model/userVerification.model.js";
import verifyEmailRatelimiter from "../ratelimiter/verifyEmail.ratelimiter.js";
import { STATUS_ACCOUNT } from "../utils/database.js";
import respCode from "../utils/respCode.js";
import validator from "../utils/validator.js";

const router = express.Router();

async function checkValidToken(token) {
  if (!validator.isValidStr(token)) {
    return {
      isValid: false,
      data: {
        status: respCode.INVALID_DATA,
        message: respCode.MSG_INVALID_DATA,
      },
    };
  }

  const { code, data } = authenModel.verifyConfirmationToken(token);
  if (
    code === authenModel.INVALID_TOKEN ||
    code === authenModel.TOKEN_EXPIRED ||
    !data ||
    !data.uid
  ) {
    return {
      isValid: false,
      data: {
        status: respCode.EXPIRED,
        message: respCode.USER.EXPIRED_TOKEN,
      },
    };
  }

  const verificationPaging = await userVerificationModel.getMore(
    { userId: data.uid },
    0,
    1,
    "_id token"
  );
  if (
    !verificationPaging ||
    verificationPaging.docs.length === 0 ||
    verificationPaging.docs[0].token !== token
  ) {
    return {
      isValid: false,
      data: {
        status: respCode.EXPIRED,
        message: respCode.USER.EXPIRED_TOKEN,
      },
    };
  }

  const { status } = await userModel.getInfoById(data.uid, "_id status");
  if (status === STATUS_ACCOUNT.activated) {
    return {
      isValid: false,
      data: {
        status: respCode.EXPIRED,
        message: respCode.USER.EXPIRED_TOKEN,
      },
    };
  }
  return {
    isValid: true,
    data: { uid: data.uid },
  };
}

router.post("/verify", async (req, res) => {
  const { token } = req.body;
  const { isValid, data } = await checkValidToken(token);
  if (!isValid) {
    return res.json(data);
  }

  userModel.activateById(data.uid);
  userVerificationModel.delete(data.uid);

  return res.json({
    status: respCode.SUCCESS,
  });
});

router.post(
  "/send-verify-link",
  authenMw.stopWhenNotLogon,
  async (req, res) => {
    const ownerId = authenModel.getUidFromReq(req);
    const userInfo = await userModel.getInfoById(
      ownerId,
      "_id email name status"
    );
    // error in db
    if (!userInfo) {
      return res.json({
        status: respCode.INTERNAL_ERR,
        message: respCode.MSG_INTERNAL_ERR,
      });
    }

    const { _id, email, name, status } = userInfo;
    if (status === STATUS_ACCOUNT.activated) {
      return res.json({
        status: respCode.EXISTED,
        message: respCode.USER.ALREADY_VERIFIED,
      });
    }

    // rate limit
    const { canSend, data } = await verifyEmailRatelimiter.canSendVerifyEmail(
      ownerId
    );
    if (!canSend) {
      return res.json({
        status: respCode.RETRY_LATER,
        message: respCode.USER.RETRY_INVITE_LATER,
        secondLeft: verifyEmailRatelimiter.timeInSecondLeft(data.ts),
      });
    }

    const tokenBase64 = authenModel.genConfirmationToken(ownerId);
    const verification = await userVerificationModel.create(
      ownerId,
      tokenBase64
    );
    if (!verification) {
      return res.json({
        status: respCode.INTERNAL_ERR,
        message: respCode.MSG_INTERNAL_ERR,
      });
    }

    mailingModel.sendVerifyEmail({
      name,
      email,
      token: tokenBase64,
    });
    return res.json({
      status: respCode.SUCCESS,
    });
  }
);

export default router;
