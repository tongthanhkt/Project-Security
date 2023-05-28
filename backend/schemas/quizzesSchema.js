/* eslint-disable import/extensions */
import db, { Schema } from "../utils/database.js";

const Quizzes = new Schema(
  {
    _id: String,
    true_ans: String,
    answers: [
      {
        _id: String,
        description: String,
      },
    ],
  },
  { versionKey: false }
);

const Quiz = db.model("quizzes", Quizzes);
export default Quiz;
