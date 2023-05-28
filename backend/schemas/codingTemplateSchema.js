/* eslint-disable import/extensions */
import db, { Schema } from "../utils/database.js";
import paginate from "mongoose-paginate-v2";

const CodingTemplates = new Schema(
  {
    _id: String,
    uploader: String,
    lesson: String,
    langId: Number,
    coding_exercise: String,
    template: String,
  },
  { versionKey: false }
);

CodingTemplates.plugin(paginate);
const CodingTemplate = db.model("coding_templates", CodingTemplates);
export default CodingTemplate;
