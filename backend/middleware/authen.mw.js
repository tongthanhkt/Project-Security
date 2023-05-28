import { parse } from "cookie";
import CookieModel from "../model/cookie.model.js";
import AuthModel from "../model/authen.model.js";
import userModel from "../model/user.model.js";
import { ROLE } from "../utils/database.js";
import { WS_RESP } from "../utils/respCode.js";
import meetingModel from "../model/meeting.model.js";
import validator from "../utils/validator.js";
import timeUtils from "../utils/timeUtils.js";

const FIVE_MINS_LEFT = 5 * 60;

export default {
  async stopWhenNotStudent(req, res, next) {
    const accessTok = AuthModel.getAccessTokenFromReq(req);
    const { code, data } = AuthModel.verifyAccessToken(accessTok, false);
    if (code === AuthModel.VALID_TOKEN && data.uid) {
      const user = await userModel.getRole(data.uid);
      if (
        user &&
        (user.role === ROLE.STUDENT || user.role === ROLE.VIP_STUDENT)
      ) {
        return next();
      }
      return res.json({
        code: 401,
        mesaage: "No permisstion to acceess",
      });
    }
    return res.json({
      code: 400,
      mesaage: "No permission to access",
    });
  },

  async stopWhenNotLogon(req, res, next) {
    const accessTok = AuthModel.getAccessTokenFromReq(req);
    if (accessTok === null) {
      return res.json({
        code: 401,
        message: "No permission to access",
      });
    }

    let isExpired = false;
    const { code, data } = AuthModel.verifyAccessToken(accessTok, false);
    switch (code) {
      case AuthModel.INVALID_TOKEN:
        return res.json({
          code: 400,
          message: "Invalid access token",
        });
      case AuthModel.TOKEN_EXPIRED:
        isExpired = true;
      default:
        if (isExpired || data.exp - Date.now() / 1000 <= FIVE_MINS_LEFT) {
          // renew token
          const tokens = await AuthModel.renewAccessToken(
            data.uid,
            accessTok,
            CookieModel.getRefreshToken(req.cookies)
          );
          if (!tokens) {
            return res.json({
              code: 400,
              message: "Invalid access token",
            });
          }
          const { accessToken, refreshToken } = tokens;
          if (accessToken && refreshToken) {
            CookieModel.setToken(res, CookieModel.ACCESS_TOKEN, accessToken);
            CookieModel.setToken(res, CookieModel.REFRESH_TOKEN, refreshToken);
          } else if (isExpired) {
            return res.json({
              code: 400,
              message: "Invalid access token",
            });
          }
        }
        next();
    }
  },

  async stopWhenNotAdmin(req, res, next) {
    const accessTok = AuthModel.getAccessTokenFromReq(req);
    const { code, data } = AuthModel.verifyAccessToken(accessTok, false);
    if (code === AuthModel.VALID_TOKEN && data.uid) {
      const user = await userModel.getRole(data.uid);
      if (user && user.role === ROLE.ADMIN) {
        return next();
      }
      return res.json({
        code: 401,
        message: "No permission to access",
      });
    }
    return res.json({
      code: 400,
      message: "Invalid access token",
    });
  },

  async stopWhenNotAdminOrTA(req, res, next) {
    const accessTok = AuthModel.getAccessTokenFromReq(req);
    const { code, data } = AuthModel.verifyAccessToken(accessTok, false);
    if (code === AuthModel.VALID_TOKEN && data.uid) {
      const user = await userModel.getRole(data.uid);
      if (user && (user.role === ROLE.ADMIN || user.role === ROLE.TA)) {
        return next();
      }
      return res.json({
        code: 401,
        message: "No permission to access",
      });
    }
    return res.json({
      code: 400,
      message: "Invalid access token",
    });
  },

  stopWhenLogon(req, res, next) {
    const authStr = req.headers.authorization;
    if (
      authStr ||
      CookieModel.getAccessToken(req.cookies) ||
      CookieModel.getRefreshToken(req.cookies)
    ) {
      return res.json({
        code: 200,
        message: "You logged in",
      });
    }
    next();
  },

  async wsStopWhenNotLogon(socket, req, next) {
    // console.log(socket, "\n\n\n");
    // console.log(req);
    // console.log(next);
    if (req.headers.cookie) {
      const cookies = parse(req.headers.cookie);
      if (
        cookies[CookieModel.ACCESS_TOKEN] &&
        cookies[CookieModel.REFRESH_TOKEN]
      ) {
        const { code } = AuthModel.verifyAccessToken(
          cookies[CookieModel.ACCESS_TOKEN],
          false
        );
        if (code === AuthModel.VALID_TOKEN) {
          return next();
        }
      }
    }

    socket.close(WS_RESP.STOP_CONNECT);
    return next(new Error("Client not logged in"));
  },

  async wsCanJoinRoom(socket, req, next) {
    const uid = AuthModel.getUidFromReqWs(req);
    if (!uid) {
      socket.close(WS_RESP.STOP_CONNECT, "Invalid credentials");
      return next(new Error("Invalid credentials"));
    }

    const user = await userModel.getRole(uid);
    if (user && user.role === ROLE.ADMIN) {
      // console.log("Joined as admin permission");
      return next();
    }

    const { meetingId } = req.params;
    if (!validator.isValidStr(meetingId)) {
      socket.close(WS_RESP.STOP_CONNECT, "Invalid meeting id");
      return next(new Error("Invalid meeting id"));
    }

    const currentTs = timeUtils.getCurrentTs();
    const meeting = await meetingModel.findById(meetingId);

    if (
      !meeting ||
      (meeting.ownerId !== uid &&
        meeting.members !== null &&
        meeting.members.indexOf(uid) === -1)
    ) {
      socket.close(
        WS_RESP.STOP_CONNECT,
        "Can not to join private coding collaboration room"
      );
      return next(
        new Error("Can not to join private coding collaboration room")
      );
    }
    if (meeting.startTs > currentTs || meeting.endTs <= currentTs) {
      socket.close(
        WS_RESP.STOP_CONNECT,
        "Can not to join expired coding collaboration room"
      );
      return next(
        new Error("Can not to join expired coding collaboration room")
      );
    }
    return next();
  },
};
