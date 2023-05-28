import UserCommentLesson from "../schemas/userCommentLessonSchema.js";
import { DEFAULT_LIMIT } from "../utils/database.js";

export default {
  async findById(commentId) {
    const comment = await UserCommentLesson.findOne({
      _id: commentId,
    }).exec();
    return comment;
  },
  async find(uid, commentId) {
    const comment = await UserCommentLesson.findOne({
      _id: commentId,
      userId: uid,
    }).exec();
    return comment;
  },
  async deleteComment(commentId) {
    console.log("call here");
    const response = await UserCommentLesson.deleteOne({ _id: commentId });
    console.log(response);
    return response ? true : false;
  },
  async getMore(
    conditions,
    page = 0,
    limit = DEFAULT_LIMIT,
    selections = "_id parentId lessonId userId comment createdAt updatedAt",
    sort = { _id: -1 }
  ) {
    if (page < 0 || limit < 0) {
      return null;
    }
    const userLessonComments = await UserCommentLesson.paginate(conditions, {
      page,
      limit,
      select: selections,
      sort,
    });
    const newUserLessonComments = [];
    for (const comment of userLessonComments.docs) {
      const commentObj = comment.toObject();
      let isExistReplyComment = false;
      if (await this.findExistReplyComment(comment._id))
        isExistReplyComment = true;
      commentObj.isExistReplyComment = isExistReplyComment;
      newUserLessonComments.push(commentObj);
    }
    userLessonComments.docs = newUserLessonComments;
    return userLessonComments;
  },
  async findExistReplyComment(parentId) {
    const response = await UserCommentLesson.findOne({ parentId: parentId });
    return response ? true : false;
  },
  async findReplyComment(parentId) {
    const data = await UserCommentLesson.find({ parentId: parentId });
    return data ? data : {};
  },
};
