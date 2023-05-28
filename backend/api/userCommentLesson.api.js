import express from "express";
const router = express.Router();
import authenMw from "../middleware/authen.mw.js";
import authenModel from "../model/authen.model.js";
import lessonModel from "../model/lesson.model.js";
import respCode from "../utils/respCode.js";
import UserLessonCommentSchema from "../schemas/userCommentLessonSchema.js";
import { getNewObjectId } from "../utils/database.js";
import userlessonCommentModel from "../model/userlessonComment.model.js";
import numberUtils from "../utils/numberUtils.js";
router.post(
  "/reply-comment/:commentId",
  authenMw.stopWhenNotLogon,
  async (req, res) => {
    const uid = await authenModel.getUidFromReq(req);
    const { comment } = req.body;
    const parentComment = req.params.commentId;
    const existComment = await userlessonCommentModel.findById(parentComment);
    if (!existComment) {
      return res.json({
        status: respCode.INVALID_DATA,
        message: respCode.COMMENT.INVALID_DATA,
      });
    }
    const newComment = new UserLessonCommentSchema({
      _id: getNewObjectId().toString(),
      parentId: parentComment,
      lessonId: existComment.lessonId,
      userId: uid,
      comment: comment,
      createdAt: new Date(),
    });
    try {
      await newComment.save();
      return res.json({
        status: respCode.SUCCESS,
        data: newComment,
      });
    } catch (error) {
      return res.json({
        status: respCode.INTERNAL_ERR,
        message: respCode.MSG_INTERNAL_ERR,
      });
    }
  }
);
router.post("/:lessonId", authenMw.stopWhenNotLogon, async (req, res) => {
  const uid = await authenModel.getUidFromReq(req);
  const { comment } = req.body;
  const lessonId = req.params.lessonId;
  if (!(await lessonModel.isExist(lessonId)))
    return res.json({
      status: respCode.INVALID_DATA,
      message: respCode.LESSON.INVALID_DATA,
    });
  const newComment = new UserLessonCommentSchema({
    _id: getNewObjectId().toString(),
    lessonId: lessonId,
    userId: uid,
    comment: comment,
    createdAt: new Date(),
  });
  try {
    await newComment.save();
    return res.json({
      status: respCode.SUCCESS,
      data: newComment,
    });
  } catch (error) {
    return res.json({
      status: respCode.INTERNAL_ERR,
      message: respCode.MSG_INTERNAL_ERR,
    });
  }
});
router.get(
  "/reply-comment/:parentId",
  authenMw.stopWhenNotLogon,
  async (req, res) => {
    const { page, limit } = req.query;
    if (
      !numberUtils.isNumberic(page) ||
      !numberUtils.isNumberic(limit) ||
      numberUtils.toNum(page) < 0 ||
      numberUtils.toNum(limit) <= 0
    ) {
      return res.json({
        status: respCode.INVALID_DATA,
        message: respCode.MSG_INVALID_DATA,
      });
    }
    const parentCommentId = req.params.parentId;
    try {
      const commentList = await userlessonCommentModel.getMore(
        {
          parentId: parentCommentId,
        },
        page,
        limit
      );
      return res.json({
        status: respCode.SUCCESS,
        data: commentList,
      });
    } catch (error) {
      return res.json({
        status: respCode.INTERNAL_ERR,
        message: respCode.MSG_INTERNAL_ERR,
      });
    }
  }
);
router.get("/:lessonId", authenMw.stopWhenNotLogon, async (req, res) => {
  const { page, limit } = req.query;
  if (
    !numberUtils.isNumberic(page) ||
    !numberUtils.isNumberic(limit) ||
    numberUtils.toNum(page) < 0 ||
    numberUtils.toNum(limit) <= 0
  ) {
    return res.json({
      status: respCode.INVALID_DATA,
      message: respCode.MSG_INVALID_DATA,
    });
  }
  const lessonId = req.params.lessonId;
  if (!(await lessonModel.isExist(lessonId)))
    return res.json({
      status: respCode.INVALID_DATA,
      message: respCode.LESSON.INVALID_DATA,
    });
  try {
    const commentList = await userlessonCommentModel.getMore(
      {
        lessonId: lessonId,
        parentId: null,
      },
      page,
      limit
    );
    return res.json({
      status: respCode.SUCCESS,
      data: commentList,
    });
  } catch (error) {
    return res.json({
      status: respCode.INTERNAL_ERR,
      message: respCode.MSG_INTERNAL_ERR,
    });
  }
});
router.put("/:commentId", authenMw.stopWhenNotLogon, async (req, res) => {
  const uid = await authenModel.getUidFromReq(req);
  const { comment } = req.body;
  const commentId = req.params.commentId;

  const existComment = await userlessonCommentModel.find(uid, commentId);
  if (!existComment) {
    return res.json({
      status: respCode.INVALID_DATA,
      message: respCode.COMMENT.INVALID_DATA,
    });
  }
  const updatedComment = await UserLessonCommentSchema.findOneAndUpdate(
    { _id: commentId },
    {
      comment: comment,
      updatedAt: new Date(),
    },
    { returnOriginal: false }
  );
  return res.json({
    status: respCode.SUCCESS,
    data: updatedComment,
  });
});
router.delete("/:commentId", authenMw.stopWhenNotLogon, async (req, res) => {
  const uid = await authenModel.getUidFromReq(req);
  const { comment } = req.body;
  const lessonId = req.params.lessonId;
  const commentId = req.params.commentId;

  const existComment = await userlessonCommentModel.find(uid, commentId);
  if (!existComment) {
    return res.json({
      status: respCode.INVALID_DATA,
      message: respCode.COMMENT.INVALID_DATA,
    });
  }
  if (!(await userlessonCommentModel.deleteComment(commentId)))
    return res.json({
      status: respCode.INTERNAL_ERR,
      message: respCode.MSG_INTERNAL_ERR,
    });
  return res.json({
    status: respCode.SUCCESS,
    message: respCode.MSG_SUCCESS,
  });
});

export default router;
