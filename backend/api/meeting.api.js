import express from "express";
import AuthMW from "../middleware/authen.mw.js";
import AuthenModel from "../model/authen.model.js";
import UserModel from "../model/user.model.js";
import NumberUtils from "../utils/numberUtils.js";
import TimeUtils from "../utils/timeUtils.js";
import RESP from "../utils/respCode.js";
import meetingModel from "../model/meeting.model.js";

const router = express.Router();

router.post("/create", AuthMW.stopWhenNotLogon, async (req, res) => {
  const { startTs, endTs } = req.body;
  const curTs = TimeUtils.getCurrentTs();
  // console.log(1, !startTs && startTs !== 0);
  // console.log(2, startTs.toString().trim().length === 0);
  // console.log(3, !endTs);
  // console.log(4, endTs.toString().trim().length === 0);
  // console.log(5, !NumberUtils.isNumberic(startTs));
  // console.log(6, !NumberUtils.isNumberic(endTs));
  // console.log(7, parseInt(startTs) < curTs && parseInt(startTs) !== 0);
  // console.log(8, parseInt(endTs) <= curTs);
  // console.log(9, parseInt(endTs) <= parseInt(startTs));
  if (
    (!startTs && startTs !== 0) ||
    startTs.toString().trim().length === 0 ||
    !endTs ||
    endTs.toString().trim().length === 0 ||
    !NumberUtils.isNumberic(startTs) ||
    !NumberUtils.isNumberic(endTs) ||
    (parseInt(startTs) < curTs && parseInt(startTs) !== 0) ||
    parseInt(endTs) <= curTs ||
    parseInt(endTs) <= parseInt(startTs)
  ) {
    return res.json({
      status: RESP.INVALID_DATA,
      message: RESP.MSG_INVALID_DATA,
    });
  }
  const ownerId = AuthenModel.getUidFromReq(req);
  const meeting = await meetingModel.create({
    userId: ownerId,
    startTs: parseInt(startTs),
    endTs: parseInt(endTs),
  });
  if (!meeting) {
    return res.json({
      status: RESP.INTERNAL_ERR,
      message: RESP.MSG_INTERNAL_ERR,
    });
  }

  const result = {
    status: RESP.SUCCESS,
    data: {
      id: meeting._id,
      ownerId: meeting.ownerId,
      startTs: meeting.startTs,
      endTs: meeting.endTs,
      members: meeting.members,
    },
  };
  if (parseInt(startTs) === 0) {
    const userShortInfos = await UserModel.getGeneralInfoByIds([ownerId], {
      name: 1,
    });
    result.data.token = meetingModel.genJWT({
      uid: ownerId,
      name: userShortInfos[0].name,
      roomId: meeting._id,
      isOwner: meeting.ownerId === ownerId,
    });
  }
  return res.json(result);
});

router.post("/join", AuthMW.stopWhenNotLogon, async (req, res) => {
  const { meetingId } = req.body;
  if (!meetingId || meetingId.toString().trim().length === 0) {
    return res.json({
      status: RESP.INVALID_DATA,
      message: RESP.MSG_INVALID_DATA,
    });
  }

  const ownerId = AuthenModel.getUidFromReq(req);
  const meeting = await meetingModel.findById(meetingId);

  if (
    !meeting ||
    (meeting.members !== null && meeting.members.indexOf(ownerId) === -1)
  ) {
    return res.json({
      status: RESP.NOT_FOUND,
      message: RESP.MSG_NOT_FOUND,
    });
  }

  const curTs = TimeUtils.getCurrentTs();
  if (meeting.endTs <= curTs) {
    return res.json({
      status: RESP.JITSI_EXPIRED_ROOM,
      message: RESP.JITSI_MSG_EXPIRED_ROOM,
    });
  }

  const userShortInfos = await UserModel.getGeneralInfoByIds([ownerId], {
    name: 1,
  });
  if (!userShortInfos || userShortInfos.length === 0) {
    return res.json({
      status: RESP.INTERNAL_ERR,
      message: RESP.MSG_INTERNAL_ERR,
    });
  }
  const token = meetingModel.genJWT({
    uid: ownerId,
    name: userShortInfos[0].name,
    roomId: meeting._id,
    isOwner: meeting.ownerId === ownerId,
  });
  return res.json({
    status: RESP.SUCCESS,
    data: {
      token,
      endTs: meeting.endTs,
    },
  });
});

router.post("/extend-time", AuthMW.stopWhenNotLogon, async (req, res) => {
  const { extendTs, meetingId } = req.body;
  if (
    !extendTs ||
    extendTs.toString().trim().length === 0 ||
    !NumberUtils.isNumberic(extendTs) ||
    !meetingId ||
    meetingId.toString().trim().length === 0
  ) {
    return res.json({
      status: RESP.INVALID_DATA,
      message: RESP.MSG_INVALID_DATA,
    });
  }

  const ownerId = AuthenModel.getUidFromReq(req);
  const meeting = await meetingModel.findById(meetingId);
  if (!meeting || meeting.ownerId !== ownerId) {
    return res.json({
      status: RESP.NOT_FOUND,
      message: RESP.MSG_NOT_FOUND,
    });
  }

  const curTs = TimeUtils.getCurrentTs();
  if (meeting.endTs <= curTs) {
    return res.json({
      status: RESP.JITSI_EXPIRED_ROOM,
      message: RESP.JITSI_MSG_EXPIRED_ROOM,
    });
  }

  const newEndTs = meeting.endTs + parseInt(extendTs);
  meeting.endTs += parseInt(extendTs);
  meetingModel.save(meeting);
  return res.json({
    status: RESP.SUCCESS,
    data: {
      newEndTs,
    },
  });
});

export default router;
