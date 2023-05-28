/* eslint-disable no-underscore-dangle */
/* eslint-disable no-console */
/* eslint-disable camelcase */
/* eslint-disable import/extensions */

import express from "express";
import passport from "passport";
import AuthModel from "../model/authen.model.js";
import CookieModel from "../model/cookie.model.js";
import AuthMW from "../middleware/authen.mw.js";
import ThirdPartyAuthenModel from "../model/thirdPartyAuthen.model.js";
import UserModel from "../model/user.model.js";
import mailingModel from "../model/mailing.model.js";
import userVerificationModel from "../model/userVerification.model.js";
import avatarModel from "../model/avatar.model.js";

const router = express.Router();

router.post("/logout", AuthMW.stopWhenNotLogon, async (req, res) => {
  const refreshTok = CookieModel.getRefreshToken(req.cookies);
  const accessTok = CookieModel.getAccessToken(req.cookies);
  // const uid = CookieModel.getField(req.cookies, CookieModel.UID);

  // Just remove access token, cookie, uid from cookie of request and response to client
  CookieModel.removeField(res, CookieModel.ACCESS_TOKEN);
  CookieModel.removeField(res, CookieModel.REFRESH_TOKEN);
  CookieModel.removeField(res, CookieModel.UID);

  res.json({
    code: 200,
    message: "Logged out",
  });

  AuthModel.logout(accessTok, refreshTok);
});

router.post("/google", async (req, res) => {
  const { credential } = req.body;
  if (!credential) {
    return res.json({ status: 400, message: "Missing field" });
  }
  console.log(credential);
  const userRet = await ThirdPartyAuthenModel.verifyGoogleToken(credential);
  if (userRet === null) {
    return res.json({ status: 400, message: "Invalid credential" });
  }
  const { email, name, picture } = userRet;
  console.log(userRet);

  const { code, userInfo, accessToken, refreshToken, isNewAcc } =
    await UserModel.findOrCreateByThirdParty(email, name, "google");
  if (code !== 0) {
    return res.json({
      status: code,
    });
  }
  let reupRet = null;
  if (isNewAcc) {
    reupRet = await avatarModel.reupAvtFromLink(
      userInfo._id,
      picture ? picture : ""
    );
  } else {
    console.log("old accccccccccccccccccccc");
  }

  CookieModel.setToken(res, CookieModel.ACCESS_TOKEN, accessToken);
  CookieModel.setToken(res, CookieModel.REFRESH_TOKEN, refreshToken);
  CookieModel.setField(res, CookieModel.UID, userInfo._id);

  return res.json({
    status: 0,
    info: {
      id: userInfo._id,
      name: userInfo.name,
      email: userInfo.email,
      status: userInfo.status,
      avt: reupRet && reupRet.data ? reupRet.data : userInfo.avt,
      picture,
      accessToken,
      refreshToken,
    },
  });
});

router.post("/register", async (req, res) => {
  const { email, name, addr, password } = req.body;
  if (
    !email ||
    email.trim().length === 0 ||
    !name ||
    name.trim().length === 0 ||
    !password ||
    password.trim().length === 0 ||
    password.trim().length < 8 ||
    !addr ||
    addr.trim().length === 0
  ) {
    return res.json({
      status: 400,
      message: "Missing fields",
    });
  }
  if (!UserModel.isValidEmail(email.trim())) {
    return res.json({
      status: 422,
      message: "Invalid data",
    });
  }
  const user = await UserModel.findByEmail(email.trim());
  if (user) {
    return res.json({
      status: -1,
      message: "Email is existed",
    });
  }
  const result = await UserModel.create({
    email: email.trim(),
    name: name.trim(),
    addr: addr.trim(),
    password: password.trim(),
  });
  if (!result) {
    return res.json({
      status: 500,
    });
  }

  const tokenBase64 = AuthModel.genConfirmationToken(
    result.user._id.toString()
  );
  userVerificationModel.create(result.user._id.toString(), tokenBase64);
  mailingModel.sendVerifyEmail({
    name: result.user.name,
    email: result.user.email,
    token: tokenBase64,
  });

  return res.json({
    status: 0,
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

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.json({ status: 400, message: "Missing fields" });
  }
  const user = await UserModel.findByEmail(email);
  if (!user) {
    return res.json({
      status: -3,
      message: "Email or password is incorrect",
    });
  }
  if (user.pwd) {
    if (!UserModel.isSamePassword(password, user.pwd)) {
      return res.json({
        status: -3,
        message: "Email or password is incorrect",
      });
    }
    return res.json({
      status: 0,
      data: await AuthModel.login(res, user),
    });
  }
  return res.json({
    status: -2,
    message: "Existed account linked to a social account",
  });
});

export default router;
