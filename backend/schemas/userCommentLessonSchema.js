import paginate from "mongoose-paginate-v2";
import db, { Schema } from "../utils/database.js";
const UserCommentLessons = new Schema(
  {
    _id: String,
    parentId: String,
    lessonId: String,
    userId: String,
    comment: String,
    createdAt: Date,
    updatedAt: Date,
  },
  {
    versionKey: false,
  }
);
UserCommentLessons.plugin(paginate);
const UserCommentLesson = db.model("user_lesson_comments", UserCommentLessons);
export default UserCommentLesson;
