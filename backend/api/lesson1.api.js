/* eslint-disable no-console */
/* eslint-disable import/extensions */
/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
import express from "express";
import authenMw from "../middleware/authen.mw.js";
import authenModel from "../model/authen.model.js";
import courseModel from "../model/course.model.js";
import lessonModel from "../model/lesson.model.js";
import resourceModel from "../model/resource.model.js";
import Lesson from "../schemas/lessonSchema.js";
import Resource from "../schemas/resourceSchema.js";
import respCode from "../utils/respCode.js";
import RESP from "../utils/respCode.js";
import userModel from "../model/user.model.js";
import validator from "../utils/validator.js";
import exerciseModel from "../model/exercise.model.js";
import UserLesson from "../schemas/userLessonSchema.js";
import topicModel from "../model/topic.model.js";
import { getNewObjectId } from "../utils/database.js";
import userNoteModel from "../model/userNote.model.js";
import UserNoteSchema from "../schemas/userNotesSchema.js";
import { DEFAULT_TIME_IN_SEC, RESOURCE_TYPE } from "../model/resource.model.js";
import userLessonModel from "../model/userLesson.model.js";
const router = express.Router();
router.get("/detail/:id", authenMw.stopWhenNotStudent, async (req, res) => {
  const lessonId = req.params.id;
  const uuid = authenModel.getUidFromReq(req);
  if (!(await lessonModel.isExist(lessonId))) {
    return res.json({
      status: respCode.INVALID_DATA,
      message: respCode.LESSON.INVALID_DATA,
    });
  }
  const lessonInfo = await Lesson.findOne({
    _id: lessonId,
  });
  const lessonInfoObj = lessonInfo.toObject();
  const isCompleted = await userLessonModel.isCompleteLesson(uuid, lessonId);
  console.log(isCompleted);
  lessonInfoObj.isDone = isCompleted;
  let resourcesInfo = await resourceModel.getResourceInLesson(
    lessonInfo.resources
  );
  const resourcesLink = {};
  if (lessonInfo.resources !== null) {
    const thumIdSignedUrlMap = await resourceModel.getSignedUrls(
      lessonInfo.resources,
      DEFAULT_TIME_IN_SEC
    );
    console.log(thumIdSignedUrlMap);
    for (const [key, value] of thumIdSignedUrlMap) {
      resourcesLink[key] = value;
    }
  }

  return res.json({
    status: respCode.SUCCESS,
    data: {
      lessonInfo: lessonInfoObj,
      resourcesInfo: resourcesInfo,
      resourcesLink: resourcesLink,
    },
  });
});
export default router;
