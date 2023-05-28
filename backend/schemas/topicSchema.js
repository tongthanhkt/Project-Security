/* eslint-disable import/extensions */
import db, { Schema } from "../utils/database.js";

const Topics = new Schema(
  {
    _id: String,
    name: String,
    course: String, // courseId
  },
  { versionKey: false }
);

const Topic = db.model("topics", Topics);
export default Topic;
