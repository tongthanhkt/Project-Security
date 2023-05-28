/* eslint-disable import/extensions */
import db, { Schema } from "../utils/database.js";

const UserNotes = new Schema(
  {
    _id: String,
    student: String,
    lesson: String, // lessonId
    notes: [
      {
        _id: String,
        startTs: Number,
        endTs: Number,
        note: String,
        ts: Number,
      },
    ],
  },
  { versionKey: false }
);

const UserNote = db.model("user_notes", UserNotes);
export default UserNote;
