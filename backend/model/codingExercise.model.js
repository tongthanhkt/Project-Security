import CodingExercise from "../schemas/codingExercisesSchema.js";
import { DEFAULT_LIMIT } from "../utils/database.js";
import { LANG_ID } from "../utils/judge.constant.js";
import testCaseModel from "./testCase.model.js";
import userCodeModel from "./userCode.model.js";

export default {
  async findById(exerciseId) {
    const codingExercise = await CodingExercise.findById({
      _id: exerciseId,
    }).exec();
    return codingExercise;
  },

  async findOneBy(conditions, selections) {
    const ret = await CodingExercise.findOne(conditions)
      .select(selections)
      .exec();
    return ret;
  },

  async save(codingExercise) {
    try {
      const ret = await codingExercise.save();
      return ret;
    } catch (err) {
      console.log(err.code);
    }
    return null;
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
    const codingExercises = await CodingExercise.paginate(conditions, {
      page,
      limit,
      select: selections,
      sort,
    });
    return codingExercises;
  },

  async isTestCaseLinkToAnotherCodingExer(testCaseId, exerciseId) {
    const codingExercisePaging = await this.getMore(
      {
        _id: { $ne: exerciseId },
        $or: [
          { examples: { $in: [testCaseId] } },
          { testCases: { $in: [testCaseId] } },
        ],
      },
      0,
      1
    );

    return codingExercisePaging.docs.length !== 0;
  },

  async remove(exerciseId) {
    const userCodingPaging = await userCodeModel.getMore(
      { coding_exercise: exerciseId },
      0,
      1
    );

    if (userCodingPaging.docs.length !== 0) {
      return false;
    }

    const codingExercise = await this.findById(exerciseId);
    if (!codingExercise) {
      return true;
    }

    const testCaseIdsSet = new Set();
    codingExercise.examples.forEach((exampleId) => {
      testCaseIdsSet.add(exampleId);
    });
    codingExercise.testCases.forEach((testCaseId) => {
      testCaseIdsSet.add(testCaseId);
    });
    const testCaseIdsArr = [...testCaseIdsSet];
    const rmTestCaseIds = [];
    // filter only test cases which have not been shared in any other coding_exercise
    for (let i = 0; i < testCaseIdsArr.length; i++) {
      if (
        !(await this.isTestCaseLinkToAnotherCodingExer(
          testCaseIdsArr[i],
          exerciseId
        ))
      ) {
        rmTestCaseIds.push(testCaseIdsArr[i]);
      }
    }
    // remove test case from db
    await testCaseModel.multiRemove(rmTestCaseIds);
    // remove coding exercise from db
    await CodingExercise.deleteOne({ _id: exerciseId });
    return true;
  },

  async multiGet(exerciseIds, selections) {
    const res = await CodingExercise.find({ _id: { $in: exerciseIds } })
      .select(selections)
      .exec();
    const mapRes = new Map();
    if (res) {
      for (let i = 0; i < res.length; i++) {
        mapRes.set(res[i]._id, res[i]);
      }
    }
    for (let i = 0; i < exerciseIds.length; i++) {
      if (!mapRes.get(exerciseIds[i])) {
        mapRes.set(exerciseIds[i], null);
      }
    }
    return mapRes;
  },

  isValidLangId(langId) {
    const langIds = Object.values(LANG_ID);
    return langId !== LANG_ID.MULTI_FILE && langIds.includes(langId);
  },
};
