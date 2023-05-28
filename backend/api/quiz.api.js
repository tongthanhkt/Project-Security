/* eslint-disable no-console */
/* eslint-disable import/extensions */
/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
import express from "express";
import authenMw from "../middleware/authen.mw.js";
import authenModel from "../model/authen.model.js";
import exerciseModel from "../model/exercise.model.js";
import lessonModel from "../model/lesson.model.js";
import quizModel from "../model/quiz.model.js";
import userQuizModel from "../model/userQuiz.model.js";
import UserQuiz from "../schemas/userQuizzSchema.js";
import { getNewObjectId } from "../utils/database.js";
import numberUtils from "../utils/numberUtils.js";
import respCode from "../utils/respCode.js";
import timeUtils from "../utils/timeUtils.js";
import validator from "../utils/validator.js";

const router = express.Router();

router.post(
  "/create",
  authenMw.stopWhenNotLogon,
  authenMw.stopWhenNotAdminOrTA,
  async (req, res) => {
    const { question, trueAnsIndex, answers } = req.body;
    if (
      !question ||
      question.toString().length === 0 ||
      !numberUtils.isNumberic(trueAnsIndex)
    ) {
      return res.json({
        status: respCode.INVALID_DATA,
        message: respCode.MSG_INVALID_DATA,
      });
    }

    let answersArr = [];
    try {
      answersArr = JSON.parse(answers);
      answersArr.forEach((answer) => {
        if (answer.toString().length === 0) {
          return res.json({
            status: respCode.INVALID_DATA,
            message: respCode.MSG_INVALID_DATA,
          });
        }
      });

      if (
        numberUtils.toNum(trueAnsIndex) < 0 ||
        numberUtils.toNum(trueAnsIndex) > answersArr.length - 1
      ) {
        return res.json({
          status: respCode.INVALID_DATA,
          message: respCode.MSG_INVALID_DATA,
        });
      }
    } catch (e) {
      return res.json({
        status: respCode.INVALID_DATA,
        message: respCode.MSG_INVALID_DATA,
      });
    }

    const result = await exerciseModel.createQuiz({
      question,
      trueAnsIndex: numberUtils.toNum(trueAnsIndex),
      answersArr,
    });
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
  "/submit-ans",
  authenMw.stopWhenNotLogon,
  authenMw.stopWhenNotStudent,
  async (req, res) => {
    const { lessonId, exerciseId, ansId } = req.body;
    if (
      !validator.isValidStr(lessonId) ||
      !validator.isValidStr(exerciseId) ||
      !validator.isValidStr(ansId)
    ) {
      return res.json({
        status: respCode.INVALID_DATA,
        message: respCode.MSG_INVALID_DATA,
      });
    }

    const lesson = await lessonModel.findOneBy(
      {
        _id: lessonId,
        exercises: { $in: [exerciseId] },
      },
      "isVisible"
    );
    if (!lesson) {
      return res.json({
        status: respCode.NOT_FOUND,
        message: respCode.MSG_NOT_FOUND,
      });
    }

    const quiz = await quizModel.findOneBy(
      {
        _id: exerciseId,
        "answers._id": ansId,
      },
      "true_ans"
    );
    if (!quiz) {
      return res.json({
        status: respCode.NOT_FOUND,
        message: respCode.MSG_NOT_FOUND,
      });
    }

    const ownerId = authenModel.getUidFromReq(req);
    const userQuizBefore = await userQuizModel.findOneBy(
      {
        student: ownerId,
        lesson: lessonId,
        quizz: exerciseId,
      },
      "_id"
    );
    if (userQuizBefore) {
      return res.json({
        status: respCode.EXISTED,
        message: respCode.SUBMIT_QUIZ.EXISTED,
      });
    }

    const result = await userQuizModel.save(
      new UserQuiz({
        _id: getNewObjectId().toString(),
        ans: ansId,
        isTrue: quiz.true_ans === ansId,
        lesson: lessonId,
        quizz: exerciseId,
        student: ownerId,
        ts: timeUtils.getCurrentTs(),
      })
    );

    return res.json({
      status: respCode.SUCCESS,
      data: result,
    });
  }
);

export default router;
