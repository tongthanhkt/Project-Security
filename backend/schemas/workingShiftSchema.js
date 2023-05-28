/* eslint-disable import/extensions */
import db, { Schema } from "../utils/database.js";

const WorkingShifts = new Schema(
  {
    _id: String,
    startTime: Number,
    endTime: String,
  },
  { versionKey: false }
);

const WorkingShift = db.model("working_shift", WorkingShifts);
export default WorkingShift;
