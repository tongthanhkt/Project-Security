/* eslint-disable import/extensions */
import db, { Schema } from "../utils/database.js";

const CommentLessons = new Schema(
  {
    _id: String,
    refComment: String,
    user: String, // userId
    lesson: String, // lessonId
    content: String,
    ts: Number,
  },
  { versionKey: false }
);

const CommentLesson = db.model("comment_lessons", CommentLessons);
export default CommentLesson;
