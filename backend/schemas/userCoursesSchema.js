/* eslint-disable import/extensions */
import db, { Schema } from "../utils/database.js";
import aggregatePaginate from "mongoose-aggregate-paginate-v2";
import paginate from "mongoose-paginate-v2";
const UserCourses = new Schema(
  {
    _id: String,
    course: String, // courseId
    student: String, // studentId
    isVisible: Boolean, // visibility of course
    isDone: Boolean,
  },
  { versionKey: false }
);

UserCourses.plugin(aggregatePaginate);

UserCourses.plugin(paginate);
const UserCourse = db.model("user_courses", UserCourses);
export default UserCourse;
