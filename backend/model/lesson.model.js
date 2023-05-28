import Lesson from "../schemas/lessonSchema.js";
import { DEFAULT_LIMIT } from "../utils/database.js";

export default {
  async findById(lessonId) {
    const lessonRet = await Lesson.findById({ _id: lessonId }).exec();
    return lessonRet;
  },
  async findLessonsByTopic(topic_id) {
    const lessonList = await Lesson.find({ topic: topic_id });
    const lessonObjs = lessonList.map((lessonObj) => lessonObj.toObject());
    return lessonObjs;
  },
  async isExist(lessonId) {
    const lessonRet = await Lesson.findById(lessonId, "_id")
      .select("_id")
      .exec();
    return lessonRet !== null;
  },
  async isExistName(name) {
    const isExist = await Lesson.findOne({ name: name });
    console.log(isExist);
    return isExist != null ? true : false;
  },
  async save(lesson) {
    try {
      const ret = await lesson.save();
      return ret;
    } catch (err) {
      console.log(err.code);
    }
    return null;
  },

  async countLessonByCourseAndRes(courseId, resourceId) {
    const count = await Lesson.find({
      course: courseId,
      resources: { $in: [resourceId] },
    })
      .select("_id")
      .countDocuments()
      .exec();
    return count;
  },

  async multiCountLessons(courseIds) {
    const ret = await Lesson.aggregate([
      { $match: { course: { $in: courseIds } } },
      { $group: { _id: "$course", nLessons: { $sum: 1 } } },
    ]);
    return ret;
  },

  async removeResourceByCourseId(resourceId, courseId) {
    const ret = await Lesson.updateMany(
      {
        course: courseId,
        resources: { $in: [resourceId] },
      },
      { $pullAll: { resources: [resourceId] } }
    ).exec();
    /*
     * return struct:
     *  {
          acknowledged: <Boolean>,
          modifiedCount: <Number>,
          upsertedId: null,
          upsertedCount: <Number>,
          matchedCount: <Number>
        }
     */
    return ret;
  },

  async removeResourceByCourseIds(resourceId, courseIds) {
    // for (let i = 0; i < courseIds.length; i++) {
    //   await this.removeResourceByCourseId(resourceId, courseIds[i]);
    // }
    const ret = await Lesson.updateMany(
      {
        course: { $in: courseIds },
        resources: { $in: [resourceId] },
      },
      { $pullAll: { resources: [resourceId] } }
    ).exec();
    /*
     * return struct:
     *  {
          acknowledged: <Boolean>,
          modifiedCount: <Number>,
          upsertedId: null,
          upsertedCount: <Number>,
          matchedCount: <Number>
        }
     */
    return ret;
  },

  async removeResourceInAnyLesson(resourceId) {
    const ret = await Lesson.updateMany(
      {
        resources: { $in: [resourceId] },
      },
      { $pullAll: { resources: [resourceId] } }
    ).exec();
    /*
     * return struct:
     *  {
          acknowledged: <Boolean>,
          modifiedCount: <Number>,
          upsertedId: null,
          upsertedCount: <Number>,
          matchedCount: <Number>
        }
     */
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
    const lessons = await Lesson.paginate(conditions, {
      page,
      limit,
      select: selections,
      sort,
    });
    return lessons;
  },

  async getExerciseIds(lessonId) {
    const lessonRet = await Lesson.findById({ _id: lessonId })
      .select("exercises isVisible")
      .exec();
    return lessonRet;
  },

  async isContainExercise(lessonId, exerciseId) {
    const lessonPaging = await this.getMore(
      { _id: lessonId, exercises: { $in: [exerciseId] } },
      0,
      1,
      "_id"
    );
    return lessonPaging !== null && lessonPaging.docs.length > 0;
  },

  async findOneBy(conditions, selections) {
    const ret = await Lesson.findOne(conditions).select(selections).exec();
    return ret;
  },
};
