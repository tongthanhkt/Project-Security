/* eslint-disable import/extensions */
import db, { Schema } from "../utils/database.js";

const Meetings = new Schema(
  {
    _id: String,
    ownerId: String,
    startTs: Number,
    endTs: Number,
    workingShifts: [String],
    isDone: Boolean,
    members: [String],
  },
  { versionKey: false }
);

const Meeting = db.model("meetings", Meetings);
export default Meeting;
