/* eslint-disable import/extensions */
import db, { Schema } from "../utils/database.js";
import paginate from "mongoose-paginate-v2";

const CodingExercises = new Schema(
  {
    _id: String,
    examples: [String], // test case id
    testCases: [String], // test case id
    wall_time_limit: Number,
    memory_limit: Number,
    max_file_size: Number,
    enable_network: Boolean,
  },
  { versionKey: false }
);

CodingExercises.plugin(paginate);
const CodingExercise = db.model("coding_exercises", CodingExercises);
export default CodingExercise;
