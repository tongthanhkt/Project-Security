import UserNoteSchema from "../schemas/userNotesSchema.js";
import { getNewObjectId } from "../utils/database.js";
export default {
  async findOne(studentId, lessonId) {
    const res = await UserNoteSchema.findOne({
      student: studentId,
      lesson: lessonId,
    });
    return res;
  },
  async createNewNote(existNote, { startTs, endTs, note }) {
    const notes = existNote.notes;
    const newNotes = {
      _id: getNewObjectId().toString(),
      startTs: startTs,
      endTs: endTs,
      note: note,
      ts: new Date().getTime(),
    };
    notes.push(newNotes);
    const response = await UserNoteSchema.findByIdAndUpdate(
      { _id: existNote._id },
      existNote
    );
    return response ? response : null;
  },
};

