import TestCase from "../schemas/testCasesSchema.js";
import { getNewObjectId } from "../utils/database.js";
import userCodeModel from "./userCode.model.js";

export default {
  async insertMany(testCasesArr) {
    const testCases = [];
    for (let i = 0; i < testCasesArr.length; i++) {
      const _id = getNewObjectId().toString();
      testCases.push(
        new TestCase({
          _id,
          cmd_line_arg: testCasesArr[i].cmd_line_arg,
          inputFile: testCasesArr[i].inputFile,
          inputFileName: testCasesArr[i].inputFileName,
          out: testCasesArr[i].out,
          outputFileName: testCasesArr[i].outputFileName,
          stdin: testCasesArr[i].stdin,
        })
      );
    }

    const result = await TestCase.insertMany(testCases);
    return result;
  },

  async multiGet(testCaseIds, selections) {
    const res = await TestCase.find({ _id: { $in: testCaseIds } })
      .select(selections)
      .exec();
    const mapRes = new Map();
    if (res) {
      for (let i = 0; i < res.length; i++) {
        mapRes.set(res[i]._id, res[i]);
      }
    }
    for (let i = 0; i < testCaseIds.length; i++) {
      if (!mapRes.get(testCaseIds[i])) {
        mapRes.set(testCaseIds[i], null);
      }
    }
    return mapRes;
  },

  async save(testCase) {
    try {
      const ret = await testCase.save();
      return ret;
    } catch (err) {
      console.log(err.code);
    }
    return null;
  },

  async remove(testCaseId) {},

  async multiRemove(testCaseIds) {
    const rmTestCaseIds = [];
    for (let i = 0; i < testCaseIds.length; i++) {
      const userCodingPaging = await userCodeModel.getMore(
        {
          "test_cases._id": { $in: [testCaseIds[i]] },
        },
        0,
        1
      );
      if (userCodingPaging.docs.length === 0) {
        rmTestCaseIds.push(testCaseIds[i]);
      }
    }

    await TestCase.deleteMany({ _id: { $in: rmTestCaseIds } });
    return rmTestCaseIds;
  },

  async multiGetFilterToListNotNull(testCaseIds, selections) {
    const testCaseMap = await this.multiGet(testCaseIds, selections);

    const result = [];
    testCaseIds.forEach((testCaseId) => {
      if (testCaseMap.get(testCaseId)) {
        result.push(testCaseMap.get(testCaseId));
      }
    });
    return result;
  },
};
