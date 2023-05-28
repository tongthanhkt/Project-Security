import Quiz from "../schemas/quizzesSchema.js";
import userQuizModel from "./userQuiz.model.js";

export default {
  async save(quiz) {
    try {
      const ret = await quiz.save();
      return ret;
    } catch (err) {
      console.log(err.code);
    }
    return null;
  },

  async remove(exerciseId) {
    const userQuizPaging = await userQuizModel.getMore(
      { quizz: exerciseId },
      0,
      1
    );
    if (userQuizPaging.docs.length !== 0) {
      return false;
    }

    await Quiz.deleteOne({ _id: exerciseId });
    return true;
  },

  async multiGet(exerciseIds, selections) {
    const res = await Quiz.find({ _id: { $in: exerciseIds } })
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

  async findOneBy(conditions, selections) {
    const ret = await Quiz.findOne(conditions).select(selections).exec();
    return ret;
  },
};
