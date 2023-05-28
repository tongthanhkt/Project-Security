/* eslint-disable import/extensions */
import db, { Schema } from "../utils/database.js";
import paginate from "mongoose-paginate-v2";

const Lessons = new Schema(
  {
    _id: String,
    ts: Number,
    name: String,
    topic: String, // topicId
    course: String, // courseId
    description: String,
    resources: [String], // resourceId
    exercises: [String],
    isVisible: Boolean,
  },
  { versionKey: false }
);

Lessons.plugin(paginate);
const Lesson = db.model("lessons", Lessons);
export default Lesson;
