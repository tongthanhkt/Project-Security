/* eslint-disable import/extensions */
import db, { Schema } from "../utils/database.js";
import paginate from "mongoose-paginate-v2";

const TAInvitations = new Schema(
  {
    _id: String,
    email: String,
    token: String,
    ts: Number,
  },
  { versionKey: false }
);

TAInvitations.plugin(paginate);
const TAInvitation = db.model("ta_invitations", TAInvitations);
export default TAInvitation;
