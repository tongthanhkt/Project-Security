/* eslint-disable import/extensions */
import db, { Schema } from "../utils/database.js";

const FreeSchedules = new Schema(
  {
    _id: String,
    days: [
      {
        _id: String,
        workingShifts: [String],
        day: Number,
      },
    ],
  },
  { versionKey: false }
);

const FreeSchedule = db.model("free_schedule", FreeSchedules);
export default FreeSchedule;
