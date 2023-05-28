import express from "express";
import multer from "multer";
import authenMw from "../middleware/authen.mw.js";
import respCode from "../utils/respCode.js";
import env from "../utils/env.js";
import authenModel from "../model/authen.model.js";
import avatarModel from "../model/avatar.model.js";
import { imgStorageService } from "../service/imgStorage.service.js";

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: env.AVT_MAX_SIZE },
});

const checkFileUpload = upload.single("img");

router.post(
  "/update",
  authenMw.stopWhenNotLogon,
  checkFileUpload,
  async (req, res) => {
    // console.log(req.file);
    if (!req.file || !req.file.mimetype.includes("image/")) {
      return res.json({
        status: respCode.INVALID_DATA,
        message: respCode.MSG_INVALID_DATA,
      });
    }
    if (req.file.size > env.AVT_MAX_SIZE) {
      return res.json({
        status: respCode.REACH_LIMIT_SIZE,
        message: respCode.AVATAR.REACH_MAX_LIMIT_SIZE,
      });
    }

    const ownerId = authenModel.getUidFromReq(req);
    const { code, data } = await avatarModel.updateAvt(
      ownerId,
      req.file.originalname,
      req.file.buffer,
      req.file.mimetype
    );
    switch (code) {
      case avatarModel.SUCCESS:
        return res.json({
          status: respCode.SUCCESS,
          data,
        });
      default:
        return res.json({
          status: respCode.INTERNAL_ERR,
          message: respCode.MSG_INTERNAL_ERR,
        });
    }
  }
);

router.post("/remove", authenMw.stopWhenNotLogon, async (req, res) => {
  const ownerId = authenModel.getUidFromReq(req);
  const user = await avatarModel.getAvtByUid(ownerId);
  console.log(user);
  if (!user || !user.avt || user.avt === null) {
    return res.json({
      status: respCode.NOT_FOUND,
      message: respCode.MSG_NOT_FOUND,
    });
  }
  avatarModel.removeAvt(ownerId);
  return res.json({
    status: respCode.SUCCESS,
  });
});

export default router;
