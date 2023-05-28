/* eslint-disable no-console */
/* eslint-disable import/extensions */
/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
import express from "express";
import authenMw from "../middleware/authen.mw.js";
import authenModel from "../model/authen.model.js";
import courseModel from "../model/course.model.js";
import lessonModel from "../model/lesson.model.js";
import resourceModel, { RESOURCE_TYPE } from "../model/resource.model.js";
import userModel from "../model/user.model.js";
import { ROLE } from "../utils/database.js";
import RESP from "../utils/respCode.js";
import uploadWorker from "../worker/upload.worker.js";

const router = express.Router();

async function removeResourceByResType(
  resourceId,
  resourceType,
  courseIdsAssignedByTutor
) {
  switch (resourceType) {
    case RESOURCE_TYPE.THUMB_COURSE:
      await courseModel.removeThumbInAnyCourse(resourceId);
      break;

    default:
      await lessonModel.removeResourceInAnyLesson(resourceId);
  }
}

router.post(
  "/remove",
  authenMw.stopWhenNotLogon,
  authenMw.stopWhenNotAdminOrTA,
  async (req, res) => {
    const { resourceId } = req.body;
    if (!resourceId || resourceId.toString().trim().length === 0) {
      return res.json({
        status: RESP.INVALID_DATA,
        message: RESP.MSG_INVALID_DATA,
      });
    }

    const resource = await resourceModel.findById(resourceId);
    if (!resource) {
      return res.json({
        status: RESP.NOT_FOUND,
        message: RESP.MSG_NOT_FOUND,
      });
    }

    const ownerId = authenModel.getUidFromReq(req);
    const owner = await userModel.getRole(ownerId);

    // Only admin or uploader can remove resources permanently
    if (owner.role !== ROLE.ADMIN && resource.uploaderId !== ownerId) {
      return res.json({
        status: RESP.NOT_FOUND,
        message: RESP.MSG_NOT_FOUND,
      });
    }
    if (resource.courses.length > 0) {
      await removeResourceByResType(
        resourceId,
        resource.type,
        resource.courses
      );
      // remainingCourseIds = remainingCourseIds.filter(
      //   (courseId) => !courseIdsAssignedByTutor.includes(courseId)
      // );
    }

    await resourceModel.remove(resourceId);
    // remove permanently resource from storage asynchronously
    uploadWorker.remove(resourceModel.toResourceKey(resourceId, resource.name));
    return res.json({ status: RESP.SUCCESS });
  }
);

export default router;
