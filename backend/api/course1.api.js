import express from "express";
import authenMw from "../middleware/authen.mw.js";
const router = express.Router();
import CourseDto from "../dto/course.dto.js";
import courseModel from "../model/course.model.js";
import respCode from "../utils/respCode.js";
import Course from "../schemas/courseSchema.js";
import resourceModel from "../model/resource.model.js";
router.put("/update/:courseId", authenMw.stopWhenNotAdmin, async (req, res) => {
  const courseId = req.params.courseId;
  if (!courseModel.isExist(courseId)) {
    return res.json({
      status: respCode.INVALID_DATA,
      message: respCode.COURSE.INVALID_COURSE,
    });
  }

  let course = new CourseDto(req.body);

  if (course.thumb) {
    const isExistResoucse = await resourceModel.isExist(course.thumb);
    console.log(isExistResoucse);
    if (!isExistResoucse)
      return res.json({
        status: respCode.INVALID_DATA,
        message: respCode.RESOURCES.INVALID_DATA,
      });
  }
  try {
    const data = await Course.findOneAndUpdate({ _id: courseId }, course, {
      returnOriginal: false,
    });
    return res.json({
      status: respCode.SUCCESS,
      data: data,
    });
  } catch (error) {
    return res.json({
      status: respCode.INTERNAL_ERR,
      message: respCode.MSG_INTERNAL_ERR,
    });
  }
});
export default router;
