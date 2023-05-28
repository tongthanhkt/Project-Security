/* eslint-disable import/extensions */
import db, { Schema } from "../utils/database.js";

const UserLessons = new Schema(
  {
    _id: String,
    student: String,
    lesson: String,
    isDone: Boolean,
    mark: Number,
  },
  { versionKey: false }
);

const UserLesson = db.model("user_lesson", UserLessons);
export default UserLesson;
