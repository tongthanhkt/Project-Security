import lastRunCodeModel from "../model/lastRunCode.model.js";
import userCodeModel from "../model/userCode.model.js";
import { runCodeService } from "../service/runCode.service.js";
import { JUDGE_STATUS } from "../utils/judge.constant.js";
import timeUtils from "../utils/timeUtils.js";

const TIME_OUT_RATE_LIMIT_MILLIS = 10 * 60 * 1000; // 10m

export default {
  async canRunCode(studentId) {
    const undoneArr = await lastRunCodeModel.getUndoneRunIdsByStudentId(
      studentId
    );
    if (
      (undoneArr &&
        undoneArr.length > 0 &&
        timeUtils.getCurrentTs() - undoneArr[0].ts >=
          TIME_OUT_RATE_LIMIT_MILLIS) ||
      undoneArr.length === 0
    ) {
      return true;
    }
    const runIds = [];
    undoneArr.forEach(({ _id, ts, testCases: { runId } }) => {
      runIds.push(runId);
    });

    const { errMap, resultMap } = await runCodeService.getResultSubmissions(
      runIds,
      0,
      1
    );

    const doneArr = [];
    errMap.forEach((testCaseResult, runId) => {
      if (
        testCaseResult.status.id !== JUDGE_STATUS.CUSTOM_ERR_NOT_DONE &&
        testCaseResult.status.id !== JUDGE_STATUS.IN_QUEUE &&
        testCaseResult.status.id !== JUDGE_STATUS.PROCESSING
      ) {
        doneArr.push(runId);
      }
    });
    resultMap.forEach((testCaseResult, runId) => {
      if (
        testCaseResult.status.id !== JUDGE_STATUS.CUSTOM_ERR_NOT_DONE &&
        testCaseResult.status.id !== JUDGE_STATUS.IN_QUEUE &&
        testCaseResult.status.id !== JUDGE_STATUS.PROCESSING
      ) {
        doneArr.push(runId);
      }
    });
    if (doneArr.length > 0) {
      lastRunCodeModel.multiUpdateSubmissionStatus(
        studentId,
        errMap,
        resultMap
      );
    }

    return doneArr.length === runIds.length;
  },

  async canSubmitCode(studentId) {
    const undoneArr = await userCodeModel.getUndoneRunIdsByStudentId(studentId);
    if (
      (undoneArr &&
        undoneArr.length > 0 &&
        timeUtils.getCurrentTs() - undoneArr[0].ts >=
          TIME_OUT_RATE_LIMIT_MILLIS) ||
      undoneArr.length === 0
    ) {
      return true;
    }

    const runIds = [];
    undoneArr.forEach(({ _id, ts, test_cases: { runId } }) => {
      runIds.push(runId);
    });

    const { errMap, resultMap } = await runCodeService.getResultSubmissions(
      runIds,
      0,
      1
    );

    const doneArr = [];
    errMap.forEach((testCaseResult, runId) => {
      if (
        testCaseResult.status.id !== JUDGE_STATUS.CUSTOM_ERR_NOT_DONE &&
        testCaseResult.status.id !== JUDGE_STATUS.IN_QUEUE &&
        testCaseResult.status.id !== JUDGE_STATUS.PROCESSING
      ) {
        doneArr.push(runId);
      }
    });
    resultMap.forEach((testCaseResult, runId) => {
      if (
        testCaseResult.status.id !== JUDGE_STATUS.CUSTOM_ERR_NOT_DONE &&
        testCaseResult.status.id !== JUDGE_STATUS.IN_QUEUE &&
        testCaseResult.status.id !== JUDGE_STATUS.PROCESSING
      ) {
        doneArr.push(runId);
      }
    });
    if (doneArr.length > 0) {
      userCodeModel.multiUpdateSubmissionStatus(studentId, errMap, resultMap);
    }

    return doneArr.length === runIds.length;
  },
};
