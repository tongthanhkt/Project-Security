/* eslint-disable import/extensions */
import db, { Schema } from "../utils/database.js";
import paginate from "mongoose-paginate-v2";

const UserQuizzes = new Schema(
  {
    _id: String,
    student: String,
    quizz: String,
    lesson: String,
    ans: String,
    isTrue: Boolean,
    ts: Number,
  },
  { versionKey: false }
);

UserQuizzes.plugin(paginate);
const UserQuiz = db.model("user_quizzes", UserQuizzes);
export default UserQuiz;
