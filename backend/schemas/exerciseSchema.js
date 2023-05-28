/* eslint-disable import/extensions */
import db, { Schema } from "../utils/database.js";
import paginate from "mongoose-paginate-v2";

const Exercises = new Schema(
  {
    _id: String,
    type: Number,
    question: String,
  },
  { versionKey: false }
);

Exercises.plugin(paginate);
const Exercise = db.model("exercises", Exercises);
export default Exercise;
