/* eslint-disable no-console */
/* eslint-disable import/extensions */
/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
import express from "express";
import authenMw from "../middleware/authen.mw.js";
import authenModel from "../model/authen.model.js";
import codingExerciseModel from "../model/codingExercise.model.js";
import codingTemplateModel from "../model/codingTemplate.model.js";
import courseModel from "../model/course.model.js";
import lessonModel from "../model/lesson.model.js";
import userModel from "../model/user.model.js";
import { ROLE } from "../utils/database.js";
import numberUtils from "../utils/numberUtils.js";
import respCode from "../utils/respCode.js";
import validator from "../utils/validator.js";

const router = express.Router();

async function checkLessonExistAndTutorAssigned(
  ownerId,
  lessonId,
  exerciseId,
  res
) {
  const lesson = await lessonModel.findOneBy(
    { _id: lessonId, exercises: { $in: [exerciseId] } },
    "_id course"
  );
  if (!lesson) {
    res.json({
      status: respCode.NOT_FOUND,
      message: respCode.MSG_NOT_FOUND,
    });
    return false;
  }

  const user = await userModel.getRole(ownerId);
  if (user.role === ROLE.ADMIN) {
    return true;
  }
  const isAssigned = await courseModel.isTutorAssigned(ownerId, lesson.course);
  if (!isAssigned) {
    res.json({
      status: respCode.NOT_FOUND,
      message: respCode.MSG_NOT_FOUND,
    });
    return false;
  }
  return true;
}

router.get("/info", authenMw.stopWhenNotLogon, async (req, res) => {
  const { exerciseId, lessonId, langId } = req.query;
  if (
    !validator.isValidStr(exerciseId) ||
    !validator.isValidStr(lessonId) ||
    !numberUtils.isNumberic(langId) ||
    !codingExerciseModel.isValidLangId(numberUtils.toNum(langId))
  ) {
    return res.json({
      status: respCode.INVALID_DATA,
      message: respCode.MSG_INVALID_DATA,
    });
  }

  const result = await codingTemplateModel.findOneBy({
    lesson: lessonId,
    coding_exercise: exerciseId,
    langId: numberUtils.toNum(langId),
  });
  return res.json({
    status: respCode.SUCCESS,
    data: result,
  });
});

router.post(
  "/create",
  authenMw.stopWhenNotLogon,
  authenMw.stopWhenNotAdminOrTA,
  async (req, res) => {
    const { template, exerciseId, lessonId, langId } = req.body;
    if (
      !validator.isValidStr(template) ||
      !validator.isValidStr(exerciseId) ||
      !validator.isValidStr(lessonId) ||
      !numberUtils.isNumberic(langId) ||
      !codingExerciseModel.isValidLangId(numberUtils.toNum(langId))
    ) {
      return res.json({
        status: respCode.INVALID_DATA,
        message: respCode.MSG_INVALID_DATA,
      });
    }

    const ownerId = authenModel.getUidFromReq(req);
    if (
      !(await checkLessonExistAndTutorAssigned(
        ownerId,
        lessonId,
        exerciseId,
        res
      ))
    ) {
      return;
    }

    const oldCodingTemplate = await codingTemplateModel.findOneBy({
      lesson: lessonId,
      coding_exercise: exerciseId,
      langId: numberUtils.toNum(langId),
    });
    if (oldCodingTemplate) {
      return res.json({
        status: respCode.EXISTED,
        message: respCode.MSG_EXISTED,
      });
    }

    const codingExer = await codingExerciseModel.findOneBy(
      { _id: exerciseId },
      "_id"
    );
    if (!codingExer) {
      return res.json({
        status: respCode.NOT_FOUND,
        message: respCode.MSG_NOT_FOUND,
      });
    }

    const result = await codingTemplateModel.create(
      ownerId,
      lessonId,
      numberUtils.toNum(langId),
      exerciseId,
      template
    );
    if (!result) {
      return res.json({
        status: respCode.INTERNAL_ERR,
        message: respCode.MSG_INTERNAL_ERR,
      });
    }
    return res.json({
      status: respCode.SUCCESS,
      data: result,
    });
  }
);

router.post(
  "/remove",
  authenMw.stopWhenNotLogon,
  authenMw.stopWhenNotAdminOrTA,
  async (req, res) => {
    const { templateId, exerciseId, lessonId } = req.body;
    if (
      !validator.isValidStr(templateId) ||
      !validator.isValidStr(exerciseId) ||
      !validator.isValidStr(lessonId)
    ) {
      return res.json({
        status: respCode.INVALID_DATA,
        message: respCode.MSG_INVALID_DATA,
      });
    }

    const ownerId = authenModel.getUidFromReq(req);
    if (
      !(await checkLessonExistAndTutorAssigned(
        ownerId,
        lessonId,
        exerciseId,
        res
      ))
    ) {
      return;
    }

    const { deletedCount } = await codingTemplateModel.delOne({
      _id: templateId,
      lesson: lessonId,
      coding_exercise: exerciseId,
    });
    if (deletedCount === 0) {
      return res.json({
        status: respCode.NOT_FOUND,
        message: respCode.MSG_NOT_FOUND,
      });
    }
    return res.json({
      status: respCode.SUCCESS,
    });
  }
);

export default router;
