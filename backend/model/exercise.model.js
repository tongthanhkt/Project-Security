import CodingExercise from "../schemas/codingExercisesSchema.js";
import Exercise from "../schemas/exerciseSchema.js";
import Quiz from "../schemas/quizzesSchema.js";
import { DEFAULT_LIMIT, getNewObjectId } from "../utils/database.js";
import codingExerciseModel from "./codingExercise.model.js";
import quizModel from "./quiz.model.js";

export const EXERCISE_TYPE = {
  QUIZ: 1,
  CODING: 2,
};

export default {
  async checkSubExcercise(exerciseIds) {
    const exerciseList = await Exercise.find();
    const exerciseIdList = exerciseList.map((exercise) => exercise._id);
    return exerciseIds.every((exerciseId) =>
    exerciseIds.includes(exerciseId)
    );
  },
  async findById(exerciseId) {
    const exerciseRet = await Exercise.findById({ _id: exerciseId }).exec();
    return exerciseRet;
  },

  async save(exercise) {
    try {
      const ret = await exercise.save();
      return ret;
    } catch (err) {
      console.log(err.code);
    }
    return null;
  },

  async createQuiz({ question, trueAnsIndex, answersArr }) {
    const answers = [];
    let true_ans = null;
    for (let i = 0; i < answersArr.length; i++) {
      const _id = getNewObjectId().toString();
      if (i === trueAnsIndex) {
        true_ans = _id;
      }
      answers.push({ _id, description: answersArr[i] });
    }

    const _id = getNewObjectId().toString();
    const exercise = new Exercise({
      _id,
      question,
      type: EXERCISE_TYPE.QUIZ,
    });
    const resultAdd = await this.save(exercise);
    if (!resultAdd) {
      return null;
    }

    const quiz = new Quiz({ _id, true_ans, answers });
    if (!(await quizModel.save(quiz))) {
      return null;
    }

    return {
      _id,
      question,
      type: EXERCISE_TYPE.QUIZ,
      true_ans,
      answers,
    };
  },

  async createCodingExercise({
    question,
    examplesArr,
    testCasesArr,
    wall_time_limit,
    memory_limit,
    max_file_size,
    enable_network,
  }) {
    const _id = getNewObjectId().toString();
    const exercise = new Exercise({
      _id,
      question,
      type: EXERCISE_TYPE.CODING,
    });

    const resultAdd = await this.save(exercise);
    if (!resultAdd) {
      return null;
    }

    const codingExercise = new CodingExercise({
      _id,
      examples: [...examplesArr],
      testCases: [...testCasesArr],
      wall_time_limit,
      memory_limit,
      max_file_size,
      enable_network,
    });
    if (!(await codingExerciseModel.save(codingExercise))) {
      return null;
    }

    return {
      _id,
      question,
      type: EXERCISE_TYPE.CODING,
      examplesArr,
      testCasesArr,
      wall_time_limit,
      memory_limit,
      max_file_size,
      enable_network,
    };
  },

  async remove(exerciseId, exerciseType) {
    switch (exerciseType) {
      case EXERCISE_TYPE.CODING:
        if (!(await codingExerciseModel.remove(exerciseId))) {
          return false;
        }
        break;
      case EXERCISE_TYPE.QUIZ:
        if (!(await quizModel.remove(exerciseId))) {
          return false;
        }
        break;
      default:
        return false;
    }

    await Exercise.deleteOne({ _id: exerciseId });
    return true;
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
    const exercises = await Exercise.paginate(conditions, {
      page,
      limit,
      select: selections,
      sort,
    });
    return exercises;
  },
};
