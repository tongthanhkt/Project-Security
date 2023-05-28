/* eslint-disable no-console */
/* eslint-disable import/extensions */
/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
import express from "express";
import authenMw from "../middleware/authen.mw.js";
import authenModel from "../model/authen.model.js";
import userCodeModel from "../model/userCode.model.js";
import { runCodeService } from "../service/runCode.service.js";
import {
  DEFAULT_N_RETRY,
  DEFAULT_SLEEP_MS,
  JUDGE_STATUS,
} from "../utils/judge.constant.js";
import numberUtils from "../utils/numberUtils.js";
import respCode from "../utils/respCode.js";
import validator from "../utils/validator.js";
const router = express.Router();

function buildTestCasesResultFromMap(
  errMap,
  resultMap,
  runIdTestCaseMap,
  runIdSubmissionIdMap
) {
  const testCases = [];
  const errIds = Array.from(errMap.keys());
  const successIds = Array.from(resultMap.keys());
  errIds.forEach((runId) => {
    const testCaseResult = errMap.get(runId);
    testCases.push({
      _id: runIdSubmissionIdMap.get(runId),
      testCaseId: runIdTestCaseMap.get(runId),
      runId,
      status: numberUtils.toNum(testCaseResult.status.id),
    });
  });

  successIds.forEach((runId) => {
    const testCaseResult = resultMap.get(runId);
    testCases.push({
      _id: runIdSubmissionIdMap.get(runId),
      testCaseId: runIdTestCaseMap.get(runId),
      runId,
      status: numberUtils.toNum(testCaseResult.status.id),
    });
  });
  return testCases;
}

async function getResultOfUndoneTestCases(
  testCasesResult,
  ownerId,
  submissionId
) {
  const result = [];
  const runIdIndexMap = new Map();
  const runIds = [];
  const runIdTestCaseMap = new Map();
  const runIdSubmissionIdMap = new Map();
  for (let i = 0; i < testCasesResult.length; i++) {
    const testCaseRes = testCasesResult[i];
    if (
      testCaseRes.status === JUDGE_STATUS.CUSTOM_ERR_NOT_DONE ||
      testCaseRes.status === JUDGE_STATUS.IN_QUEUE ||
      testCaseRes.status === JUDGE_STATUS.PROCESSING
    ) {
      runIdIndexMap.set(testCaseRes.runId, i);
      runIds.push(testCaseRes.runId);
      runIdSubmissionIdMap.set(testCaseRes.runId, testCaseRes._id);
      runIdTestCaseMap.set(testCaseRes.runId, testCaseRes.testCaseId);
    }
    result.push(testCaseRes);
  }

  const { errMap, resultMap } = await runCodeService.getResultSubmissions(
    runIds,
    DEFAULT_SLEEP_MS,
    DEFAULT_N_RETRY
  );

  const testCaseList = buildTestCasesResultFromMap(
    errMap,
    resultMap,
    runIdTestCaseMap,
    runIdSubmissionIdMap
  );
  testCaseList.forEach((eachTestCase) => {
    result[runIdIndexMap.get(eachTestCase.runId)] = eachTestCase;
  });
  // async save submission results to db
  userCodeModel.updateTestCaseArrResult(submissionId, ownerId, result);
  return result;
}

router.get("/coding", authenMw.stopWhenNotLogon, async (req, res) => {
  const { lessonId, exerciseId, page, limit, isDesc } = req.query;
  if (
    !validator.isValidStr(lessonId) ||
    !validator.isValidStr(exerciseId) ||
    !numberUtils.isNumberic(page) ||
    !numberUtils.isNumberic(limit) ||
    numberUtils.toNum(page) < 0 ||
    numberUtils.toNum(limit) <= 0 ||
    !numberUtils.isNumberic(isDesc) ||
    (numberUtils.toNum(isDesc) !== 0 && numberUtils.toNum(isDesc) !== 1)
  ) {
    return res.json({
      status: respCode.INVALID_DATA,
      message: respCode.MSG_INVALID_DATA,
    });
  }

  const ownerId = authenModel.getUidFromReq(req);
  const userCodePaging = await userCodeModel.getMore(
    {
      student: ownerId,
      coding_exercise: exerciseId,
      lesson: lessonId,
    },
    numberUtils.toNum(page),
    numberUtils.toNum(limit),
    "_id src_code langId ts test_cases._id test_cases.testCaseId test_cases.status",
    { ts: numberUtils.toNum(isDesc) === 1 ? "desc" : "asc" }
  );
  return res.json({
    status: respCode.SUCCESS,
    data: userCodePaging,
  });
});

router.get(
  "/coding-submission-info",
  authenMw.stopWhenNotLogon,
  async (req, res) => {
    const { submissionId } = req.query;
    if (!validator.isValidStr(submissionId)) {
      return res.json({
        status: respCode.INVALID_DATA,
        message: respCode.MSG_INVALID_DATA,
      });
    }
    const ownerId = authenModel.getUidFromReq(req);

    const userCodeRet = await userCodeModel.findOneBy(
      { _id: submissionId, student: ownerId },
      "_id src_code langId ts test_cases"
    );
    if (!userCodeRet) {
      return res.json({
        status: respCode.SUCCESS,
        data: null,
      });
    }

    const result = {
      _id: userCodeRet._id,
      src_code: userCodeRet.src_code,
      langId: userCodeRet.langId,
      ts: userCodeRet.ts,
      test_cases: await getResultOfUndoneTestCases(
        userCodeRet.test_cases,
        ownerId,
        submissionId
      ),
    };
    return res.json({
      status: respCode.SUCCESS,
      data: result,
    });
  }
);

export default router;
