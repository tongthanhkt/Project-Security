/* eslint-disable no-console */
/* eslint-disable import/extensions */
/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
import express from "express";
import authenMw from "../middleware/authen.mw.js";
import authenModel from "../model/authen.model.js";
import codingExerciseModel from "../model/codingExercise.model.js";
import codingTemplateModel from "../model/codingTemplate.model.js";
import exerciseModel, { EXERCISE_TYPE } from "../model/exercise.model.js";
import lessonModel from "../model/lesson.model.js";
import quizModel from "../model/quiz.model.js";
import testCaseModel from "../model/testCase.model.js";
import userModel from "../model/user.model.js";
import userQuizModel from "../model/userQuiz.model.js";
import { ROLE } from "../utils/database.js";
import numberUtils from "../utils/numberUtils.js";
import respCode from "../utils/respCode.js";
import validator from "../utils/validator.js";

const router = express.Router();

function formatCodingExerAndTestCase(
  exerciseInfo,
  codingExerInfo,
  testCasesInfoMap
) {
  const examples = [];
  codingExerInfo.examples.forEach((exampleId) => {
    if (testCasesInfoMap.get(exampleId)) {
      const testCase = testCasesInfoMap.get(exampleId);
      examples.push(testCase);
    }
  });

  const result = {
    ...exerciseInfo,
    examples,
    wall_time_limit: codingExerInfo.wall_time_limit,
    memory_limit: codingExerInfo.memory_limit,
    max_file_size: codingExerInfo.max_file_size,
    enable_network: codingExerInfo.enable_network,
  };
  return result;
}

function formatToResponse({
  resultArr,
  quizInfoMap,
  codingInfoMap,
  testCasesInfoMap,
  codingExerIdLangIdMap,
  quizIdCompletedStatusMap,
}) {
  const result = [];
  for (let i = 0; i < resultArr.length; i++) {
    switch (resultArr[i].type) {
      case EXERCISE_TYPE.CODING:
        if (codingInfoMap.get(resultArr[i]._id)) {
          const codingExer = formatCodingExerAndTestCase(
            resultArr[i],
            codingInfoMap.get(resultArr[i]._id),
            testCasesInfoMap
          );
          if (codingExerIdLangIdMap) {
            codingExer.templateLangIds = codingExerIdLangIdMap.get(
              resultArr[i]._id
            );
          }
          result.push(codingExer);
        }
        break;
      case EXERCISE_TYPE.QUIZ:
        if (quizInfoMap.get(resultArr[i]._id)) {
          const quizAns = quizInfoMap.get(resultArr[i]._id);
          const quizInfo = {
            ...resultArr[i],
            answers: quizAns.answers,
          };
          if (quizIdCompletedStatusMap) {
            const isCompleted = quizIdCompletedStatusMap.get(resultArr[i]._id);
            quizInfo.isCompleted = isCompleted ? isCompleted : false;
            if (quizInfo.isCompleted) {
              quizInfo.true_ans = quizInfoMap.get(resultArr[i]._id).true_ans;
            }
          }
          result.push(quizInfo);
        }
        break;
      default:
        break;
    }
  }
  return result;
}

async function getLangIdsByExercisesOfLesson(lessonId, codingExerIds) {
  const resMap = new Map();
  for (let i = 0; i < codingExerIds.length; i++) {
    const langIds = await codingTemplateModel.getLangIdsByLessonAndExer(
      lessonId,
      codingExerIds[i]
    );
    resMap.set(codingExerIds[i], langIds);
  }
  return resMap;
}

router.get("/entire-list", authenMw.stopWhenNotLogon, async (req, res) => {
  const { lessonId, isGetTemplateLangIds, isGetQuizCompletedStatus } =
    req.query;
  if (
    !validator.isValidStr(lessonId) ||
    (isGetTemplateLangIds &&
      (!numberUtils.isNumberic(isGetTemplateLangIds) ||
        (numberUtils.toNum(isGetTemplateLangIds) !== 1 &&
          numberUtils.toNum(isGetTemplateLangIds) !== 0))) ||
    (isGetQuizCompletedStatus &&
      (!numberUtils.isNumberic(isGetQuizCompletedStatus) ||
        (numberUtils.toNum(isGetQuizCompletedStatus) !== 1 &&
          numberUtils.toNum(isGetQuizCompletedStatus) !== 0)))
  ) {
    return res.json({
      status: respCode.INVALID_DATA,
      message: respCode.MSG_INVALID_DATA,
    });
  }
  const ownerId = authenModel.getUidFromReq(req);
  const user = await userModel.getRole(ownerId);
  const lessonExercises = await lessonModel.getExerciseIds(lessonId);
  if (
    !lessonExercises ||
    (!lessonExercises.isVisible &&
      user.role !== ROLE.ADMIN &&
      user.role !== ROLE.TA)
  ) {
    return res.json({
      status: respCode.NOT_FOUND,
      message: respCode.MSG_NOT_FOUND,
    });
  }

  const exerciseIndexMap = new Map();
  const result = [];
  for (let i = 0; i < lessonExercises.exercises.length; i++) {
    exerciseIndexMap.set(lessonExercises.exercises[i], i);
    result.push({ _id: lessonExercises.exercises[i] });
  }

  const exercisesPaging = await exerciseModel.getMore(
    { _id: { $in: lessonExercises.exercises } },
    0,
    lessonExercises.exercises.length,
    "_id type question"
  );

  const quizIds = [];
  const codingExerciseIds = [];
  if (exercisesPaging) {
    exercisesPaging.docs.forEach(({ _id, type, question }) => {
      result[exerciseIndexMap.get(_id)].type = type;
      result[exerciseIndexMap.get(_id)].question = question;
      switch (type) {
        case EXERCISE_TYPE.CODING:
          codingExerciseIds.push(_id);
          break;
        case EXERCISE_TYPE.QUIZ:
          quizIds.push(_id);
          break;
        default:
          break;
      }
    });
  }

  const isQuizCompletedStatus =
    numberUtils.toNum(isGetQuizCompletedStatus) === 1;
  const quizInfoMap = await quizModel.multiGet(
    quizIds,
    !isQuizCompletedStatus ? "answers" : "answers true_ans"
  );
  const codingInfoMap = await codingExerciseModel.multiGet(
    codingExerciseIds,
    "examples wall_time_limit memory_limit max_file_size enable_network"
  );
  const testCaseIdsSet = new Set();
  codingInfoMap.forEach((value, key) => {
    value.examples.forEach((exampleId) => {
      testCaseIdsSet.add(exampleId);
    });
  });

  let codingExerIdLangIdMap = null;
  if (numberUtils.toNum(isGetTemplateLangIds) === 1) {
    codingExerIdLangIdMap = await getLangIdsByExercisesOfLesson(
      lessonId,
      codingExerciseIds
    );
  }

  let quizIdCompletedStatusMap = null;
  if (isQuizCompletedStatus) {
    quizIdCompletedStatusMap = await userQuizModel.multiGetCompletedStatus(
      ownerId,
      quizIds
    );
  }

  const testCasesInfoMap = await testCaseModel.multiGet(
    [...testCaseIdsSet],
    "_id outputFileName out stdin cmd_line_arg inputFile inputFileName"
  );

  return res.json({
    status: respCode.SUCCESS,
    data: formatToResponse({
      resultArr: result,
      quizInfoMap: quizInfoMap,
      codingInfoMap: codingInfoMap,
      testCasesInfoMap: testCasesInfoMap,
      codingExerIdLangIdMap: codingExerIdLangIdMap,
      quizIdCompletedStatusMap: quizIdCompletedStatusMap,
    }),
  });
});

export default router;
