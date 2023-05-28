/* eslint-disable no-console */
/* eslint-disable import/extensions */
/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
import express from "express";
import authenMw from "../middleware/authen.mw.js";
import authenModel from "../model/authen.model.js";
import codingExerciseModel from "../model/codingExercise.model.js";
import lessonModel from "../model/lesson.model.js";
import testCaseModel from "../model/testCase.model.js";
import userCodeModel from "../model/userCode.model.js";
import codingRatelimiter from "../ratelimiter/coding.ratelimiter.js";
import UserCode from "../schemas/userCodeSchema.js";
import { runCodeService } from "../service/runCode.service.js";
import { getNewObjectId } from "../utils/database.js";
import {
  DEFAULT_N_RETRY,
  DEFAULT_SLEEP_MS,
  JUDGE_STATUS,
} from "../utils/judge.constant.js";
import numberUtils from "../utils/numberUtils.js";
import respCode from "../utils/respCode.js";
import timeUtils from "../utils/timeUtils.js";
import validator from "../utils/validator.js";

const router = express.Router();

function buildTestCaseNonInfo({
  testCaseId,
  runId,
  statusId = JUDGE_STATUS.CUSTOM_ERR_NOT_DONE,
}) {
  return {
    _id: getNewObjectId().toString(),
    testCaseId,
    runId,
    status: statusId,
  };
}

function buildTestCaseNonInfoFromMap(
  errMap,
  resultMap,
  runIdTestCaseMap,
  testCaseIds
) {
  const testCases = [];
  const errIds = Array.from(errMap.keys());
  const successIds = Array.from(resultMap.keys());
  errIds.forEach((runId) => {
    const testCaseResult = errMap.get(runId);
    testCases.push(
      buildTestCaseNonInfo({
        testCaseId: runIdTestCaseMap.get(runId),
        runId,
        statusId: numberUtils.toNum(testCaseResult.status.id),
      })
    );
  });
  successIds.forEach((runId) => {
    const testCaseResult = resultMap.get(runId);
    if (
      numberUtils.toNum(testCaseResult.status.id) ===
      JUDGE_STATUS.CUSTOM_ERR_NOT_DONE
    ) {
      testCases.push(
        buildTestCaseNonInfo({
          testCaseId: runIdTestCaseMap.get(runId),
          runId,
        })
      );
    } else {
      testCases.push(
        buildTestCaseNonInfo({
          testCaseId: runIdTestCaseMap.get(runId),
          runId,
          statusId: numberUtils.toNum(testCaseResult.status.id),
        })
      );
    }
  });
  return rearrangeTestCaseResOrder(testCases, testCaseIds);
}

function rearrangeTestCaseResOrder(testCasesRes, oriTestCaseIds) {
  const result = [];
  for (let i = 0; i < oriTestCaseIds.length; i++) {
    const oriTestCaseId = oriTestCaseIds[i];
    const index = testCasesRes.findIndex(({ testCaseId }) => {
      return testCaseId === oriTestCaseId;
    });
    if (index !== -1) {
      result.push(testCasesRes[index]);
    }
  }
  return result;
}

router.post(
  "/scoring",
  authenMw.stopWhenNotLogon,
  authenMw.stopWhenNotStudent,
  async (req, res) => {
    const { src_code, langId, lessonId, exerciseId } = req.body;
    if (
      !validator.isValidStr(src_code) ||
      !numberUtils.isNumberic(langId) ||
      !validator.isValidStr(lessonId) ||
      !validator.isValidStr(exerciseId) ||
      !codingExerciseModel.isValidLangId(numberUtils.toNum(langId))
    ) {
      return res.json({
        status: respCode.INVALID_DATA,
        message: respCode.MSG_INVALID_DATA,
      });
    }

    const codingExerPaging = await codingExerciseModel.getMore(
      { _id: exerciseId },
      0,
      1,
      "_id testCases wall_time_limit memory_limit max_file_size enable_network"
    );

    if (
      codingExerPaging === null ||
      codingExerPaging.docs.length === 0 ||
      !(await lessonModel.isContainExercise(lessonId, exerciseId))
    ) {
      return res.json({
        status: respCode.NOT_FOUND,
        message: respCode.MSG_NOT_FOUND,
      });
    }

    const testCaseIds = [...codingExerPaging.docs[0].testCases];
    const testCases = await testCaseModel.multiGetFilterToListNotNull(
      testCaseIds,
      "_id outputFileName out stdin cmd_line_arg inputFile inputFileName"
    );
    if (testCases.length === 0) {
      return res.json({
        status: respCode.INTERNAL_ERR,
        message: respCode.MSG_INTERNAL_ERR,
      });
    }

    const ownerId = authenModel.getUidFromReq(req);
    if (!(await codingRatelimiter.canSubmitCode(ownerId))) {
      return res.json({
        status: respCode.RETRY_LATER,
        message: respCode.RUN_CODE.ANOTHER_RUNNING_SUBMISSION,
      });
    }

    const runIdTestCaseMap = await runCodeService.runCodeSubmissions(
      testCases,
      src_code,
      numberUtils.toNum(langId),
      {
        enable_network: codingExerPaging.docs[0].enable_network,
        max_file_size: codingExerPaging.docs[0].max_file_size,
        memory_limit: codingExerPaging.docs[0].memory_limit,
        wall_time_limit: codingExerPaging.docs[0].wall_time_limit,
      }
    );
    await timeUtils.sleep(1000);
    const runIds = Array.from(runIdTestCaseMap.keys());
    const { errMap, resultMap } = await runCodeService.getResultSubmissions(
      runIds,
      DEFAULT_SLEEP_MS,
      DEFAULT_N_RETRY
    );

    const testCasesNonInfo = buildTestCaseNonInfoFromMap(
      errMap,
      resultMap,
      runIdTestCaseMap,
      testCaseIds
    );
    // async save to db
    const _id = getNewObjectId().toString();
    const result = {
      _id,
      coding_exercise: exerciseId,
      langId: numberUtils.toNum(langId),
      lesson: lessonId,
      src_code,
      ts: timeUtils.getCurrentTs(),
      student: ownerId,
      test_cases: testCasesNonInfo,
    };
    userCodeModel.save(new UserCode(result));
    return res.json({
      status: respCode.SUCCESS,
      data: result,
    });
  }
);

export default router;
