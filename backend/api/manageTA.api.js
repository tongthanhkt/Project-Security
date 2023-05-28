/* eslint-disable no-console */
/* eslint-disable import/extensions */
/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
import express from "express";
import authenMw from "../middleware/authen.mw.js";
import authenModel from "../model/authen.model.js";
import mailingModel from "../model/mailing.model.js";
import taInvitationModel from "../model/taInvitation.model.js";
import userModel from "../model/user.model.js";
import inviteTARatelimiter from "../ratelimiter/inviteTA.ratelimiter.js";
import { ROLE, STATUS_ACCOUNT } from "../utils/database.js";
import respCode from "../utils/respCode.js";
import timeUtils from "../utils/timeUtils.js";
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

  const { code, data } = authenModel.verifyTAInvitationToken(token);
  if (
    code === authenModel.INVALID_TOKEN ||
    code === authenModel.TOKEN_EXPIRED ||
    !data ||
    !data.email
  ) {
    return {
      isValid: false,
      data: {
        status: respCode.EXPIRED,
        message: respCode.TA.EXPIRED_TOKEN,
      },
    };
  }

  const invitationPaging = await taInvitationModel.getMore(
    { email: data.email },
    0,
    1,
    "_id token"
  );
  if (
    !invitationPaging ||
    invitationPaging.docs.length === 0 ||
    invitationPaging.docs[0].token !== token
  ) {
    return {
      isValid: false,
      data: {
        status: respCode.EXPIRED,
        message: respCode.TA.EXPIRED_TOKEN,
      },
    };
  }

  if (await userModel.findByEmail(data.email)) {
    return {
      isValid: false,
      data: {
        status: respCode.EXPIRED,
        message: respCode.TA.EXPIRED_TOKEN,
      },
    };
  }

  return {
    isValid: true,
    data: { email: data.email },
  };
}

router.post("/create", authenMw.stopWhenNotAdmin, async (req, res) => {
  const { email } = req.body;
  if (
    !validator.isValidStr(email) ||
    !userModel.isValidEmail(email.toString().trim())
  ) {
    return res.json({
      status: respCode.INVALID_DATA,
      message: respCode.MSG_INVALID_DATA,
    });
  }

  if (await userModel.findByEmail(email.toString().trim())) {
    return res.json({
      status: respCode.EXISTED,
      message: respCode.TA.EXISTED,
    });
  }

  // rate limit
  const { canInvite, data } = await inviteTARatelimiter.canInvite(
    email.toString().trim()
  );
  if (!canInvite) {
    return res.json({
      status: respCode.RETRY_LATER,
      message: respCode.TA.RETRY_INVITE_LATER,
      secondLeft: inviteTARatelimiter.timeInSecondLeft(data.ts),
    });
  }

  const tokenBase64 = authenModel.genTAInvitationToken(email.toString().trim());
  const invitation = await taInvitationModel.create(email, tokenBase64);
  if (!invitation) {
    return res.json({
      status: respCode.INTERNAL_ERR,
      message: respCode.MSG_INTERNAL_ERR,
    });
  }

  mailingModel.sendTAInvitationEmail({
    email: email.toString().trim(),
    token: tokenBase64,
  });
  return res.json({
    status: respCode.SUCCESS,
  });
});

router.post("/check-valid", async (req, res) => {
  const { token } = req.body;
  const { isValid, data } = await checkValidToken(token);
  if (!isValid) {
    return res.json(data);
  }

  return res.json({
    status: respCode.SUCCESS,
  });
});

router.post("/register-by-token", async (req, res) => {
  const { name, addr, password, token } = req.body;
  if (
    !validator.isValidStr(name) ||
    name.trim().length === 0 ||
    !validator.isValidStr(password) ||
    password.trim().length === 0 ||
    password.trim().length < 8 ||
    !validator.isValidStr(addr) ||
    addr.trim().length === 0 ||
    !validator.isValidStr(token) ||
    token.trim().length === 0
  ) {
    return res.json({
      status: respCode.INVALID_DATA,
      message: respCode.MSG_INVALID_DATA,
    });
  }

  const { isValid, data } = await checkValidToken(token);
  if (!isValid) {
    return res.json(data);
  }

  const { email } = data;
  const result = await userModel.create({
    email,
    name: name.trim(),
    addr: addr.trim(),
    password: password.trim(),
    role: ROLE.TA,
    status: STATUS_ACCOUNT.activated,
  });
  if (!result) {
    return res.json({
      status: respCode.INTERNAL_ERR,
      message: respCode.MSG_INTERNAL_ERR,
    });
  }

  taInvitationModel.delete(email);

  return res.json({
    status: respCode.SUCCESS,
    info: {
      id: result.user._id,
      name: result.user.name,
      email: result.user.email,
      addr: result.user.addr,
      status: result.user.status,
    },
    refreshToken: result.refreshToken,
    accessToken: result.accessToken,
  });
});

export default router;
