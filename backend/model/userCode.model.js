import UserCode from "../schemas/userCodeSchema.js";
import { DEFAULT_LIMIT } from "../utils/database.js";
import { JUDGE_STATUS } from "../utils/judge.constant.js";
import numberUtils from "../utils/numberUtils.js";

export default {
  async findOneBy(conditions, selections) {
    const ret = await UserCode.findOne(conditions).select(selections).exec();
    return ret;
  },

  async getMore(
    conditions,
    page = 0,
    limit = DEFAULT_LIMIT,
    selections = "_id",
    sort = { _id: -1 }
  ) {
    if (page < 0 || limit <= 0) {
      return null;
    }
    const userCodings = await UserCode.paginate(conditions, {
      page,
      limit,
      select: selections,
      sort,
    });
    return userCodings;
  },

  async save(userCode) {
    try {
      const ret = await userCode.save();
      return ret;
    } catch (err) {
      console.log(err.code);
    }
    return null;
  },

  async updateOne(conditions, updates) {
    const ret = await UserCode.updateOne(conditions, updates);
    return ret;
  },

  async updateTestCaseArrResult(submissionId, ownerId, testCases) {
    const ret = await this.updateOne(
      { _id: submissionId, student: ownerId },
      {
        test_cases: testCases,
      }
    );
    return ret;
  },

  async getUndoneRunIdsByStudentId(studentId) {
    const result = await UserCode.aggregate([
      {
        $unwind: {
          path: "$test_cases",
        },
      },
      {
        $match: {
          student: studentId,
          "test_cases.status": {
            $in: [
              JUDGE_STATUS.CUSTOM_ERR_NOT_DONE,
              JUDGE_STATUS.IN_QUEUE,
              JUDGE_STATUS.PROCESSING,
            ],
          },
        },
      },
      { $sort: { ts: -1 } },
      {
        $project: {
          "test_cases.runId": 1,
          ts: 1,
        },
      },
    ]);
    return result;
  },

  async updateStatusByMap(studentId, runIdTestCaseResultMap, isUpdateUndone) {
    const result = [];
    const resRunIds = Array.from(runIdTestCaseResultMap.keys());
    for (let i = 0; i < resRunIds.length; i++) {
      const runId = resRunIds[i];
      const testCaseResult = runIdTestCaseResultMap.get(runId);
      if (
        numberUtils.toNum(testCaseResult.status.id) ===
          JUDGE_STATUS.CUSTOM_ERR_NOT_DONE &&
        !isUpdateUndone
      ) {
        continue;
      }

      result.push(
        this.updateSubmissionStatus({
          studentId,
          runId,
          status: numberUtils.toNum(testCaseResult.status.id),
        })
      );
    }
    return Promise.all(result);
  },

  async multiUpdateSubmissionStatus(studentId, errMap, resultMap) {
    await this.updateStatusByMap(studentId, errMap, false);
    await this.updateStatusByMap(studentId, resultMap, false);
  },

  async updateOne(conditions, updates) {
    const res = await UserCode.updateOne(conditions, updates).exec();
    // {
    //   acknowledged: Boolean,
    //   modifiedCount: Number,
    //   upsertedId: null,
    //   upsertedCount: Number,
    //   matchedCount: Number
    // }
    return res;
  },

  async updateSubmissionStatus({ studentId, runId, status }) {
    return await this.updateOne(
      {
        student: studentId,
        test_cases: {
          $elemMatch: { runId: runId },
        },
      },
      {
        $set: {
          "test_cases.$.status": status,
        },
      }
    );
  },
};
