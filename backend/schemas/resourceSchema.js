/* eslint-disable import/extensions */
import db, { Schema } from "../utils/database.js";
import paginate from "mongoose-paginate-v2";

const Resources = new Schema(
  {
    _id: String, // folder name
    name: String, // file name (key)
    uploadId: String,
    uploaderId: String,
    size: Number,
    createdAt: Number,
    status: Number,
    type: Number,
    length: Number, // length in seconds
    courses: [String],
  },
  { versionKey: false }
);

Resources.plugin(paginate);
const Resource = db.model("resources", Resources);
export default Resource;
