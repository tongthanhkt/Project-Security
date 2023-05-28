import Course from "../schemas/courseSchema.js";
import UserCourse from "../schemas/userCoursesSchema.js";
import { DEFAULT_LIMIT } from "../utils/database.js";

export default {
  async findById(courseId) {
    const courseRet = await Course.findById({ _id: courseId }).exec();
    return courseRet;
  },
  
  async isExist(courseId) {
    const courseRet = await Course.findById(courseId, "_id")
      .select("_id")
      .exec();
    return courseRet !== null;
  },

  async save(course) {
    try {
      const ret = await course.save();
      return ret;
    } catch (err) {
      console.log(err.code);
    }
    return null;
  },

  async isTutorAssigned(tutorId, courseId) {
    const ret = await Course.find({
      _id: courseId,
      tutors: { $in: [tutorId] },
    })
      .select("_id")
      .exec();
    return ret !== null && ret.length !== 0;
  },

  async isVisible(courseId) {
    const course = await Course.findById({ _id: courseId }, "isVisible").exec();
    if (course && course.isVisible) {
      return true;
    }
    return false;
  },

  async getTopCoursesByStudentEnroll(page, limit) {
    if (page < 0 || limit <= 0) {
      return null;
    }
    page += 1;
    const aggregateQuery = UserCourse.aggregate([
      { $match: { isVisible: true } },
      { $group: { _id: "$course", nStudents: { $sum: 1 } } },
      { $sort: { nStudents: -1 } },
    ]);
    try {
      const res = await UserCourse.aggregatePaginate(aggregateQuery, {
        page,
        limit,
      });
      return res;
    } catch (err) {
      return null;
    }
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
    const courses = await Course.paginate(conditions, {
      page,
      limit,
      select: selections,
      sort,
    });
    return courses;
  },

  async multiGet(courseIds, selections) {
    const res = await Course.find({ _id: { $in: courseIds } })
      .select(selections)
      .exec();
    const mapRes = new Map();
    if (res) {
      for (let i = 0; i < res.length; i++) {
        mapRes.set(res[i]._id, res[i]);
      }
    }
    for (let i = 0; i < courseIds.length; i++) {
      if (!mapRes.get(courseIds[i])) {
        mapRes.set(courseIds[i], null);
      }
    }
    return mapRes;
  },

  async filterCoursesByTutorId(courseIds, tutorId) {
    const ret = await Course.find({
      _id: { $in: courseIds },
      tutors: { $in: [tutorId] },
    })
      .select("_id")
      .exec();
    const result = [];
    ret.forEach(({ _id }) => {
      result.push(_id);
    });
    return result;
  },

  async removeThumbByCourseId(thumbId, courseId) {
    const ret = await Course.updateMany(
      { _id: courseId, thumb: thumbId },
      { thumb: null }
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

  async removeThumbByCourseIds(thumbId, courseIds) {
    // for (let i = 0; i < courseIds.length; i++) {
    //   await this.removeThumbByCourseId(thumbId, courseIds[i]);
    // }
    const ret = await Course.updateMany(
      {
        _id: { $in: courseIds },
        thumb: thumbId,
      },
      { thumb: null }
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

  async removeThumbInAnyCourse(thumbId) {
    const ret = await Course.updateMany(
      {
        thumb: thumbId,
      },
      { thumb: null }
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
};
