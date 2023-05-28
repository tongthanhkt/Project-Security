import UserCourse from "../schemas/userCoursesSchema.js";
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
    const courses = await UserCourse.paginate(conditions, {
      page,
      limit,
      select: selections,
      sort,
    });
    return courses;
  },
  async isRegisterCourse(userId, courseId) {
    const isCompleted = await UserCourse.findOne({
      student: userId,
      course: courseId,
    });
    return isCompleted ? true : false;
  },
  async checkUserEnrollCourse(studentId, courseId) {
    const userCourse = await UserCourse.findOne(
      { student: studentId, course: courseId },
      "_id course student isVisible isDone"
    ).exec();
    return userCourse;
  },
};
