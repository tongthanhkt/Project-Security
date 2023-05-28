import LastRunCode from "../schemas/lastRunCodeSchema.js";
import { getNewObjectId } from "../utils/database.js";
import { JUDGE_STATUS } from "../utils/judge.constant.js";
import numberUtils from "../utils/numberUtils.js";

export default {
  async findOneBy(conditions, selections) {
    const ret = await LastRunCode.findOne(conditions).select(selections).exec();
    return ret;
  },

  async updateOrCreateIfNotExist(conditions, updates) {
    const lastRunCode = await this.findOneBy(conditions, "_id");
    let lastRunCodeId = getNewObjectId().toString();
    if (lastRunCode && lastRunCode._id) {
      lastRunCodeId = lastRunCode._id;
    }
    const result = await LastRunCode.findOneAndUpdate(
      conditions,
      { ...updates, _id: lastRunCodeId },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      }
    );
    return result;
  },

  async getUndoneRunIdsByStudentId(studentId) {
    const result = await LastRunCode.aggregate([
      {
        $unwind: {
          path: "$testCases",
        },
      },
      {
        $match: {
          student: studentId,
          "testCases.statusId": {
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
          "testCases.runId": 1,
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
    }
    return Promise.all(result);
  },

  async multiUpdateSubmissionStatus(studentId, errMap, resultMap) {
    await this.updateStatusByMap(studentId, errMap, false);
    await this.updateStatusByMap(studentId, resultMap, false);
  },

  async updateOne(conditions, updates) {
    const res = await LastRunCode.updateOne(conditions, updates).exec();
    // {
    //   acknowledged: Boolean,
    //   modifiedCount: Number,
    //   upsertedId: null,
    //   upsertedCount: Number,
    //   matchedCount: Number
    // }
    return res;
  },

  async updateSubmissionStatus({
    studentId,
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
  }) {
    return await this.updateOne(
      {
        student: studentId,
        testCases: {
          $elemMatch: { runId: runId },
        },
      },
      {
        $set: {
          "testCases.$.out": out,
          "testCases.$.file_output": file_output,
          "testCases.$.memory": memory,
          "testCases.$.stderr": stderr,
          "testCases.$.compile_output": compile_output,
          "testCases.$.time": time,
          "testCases.$.wall_time": wall_time,
          "testCases.$.statusId": statusId,
          "testCases.$.exit_code": exit_code,
        },
      }
    );
  },
};
