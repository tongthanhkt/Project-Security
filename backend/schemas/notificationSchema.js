/* eslint-disable import/extensions */
import db, { Schema } from "../utils/database.js";

const Notifications = new Schema(
  {
    _id: String,
    ts: Number,
    type: Number,
    notiObj: String,
  },
  { versionKey: false }
);

const Notification = db.model("notifications", Notifications);
export default Notification;
