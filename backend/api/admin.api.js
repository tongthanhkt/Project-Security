import express from "express";
import authenMw from "../middleware/authen.mw.js";
const router = express.Router();
import respCode from "../utils/respCode.js";
import Course from "../schemas/courseSchema.js";
import { getNewObjectId, ROLE } from "../utils/database.js";
import courseModel from "../model/course.model.js";
import User from "../schemas/userSchema.js";
import Topic from "../schemas/topicSchema.js";
import topicModel from "../model/topic.model.js";
import resourceModel from "../model/resource.model.js";
import exerciseModel from "../model/exercise.model.js";
import Lesson from "../schemas/lessonSchema.js";
import lessonModel from "../model/lesson.model.js";
router.post(
  "/create-lesson/:id",
  authenMw.stopWhenNotAdmin,
  async (req, res) => {
    const courseId = req.params.id;
    const { topic, resourceIds, exerciseIds, isVisible, name, description } =
      req.body;
    if (!courseId || !courseModel.isExist(courseId)) {
      return res.json({
        status: respCode.INVALID_DATA,
        message: respCode.COURSE.INVALID_COURSE,
      });
    }
    if (name && (await lessonModel.isExistName(name))) {
      return res.json({
        status: respCode.INVALID_DATA,
        message: respCode.LESSON.IS_EXIST_NAME,
      });
    }
    if (isVisible == null)
      return res.json({
        status: respCode.INVALID_DATA,
        message: respCode.IS_VISIBLE_REQUIRED,
      });
    if (!topicModel.isExist(topic))
      return res.json({
        status: respCode.INVALID_DATA,
        message: respCode.TOPIC.EXIST,
      });
    if (resourceIds && !Array.isArray(resourceIds))
      return res.json({
        status: respCode.INVALID_DATA,
        message: respCode.RESOURCES.INVALID_DATA,
      });
    else {
      const isValidResource = await resourceModel.checkSubResourse(resourceIds);
      if (!isValidResource)
        return res.json({
          status: respCode.INVALID_DATA,
          message: respCode.RESOURCES.INVALID_DATA,
        });
    }
    if (exerciseIds && !Array.isArray(exerciseIds))
      return res.json({
        status: respCode.INVALID_DATA,
        message: respCode.EXCERCISES.INVALID_DATA,
      });
    else {
      const isValidExercise = await exerciseModel.checkSubExcercise(
        resourceIds
      );
      if (!isValidExercise)
        return res.json({
          status: respCode.INVALID_DATA,
          message: respCode.EXCERCISES.INVALID_DATA,
        });
    }
    const newLesson = new Lesson({
      _id: getNewObjectId().toString(),
      topic: topic,
      exercises: exerciseIds || [],
      resources: resourceIds || [],
      isVisible: isVisible,
      course: courseId,
      name: name,
      description: description,
      ts: new Date().getTime(),
    });
    try {
      await newLesson.save();
      return res.json({
        status: respCode.SUCCESS,
        data: newLesson,
      });
    } catch (error) {
      return res.json({
        status: respCode.INTERNAL_ERR,
        message: respCode.MSG_INTERNAL_ERR,
      });
    }
  }
);
router.post(
  "/create-topic/:id",
  authenMw.stopWhenNotAdmin,
  async (req, res) => {
    const courseId = req.params.id;
    const { name } = req.body;
    if (!courseId || !courseModel.isExist(courseId) || !name) {
      return res.json({
        status: respCode.INVALID_DATA,
        message: respCode.COURSE.INVALID_COURSE,
      });
    }
    if (name && (await topicModel.isExistName(name))) {
      return res.json({
        status: respCode.INVALID_DATA,
        message: respCode.TOPIC.IS_EXIST_NAME,
      });
    }
    try {
      const topic = new Topic({
        _id: getNewObjectId().toString(),
        name: name,
        course: courseId,
      });
      topic.save();
      return res.json({
        status: respCode.SUCCESS,
        data: topic,
      });
    } catch (error) {
      return res.json({
        status: respCode.INTERNAL_ERR,
        message: respCode.MSG_INTERNAL_ERR,
      });
    }
  }
);
router.post(
  "/assign-ta-for-course/:id",
  authenMw.stopWhenNotAdmin,
  async (req, res) => {
    const ids = req.body.ids;
    const courseId = req.params.id;
    if (!courseId || !courseModel.isExist(courseId)) {
      return res.json({
        status: respCode.INVALID_DATA,
        message: respCode.COURSE.INVALID_COURSE,
      });
    }
    if (!Array.isArray(ids)) {
      return res.json({
        status: respCode.INVALID_DATA,
        message: respCode.TA.INVALID_TA,
      });
    }
    const taList = await User.find({ role: ROLE.TA });
    const taIds = taList.map((ta) => ta._id);
    console.log(taIds);
    for (const ta of ids) {
      if (!taIds.includes(ta))
        return res.json({
          status: respCode.INVALID_DATA,
          message: respCode.TA.INVALID_TA,
        });
    }
    const courseDetail = await courseModel.findById(courseId);
    let tutors = courseDetail.tutors || [];
    tutors = tutors.concat(ids);
    console.log(tutors);
    tutors = removeDuplicates(tutors);
    try {
      const data = await Course.findOneAndUpdate(
        { _id: courseId },
        { tutors: tutors },
        { returnOriginal: false }
      );
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
  }
);
router.put(
  "/update-tas-of-course/:id",
  authenMw.stopWhenNotAdmin,
  async (req, res) => {
    const ids = req.body.ids;
    const courseId = req.params.id;
    if (!courseId || !courseModel.isExist(courseId)) {
      return res.json({
        status: respCode.INVALID_DATA,
        message: respCode.COURSE.INVALID_COURSE,
      });
    }
    if (!Array.isArray(ids)) {
      return res.json({
        status: respCode.INVALID_DATA,
        message: respCode.TA.INVALID_TA,
      });
    }
    const taList = await User.find({ role: ROLE.TA });
    const taIds = taList.map((ta) => ta._id);
    console.log(taIds);
    for (const ta of ids) {
      if (!taIds.includes(ta))
        return res.json({
          status: respCode.INVALID_DATA,
          message: respCode.TA.INVALID_TA,
        });
    }
// update
    try {
      const response = await Course.findOneAndUpdate(
        { _id: courseId },
        { tutors: removeDuplicates(ids) },
        { returnOriginal: false }
      );
      return res.json({
        status: respCode.SUCCESS,
        data: response,
      });
    } catch (error) {
      return res.json({
        status: respCode.INTERNAL_ERR,
        message: respCode.MSG_INTERNAL_ERR,
      });
    }
  }
);
function removeDuplicates(arr) {
  var hashMap = {};
  for (let i of arr) {
    if (hashMap[i]) {
      hashMap[i] += 1;
    } else {
      hashMap[i] = 1;
    }
  }
  console.log(hashMap);
  var newArray = [];
  for (let [key, value] of Object.entries(hashMap)) {
    newArray.push(key);
  }

  return newArray;
}
export default router;
