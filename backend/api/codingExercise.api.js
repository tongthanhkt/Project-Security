/* eslint-disable no-console */
/* eslint-disable import/extensions */
/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
import express from "express";
import authenMw from "../middleware/authen.mw.js";
import authenModel from "../model/authen.model.js";
import codingExerciseModel from "../model/codingExercise.model.js";
import exerciseModel from "../model/exercise.model.js";
import lastRunCodeModel from "../model/lastRunCode.model.js";
import lessonModel from "../model/lesson.model.js";
import testCaseModel from "../model/testCase.model.js";
import codingRatelimiter from "../ratelimiter/coding.ratelimiter.js";
import { runCodeService } from "../service/runCode.service.js";
import { getNewObjectId } from "../utils/database.js";
import decodeUtils from "../utils/decodeUtils.js";
import {
  DEFAULT_CONSTRAINT,
  DEFAULT_N_RETRY,
  DEFAULT_SLEEP_MS,
  JUDGE_STATUS,
  LIMIT_MAX_CONSTRAINT,
} from "../utils/judge.constant.js";
import numberUtils from "../utils/numberUtils.js";
import respCode from "../utils/respCode.js";
import timeUtils from "../utils/timeUtils.js";
import validator from "../utils/validator.js";

const router = express.Router();

const MIN_MEMORY_KB = DEFAULT_CONSTRAINT.memory_limit;
const MIN_FILE_KB = DEFAULT_CONSTRAINT.max_file_size;
const MIN_TIME_SECOND = DEFAULT_CONSTRAINT.wall_time_limit;

function buildTestCaseResult({
  _id,
  testCaseId,
  runId,
  out = null,
  file_output = null,
  memory = -1,
  stderr = null,
  compile_output = null,
  time = -1,
  wall_time = -1,
  exit_code = -1,
  statusId = JUDGE_STATUS.CUSTOM_ERR_NOT_DONE,
}) {
  return {
    _id: _id ? _id : getNewObjectId().toString(),
    testCaseId,
    runId,
    out,
    file_output,
    memory,
    stderr,
    compile_output,
    time,
    wall_time,
    exit_code,
    statusId,
  };
}

function buildTestCasesResultFromMap({
  errMap,
  resultMap,
  runIdTestCaseMap,
  runIdSubmissionIdMap = null,
  testCaseIds,
}) {
  const testCases = [];
  const errIds = Array.from(errMap.keys());
  const successIds = Array.from(resultMap.keys());
  errIds.forEach((runId) => {
    const testCaseResult = errMap.get(runId);

    // console.log(testCaseResult);
    testCases.push(
      buildTestCaseResult({
        _id: runIdSubmissionIdMap ? runIdSubmissionIdMap.get(runId) : null,
        testCaseId: runIdTestCaseMap.get(runId),
        runId,
        out: testCaseResult.stdout,
        file_output: testCaseResult.file_output,
        memory: testCaseResult.memory,
        stderr: testCaseResult.stderr,
        compile_output: testCaseResult.compile_output,
        time: testCaseResult.time
          ? numberUtils.toFloat(testCaseResult.time)
          : null,
        wall_time: testCaseResult.wall_time
          ? numberUtils.toFloat(testCaseResult.wall_time)
          : null,
        exit_code: testCaseResult.exit_code,
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
        buildTestCaseResult({
          _id: runIdSubmissionIdMap ? runIdSubmissionIdMap.get(runId) : null,
          testCaseId: runIdTestCaseMap.get(runId),
          runId,
        })
      );
    } else {
      testCases.push(
        buildTestCaseResult({
          _id: runIdSubmissionIdMap ? runIdSubmissionIdMap.get(runId) : null,
          testCaseId: runIdTestCaseMap.get(runId),
          runId,
          out: testCaseResult.stdout,
          file_output: testCaseResult.file_output,
          memory: testCaseResult.memory,
          stderr: testCaseResult.stderr,
          compile_output: testCaseResult.compile_output,
          time: numberUtils.toFloat(testCaseResult.time),
          wall_time: numberUtils.toFloat(testCaseResult.wall_time),
          exit_code: testCaseResult.exit_code,
          statusId: numberUtils.toFloat(testCaseResult.status.id),
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

async function getUndoneTestCasesResult(
  testCasesResult,
  ownerId,
  lessonId,
  exerciseId
) {
  const result = [];
  const runIdIndexMap = new Map();
  const runIds = [];
  const runIdTestCaseMap = new Map();
  const runIdSubmissionIdMap = new Map();
  const testCaseIds = [];
  for (let i = 0; i < testCasesResult.length; i++) {
    const testCaseRes = testCasesResult[i];
    if (
      testCaseRes.statusId === JUDGE_STATUS.CUSTOM_ERR_NOT_DONE ||
      testCaseRes.statusId === JUDGE_STATUS.IN_QUEUE ||
      testCaseRes.statusId === JUDGE_STATUS.PROCESSING
    ) {
      runIdIndexMap.set(testCaseRes.runId, i);
      runIds.push(testCaseRes.runId);
      runIdSubmissionIdMap.set(testCaseRes.runId, testCaseRes._id);
      runIdTestCaseMap.set(testCaseRes.runId, testCaseRes.testCaseId);
    }
    testCaseIds.push(testCaseRes.testCaseId);
    result.push(testCaseRes);
  }

  const { errMap, resultMap } = await runCodeService.getResultSubmissions(
    runIds,
    DEFAULT_SLEEP_MS,
    DEFAULT_N_RETRY
  );

  const testCaseList = buildTestCasesResultFromMap({
    errMap,
    resultMap,
    runIdTestCaseMap,
    runIdSubmissionIdMap,
    testCaseIds,
  });
  testCaseList.forEach((eachTestCase) => {
    result[runIdIndexMap.get(eachTestCase.runId)] = eachTestCase;
  });
  // asynchronous save last run code to db
  const lastRunCode = lastRunCodeModel.updateOrCreateIfNotExist(
    {
      student: ownerId,
      lesson: lessonId,
      coding_exercise: exerciseId,
    },
    {
      testCases: result,
    }
  );
  return result;
}

router.post(
  "/create",
  authenMw.stopWhenNotLogon,
  authenMw.stopWhenNotAdminOrTA,
  async (req, res) => {
    const {
      question,
      examplesArr,
      testCasesArr,
      wall_time_limit,
      memory_limit,
      max_file_size,
      enable_network,
    } = req.body;
    // console.log(typeof enable_network);
    if (
      !question ||
      question.toString().length === 0 ||
      !numberUtils.isNumberic(wall_time_limit) ||
      numberUtils.toNum(wall_time_limit) < MIN_TIME_SECOND ||
      numberUtils.toNum(wall_time_limit) >
        LIMIT_MAX_CONSTRAINT.wall_time_limit ||
      !numberUtils.isNumberic(memory_limit) ||
      numberUtils.toNum(memory_limit) < MIN_MEMORY_KB ||
      numberUtils.toNum(memory_limit) > LIMIT_MAX_CONSTRAINT.memory_limit ||
      !numberUtils.isNumberic(max_file_size) ||
      numberUtils.toNum(max_file_size) < MIN_FILE_KB ||
      numberUtils.toNum(max_file_size) > LIMIT_MAX_CONSTRAINT.max_file_size ||
      typeof enable_network === "undefined"
    ) {
      return res.json({
        status: respCode.INVALID_DATA,
        message: respCode.MSG_INVALID_DATA,
      });
    }

    let examples = null,
      testCases = null;
    try {
      examples = JSON.parse(examplesArr);
      testCases = JSON.parse(testCasesArr);
    } catch (e) {
      console.log(e);
      return res.json({
        status: respCode.INVALID_DATA,
        message: respCode.MSG_INVALID_DATA,
      });
    }
    if (examples.length === 0 || testCases.length === 0) {
      return res.json({
        status: respCode.INVALID_DATA,
        message: respCode.MSG_INVALID_DATA,
      });
    }

    const testCaseSet = new Set();

    for (let i = 0; i < examples.length; i++) {
      if (!validator.isValidStr(examples[i])) {
        return res.json({
          status: respCode.INVALID_DATA,
          message: respCode.MSG_INVALID_DATA,
        });
      }
      testCaseSet.add(examples[i]);
    }

    for (let i = 0; i < testCases.length; i++) {
      if (!validator.isValidStr(testCases[i])) {
        return res.json({
          status: respCode.INVALID_DATA,
          message: respCode.MSG_INVALID_DATA,
        });
      }
      testCaseSet.add(testCases[i]);
    }

    const resultMap = await testCaseModel.multiGet([...testCaseSet], "_id");
    const testCasesList = [...testCaseSet];
    for (let i = 0; i < testCasesList.length; i++) {
      if (!resultMap.get(testCasesList[i])) {
        return res.json({
          status: respCode.NOT_FOUND,
          message: respCode.MSG_NOT_FOUND,
        });
      }
    }

    // console.log(examples);
    // console.log(testCases);
    const result = await exerciseModel.createCodingExercise({
      question,
      examplesArr: examples,
      testCasesArr: testCases,
      wall_time_limit: numberUtils.toNum(wall_time_limit),
      memory_limit: numberUtils.toNum(memory_limit),
      max_file_size: numberUtils.toNum(max_file_size),
      enable_network,
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
    // return res.json({ status: respCode.SUCCESS });
  }
);

router.post("/run", authenMw.stopWhenNotLogon, async (req, res) => {
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
    "_id examples wall_time_limit memory_limit max_file_size enable_network"
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

  const testCaseIds = [...codingExerPaging.docs[0].examples];
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
  if (!(await codingRatelimiter.canRunCode(ownerId))) {
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

  // save last run code to db
  const testCaseResult = buildTestCasesResultFromMap({
    errMap,
    resultMap,
    runIdTestCaseMap,
    testCaseIds,
  });
  const lastRunCode = lastRunCodeModel.updateOrCreateIfNotExist(
    {
      student: ownerId,
      lesson: lessonId,
      coding_exercise: exerciseId,
    },
    {
      student: ownerId,
      lesson: lessonId,
      coding_exercise: exerciseId,
      src_code,
      langId: numberUtils.toNum(langId),
      ts: timeUtils.getCurrentTs(),
      testCases: testCaseResult,
    }
  );

  if (!lastRunCode) {
    return res.json({
      status: respCode.INTERNAL_ERR,
      message: respCode.MSG_INTERNAL_ERR,
    });
  }

  return res.json({
    status: respCode.SUCCESS,
    data: {
      _id: (await lastRunCode)._id,
      testCases: testCaseResult,
    },
  });
});

router.get("/last-run-code", authenMw.stopWhenNotLogon, async (req, res) => {
  const { lessonId, exerciseId, isShortInfo, isWait } = req.query;
  if (
    !validator.isValidStr(lessonId) ||
    !validator.isValidStr(exerciseId) ||
    !numberUtils.isNumberic(isShortInfo) ||
    !numberUtils.isNumberic(isWait) ||
    (numberUtils.toNum(isShortInfo) !== 0 &&
      numberUtils.toNum(isShortInfo) !== 1) ||
    (numberUtils.toNum(isWait) !== 0 && numberUtils.toNum(isWait) !== 1)
  ) {
    return res.json({
      status: respCode.INVALID_DATA,
      message: respCode.MSG_INVALID_DATA,
    });
  }

  let selections = "_id testCases ts";
  if (numberUtils.toNum(isShortInfo) === 0) {
    selections += " src_code langId";
  }

  const ownerId = authenModel.getUidFromReq(req);
  const result = {};
  const lastRunCode = await lastRunCodeModel.findOneBy(
    {
      student: ownerId,
      lesson: lessonId,
      coding_exercise: exerciseId,
    },
    selections
  );
  if (lastRunCode) {
    result._id = lastRunCode._id;
    result.testCases = lastRunCode.testCases;
    result.ts = lastRunCode.ts;
    if (numberUtils.toNum(isShortInfo) !== 1) {
      result.src_code = lastRunCode.src_code;
      result.langId = lastRunCode.langId;
    }

    if (numberUtils.toNum(isWait) === 1) {
      result.testCases = await getUndoneTestCasesResult(
        lastRunCode.testCases,
        ownerId,
        lessonId,
        exerciseId
      );
    }
  }
  return res.json({
    status: respCode.SUCCESS,
    data: result,
  });
});

export default router;
