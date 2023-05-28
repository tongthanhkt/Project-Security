/* eslint-disable import/extensions */
import db, { Schema } from "../utils/database.js";
import paginate from "mongoose-paginate-v2";

const LastRunCodes = new Schema(
  {
    _id: String,
    student: String,
    lesson: String,
    coding_exercise: String,
    src_code: String,
    langId: Number,
    ts: Number,
    testCases: [
      {
        _id: String,
        testCaseId: String,
        file_output: String,
        runId: String,
        out: String,
        memory: Number,
        stderr: String,
        compile_output: String,
        time: Number,
        wall_time: Number,
        exit_code: Number,
        statusId: Number,
      },
    ],
  },
  { versionKey: false }
);

LastRunCodes.plugin(paginate);
const LastRunCode = db.model("last_run_code", LastRunCodes);
export default LastRunCode;
