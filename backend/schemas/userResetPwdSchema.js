/* eslint-disable import/extensions */
import db, { Schema } from "../utils/database.js";
import paginate from "mongoose-paginate-v2";

const UserResetPwds = new Schema(
  {
    _id: String,
    userId: String,
    token: String,
    ts: Number,
  },
  { versionKey: false }
);

UserResetPwds.plugin(paginate);
const UserResetPwd = db.model("user_reset_pwd", UserResetPwds);
export default UserResetPwd;
