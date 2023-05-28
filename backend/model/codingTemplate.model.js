import CodingTemplate from "../schemas/codingTemplateSchema.js";
import { getNewObjectId } from "../utils/database.js";

export default {
  async findOneBy(conditions, selections) {
    const ret = await CodingTemplate.findOne(conditions)
      .select(selections)
      .exec();
    return ret;
  },

  async delOne(conditions) {
    const ret = await CodingTemplate.deleteOne(conditions);
    // returns {deletedCount: 1}
    return ret;
  },

  async save(codingTemplate) {
    try {
      const ret = await codingTemplate.save();
      return ret;
    } catch (err) {
      console.log(err.code);
    }
    return null;
  },

  async create(uploader, lesson, langId, coding_exercise, template) {
    return await this.save(
      new CodingTemplate({
        _id: getNewObjectId().toString(),
        coding_exercise,
        langId,
        lesson,
        uploader,
        template: template.toString().trim(),
      })
    );
  },

  async findByLessonAndExer(lessonId, exerciseId, selections) {
    const res = await CodingTemplate.find({
      lesson: lessonId,
      coding_exercise: exerciseId,
    })
      .select(selections)
      .exec();
    const result = [];
    if (res) {
      for (let i = 0; i < res.length; i++) {
        result.push(res[i]);
      }
    }
    return result;
  },

  async getLangIdsByLessonAndExer(lessonId, exerciseId) {
    const arrTmp = await this.findByLessonAndExer(
      lessonId,
      exerciseId,
      "langId"
    );
    const result = [];
    for (let i = 0; i < arrTmp.length; i++) {
      result.push(arrTmp[i].langId);
    }
    return result;
  },
};
