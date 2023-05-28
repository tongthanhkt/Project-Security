/* eslint-disable import/extensions */
import db, { Schema } from "../utils/database.js";

const TestCases = new Schema(
  {
    _id: String,
    outputFileName: String,
    out: String,
    stdin: String,
    cmd_line_arg: String,
    inputFile: String,
    inputFileName: String,
  },
  { versionKey: false }
);

const TestCase = db.model("test_cases", TestCases);
export default TestCase;
