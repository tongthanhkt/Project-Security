import jwt from "jsonwebtoken";
import { getNewObjectId } from "../utils/database.js";
import Meeting from "../schemas/meetingSchema.js";
import timeUtils from "../utils/timeUtils.js";
import env from "../utils/env.js";

export default {
  async findById(meetingId) {
    const meetingRet = await Meeting.findById({ _id: meetingId }).exec();
    return meetingRet;
  },

  async save(meeting) {
    try {
      const ret = await meeting.save();
      return ret;
    } catch (err) {
      console.log(err.code);
    }
    return null;
  },

  async create({ userId, startTs, endTs, members = null }) {
    // members === null -> for all members
    const id = getNewObjectId().toString();
    const meeting = new Meeting({
      _id: id,
      ownerId: userId,
      startTs: startTs === 0 ? timeUtils.getCurrentTs() : startTs,
      endTs,
      members,
    });
    const newMeeting = await this.save(meeting);
    if (newMeeting) {
      return newMeeting;
    }
    return null;
  },

  genJWT({ uid, name, roomId, isOwner }) {
    return jwt.sign(
      {
        context: {
          user: {
            // avatar: "https:/gravatar.com/avatar/abc123",
            name,
            // email: "jdoe@example.com",
            id: uid,
          },
        },
        room: roomId,
        iss: env.JITSI_APP_ID,
        aud: "jitsi",
        moderator: isOwner,
      },
      env.JITSI_SECRET,
      {
        expiresIn: "30s",
      }
    );
  },

  async deleteAll() {
    return await Meeting.deleteMany();
  },
};
