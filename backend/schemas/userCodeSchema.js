/* eslint-disable import/extensions */
import db, { Schema } from "../utils/database.js";
import paginate from "mongoose-paginate-v2";

const UserCodes = new Schema(
  {
    _id: String,
    student: String,
    coding_exercise: String,
    lesson: String,
    src_code: String,
    langId: Number,
    ts: Number,
    test_cases: [
      {
        _id: String,
        testCaseId: String,
        status: Number,
        runId: String,
      },
    ],
  },
  { versionKey: false }
);

UserCodes.plugin(paginate);
const UserCode = db.model("user_code", UserCodes);
export default UserCode;
