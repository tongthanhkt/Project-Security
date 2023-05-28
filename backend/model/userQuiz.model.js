import UserQuiz from "../schemas/userQuizzSchema.js";
import { DEFAULT_LIMIT } from "../utils/database.js";

export default {
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
    const userQuizzes = await UserQuiz.paginate(conditions, {
      page,
      limit,
      select: selections,
      sort,
    });
    return userQuizzes;
  },

  async save(userQuiz) {
    try {
      const ret = await userQuiz.save();
      return ret;
    } catch (err) {
      console.log(err.code);
    }
    return null;
  },

  async findOneBy(conditions, selections) {
    const ret = await UserQuiz.findOne(conditions).select(selections).exec();
    return ret;
  },

  async multiGetCompletedStatus(studentId, quizIds) {
    const res = await UserQuiz.find({
      student: studentId,
      quizz: { $in: quizIds },
    })
      .select("_id quizz")
      .exec();
    const mapRes = new Map();
    if (res) {
      for (let i = 0; i < res.length; i++) {
        mapRes.set(res[i].quizz, true);
      }
    }
    for (let i = 0; i < quizIds.length; i++) {
      if (!mapRes.get(quizIds[i])) {
        mapRes.set(quizIds[i], false);
      }
    }
    return mapRes;
  },
};
