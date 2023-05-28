/* eslint-disable import/extensions */
import db, { Schema } from "../utils/database.js";
import paginate from "mongoose-paginate-v2";

const UserVerifications = new Schema(
  {
    _id: String,
    userId: String,
    token: String,
    ts: Number,
  },
  { versionKey: false }
);

UserVerifications.plugin(paginate);
const UserVerification = db.model("user_verifications", UserVerifications);
export default UserVerification;
