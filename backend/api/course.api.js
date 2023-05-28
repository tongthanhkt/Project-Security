/* eslint-disable no-console */
/* eslint-disable import/extensions */
/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
import express from "express";
import authenMw from "../middleware/authen.mw.js";
import authenModel from "../model/authen.model.js";
import lessonModel from "../model/lesson.model.js";
import resourceModel, {
  DEFAULT_TIME_IN_SEC,
  RESOURCE_TYPE,
} from "../model/resource.model.js";
import userModel from "../model/user.model.js";
import Course from "../schemas/courseSchema.js";
import User from "../schemas/userSchema.js";
import { getNewObjectId, ROLE } from "../utils/database.js";
import numberUtils from "../utils/numberUtils.js";
import respCode from "../utils/respCode.js";
import validator from "../utils/validator.js";
import courseModel from "../model/course.model.js";
import Lesson from "../schemas/lessonSchema.js";
import Topic from "../schemas/topicSchema.js";
import Resource from "../schemas/resourceSchema.js";
import UserCourse from "../schemas/userCoursesSchema.js";
import userCourseModel from "../model/userCourse.model.js";
const router = express.Router();
function checkExistTa(tutors, taUsers) {
  return tutors.every((tutor) => {
    return taUsers.includes(tutor);
  });
}
async function countDetail(courseId) {
  const lessons = await Lesson.find({ course: courseId, isVisible: true });
  const students = await UserCourse.find({ course: courseId });
  return {
    nStudents: students.length,
    nLessons: lessons.length,
  };
}
router.post("/registry", authenMw.stopWhenNotLogon, async (req, res) => {
  const uid = authenModel.getUidFromReq(req);
  const { course_id } = req.body;
  const existedCourse = await Course.findOne({
    _id: course_id,
  });
  if (!course_id || !uid || !existedCourse)
    return res.json({
      status: respCode.INVALID_DATA,
      message: respCode.MSG_INVALID_DATA,
    });
  if (existedCourse.isVisible != true) {
    return res.json({
      status: respCode.INVALID_DATA,
      message: "Course is not visble",
    });
  }
  const id = getNewObjectId().toString();
  const result = await UserCourse.create({
    _id: id,
    student: uid,
    course: course_id,
    isVisible: true,
  });
  if (!result)
    return res.json({
      status: respCode.INTERNAL_ERR,
      message: respCode.MSG_INTERNAL_ERR,
    });
  return res.json({
    status: respCode.SUCCESS,
    data: {
      _id: id,
    },
  });
});
router.get("/user/:id", async (req, res) => {
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
  let userCourseList = await userCourseModel.getMore(
    { student: req.params.id },
    page,
    limit,
    "_id course student isVisible"
  );
  const userCourseId = userCourseList.docs.map((item) => item.course);
  let courseList = await courseModel.getMore(
    {},
    1,
    100,
    "_id name tutors description requirement thumb isVisible"
  );
  courseList = courseList.docs.filter((course) =>
    userCourseId.includes(course._id)
  );
  userCourseList.docs = courseList;
  console.log(userCourseList);
  let courseInfo = new Map();
  const courseThumbIdMap = new Map();
  const thumbIds = [];
  for (const course of userCourseList.docs) {
    const nCount = await countDetail(course._id);
    const courseDetail = await Course.findOne({ _id: course._id });
    if (!courseDetail) {
      return res.json({
        status: respCode.INTERNAL_ERR,
        message: respCode.INTERNAL_ERR,
      });
    }

    courseInfo.set(course._id, {
      nStudents: nCount.nStudents,
      nLessons: nCount.nLessons,
      name: courseDetail.name,
      thumb: courseDetail.thumb,
    });
    thumbIds.push(courseDetail.thumb);
    courseThumbIdMap.set(courseDetail.thumb, course._id);
  }
  console.log(thumbIds);
  const thumIdSignedUrlMap = await resourceModel.getSignedUrls(
    thumbIds,
    DEFAULT_TIME_IN_SEC
  );
  const courseInfoResponse = {};
  for (const [key, value] of courseInfo) {
    courseInfoResponse[key] = value;
  }
  console.log(thumIdSignedUrlMap);
  thumIdSignedUrlMap.forEach((signedUrl, thumbId) => {
    courseInfoResponse[courseThumbIdMap.get(thumbId)].thumbUrl = signedUrl;
  });

  return res.json({
    status: respCode.SUCCESS,
    data: {
      course: userCourseList,
      coursesInfo: courseInfoResponse,
    },
  });
});
router.get("/list", authenMw.stopWhenNotLogon, async (req, res) => {
  const { page, limit, search } = req.query;
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
  let conditions = {};
  const uid = authenModel.getUidFromReq(req);
  const user = await userModel.getRole(uid);
  if (user.role !== ROLE.ADMIN) conditions = { isVisible: true };
  if (search) conditions["name"] = new RegExp(search, "i");
  console.log(conditions);
  const courseList = await courseModel.getMore(
    conditions,
    page,
    limit,
    "_id name tutors description requirement thumb isVisible"
  );
  console.log(courseList.docs);
  let courseInfo = new Map();
  const courseThumbIdMap = new Map();
  const thumbIds = [];
  for (const course of courseList.docs) {
    const nCount = await countDetail(course._id);
    const courseDetail = await Course.findOne({ _id: course._id });
    if (!courseDetail) {
      return res.json({
        status: respCode.INTERNAL_ERR,
        message: respCode.MSG_INTERNAL_ERR,
      });
    }
    courseInfo.set(course._id, {
      nStudents: nCount.nStudents,
      nLessons: nCount.nLessons,
      name: courseDetail.name,
      thumb: courseDetail.thumb,
    });
    thumbIds.push(courseDetail.thumb);
    courseThumbIdMap.set(courseDetail.thumb, course._id);
  }
  const thumIdSignedUrlMap = await resourceModel.getSignedUrls(
    thumbIds,
    DEFAULT_TIME_IN_SEC
  );
  const courseInfoResponse = {};
  for (const [key, value] of courseInfo) {
    courseInfoResponse[key] = value;
  }
  thumIdSignedUrlMap.forEach((signedUrl, thumbId) => {
    courseInfoResponse[courseThumbIdMap.get(thumbId)].thumbUrl = signedUrl;
  });
  return res.json({
    status: respCode.SUCCESS,
    data: {
      course: courseList,
      coursesInfo: courseInfoResponse,
    },
  });
});
router.post(
  "/create",
  authenMw.stopWhenNotLogon,
  authenMw.stopWhenNotAdmin,
  async (req, res) => {
    const { name, description, requirement, thumb } = req.body;
    if (
      typeof name !== "string" ||
      typeof description !== "string" ||
      typeof requirement !== "string"
    )
      return res.json({
        status: respCode.INVALID_DATA,
        message: respCode.MSG_INVALID_DATA,
      });
    // const existedThumb = await Resource.findOne({ _id: thumb });
    // if (!existedThumb)
    //   return res.json({
    //     status: respCode.INVALID_DATA,
    //     message: respCode.MSG_INVALID_DATA,
    //   });
    //   console.log(existedThumb)
    // if (existedThumb.type !== RESOURCE_TYPE.VIDEO)
    //   return res.json({
    //     status: respCode.INVALID_DATA,
    //     message: respCode.MSG_INVALID_DATA,
    //   });

    // const taUsers = await User.find({ role: ROLE.TA });
    // const taIds = taUsers.map((ta) => ta._id);
    // if (!checkExistTa(tutors, taIds))
    //   return res.status(400).json({
    //     status: respCode.INVALID_DATA,
    //     message: respCode.MSG_INVALID_TUTORS,
    //   });
    try {
      const id = getNewObjectId().toString();
      await Course.create({
        _id: id,
        name: name,
        description: description,
        requirement: requirement,
        thumb: thumb,
        isVisible: true,
        tutors: [],
      });
      return res.status(200).json({
        status: respCode.SUCCESS,
        data: {
          _id: id,
          name: name,
          description: description,
          requirement: requirement,
          thumb: thumb,
          isVisible: true,
        },
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        status: respCode.INTERNAL_ERR,
        message: respCode.MSG_INTERNAL_ERR,
      });
    }
  }
);
router.get("/get-resources", async (req, res) => {
  const { page, limit, courseId } = req.query;
  if (
    !numberUtils.isNumberic(page) ||
    !numberUtils.isNumberic(limit) ||
    !validator.isValidStr(courseId) ||
    numberUtils.toNum(page) < 0 ||
    numberUtils.toNum(limit) <= 0
  ) {
    return res.json({
      status: respCode.INVALID_DATA,
      message: respCode.MSG_INVALID_DATA,
    });
  }

  const uid = authenModel.getUidFromReq(req);
  const user = await userModel.getRole(uid);
  console.log(user);
  if (
    !courseModel.isVisible(courseId) &&
    user.role !== ROLE.ADMIN &&
    user.role !== ROLE.TA
  ) {
    return res.json({
      status: respCode.SUCCESS,
      data: null,
    });
  }

  const resources = await resourceModel.getMore(
    { courses: { $in: [courseId] } },
    numberUtils.toNum(page),
    numberUtils.toNum(limit),
    "_id uploaderId name size createdAt status type"
  );
  return res.json({
    status: respCode.SUCCESS,
    data: resources && resources.docs.length !== 0 ? resources : null,
  });
});

router.get("/recommend-courses", async (req, res) => {
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

  const courses = await courseModel.getTopCoursesByStudentEnroll(
    numberUtils.toNum(page),
    numberUtils.toNum(limit)
  );
  let dataRet = { courses };
  const courseThumbIdMap = new Map();
  const thumbIds = [];
  if (!courses || courses.docs.length === 0 || courses.totalDocs === 0) {
    // All courses have no students
    const latestCourses = await courseModel.getMore(
      { isVisible: true },
      page,
      limit,
      "_id name thumb"
    );
    const docs = [];
    for (let i = 0; i < latestCourses.docs.length; i++) {
      docs.push({ _id: latestCourses.docs[i]._id, nStudents: 0 });
      dataRet.coursesInfo[latestCourses.docs[i]._id] = {
        name: latestCourses.docs[i].name,
        thumb: latestCourses.docs[i].thumb,
      };
      courseThumbIdMap.set(
        latestCourses.docs[i].thumb,
        latestCourses.docs[i]._id
      );
      thumbIds.push(latestCourses.docs[i].thumb);
    }
    dataRet.courses = {
      ...latestCourses,
      docs,
    };
  }

  // Get courseIds
  const coursesIds = [];
  for (let i = 0; i < dataRet.courses.docs.length; i++) {
    coursesIds.push(dataRet.courses.docs[i]._id);
  }

  // Get courses info
  if (!dataRet.coursesInfo) {
    dataRet.coursesInfo = {};
    for (let i = 0; i < dataRet.courses.docs.length; i++) {
      dataRet.coursesInfo[dataRet.courses.docs[i]._id] = {
        ...(dataRet.coursesInfo[dataRet.courses.docs[i]._id]
          ? dataRet.coursesInfo[dataRet.courses.docs[i]._id]
          : {}),
        nLessons: 0,
      };
    }
    const coursesInfoMap = await courseModel.multiGet(
      coursesIds,
      "_id name thumb"
    );

    coursesInfoMap.forEach((value, _id) => {
      if (value) {
        dataRet.coursesInfo[_id] = {
          ...dataRet.coursesInfo[_id],
          name: value.name,
          thumb: value.thumb,
        };
        courseThumbIdMap.set(value.thumb, _id);
        thumbIds.push(value.thumb);
      }
    });
  }

  // Get total lessons of each course
  const lessonsCount = await lessonModel.multiCountLessons(coursesIds);
  for (let i = 0; i < lessonsCount.length; i++) {
    const { _id, nLessons } = lessonsCount[i];
    dataRet.coursesInfo[_id].nLessons = nLessons;
  }
  for (let i = 0; i < coursesIds.length; i++) {
    if (typeof dataRet.coursesInfo[coursesIds[i]].nLessons === "undefined") {
      dataRet.coursesInfo[coursesIds[i]].nLessons = 0;
    }
  }

  // Get thumb urls of each course
  console.log(courseThumbIdMap);
  console.log(thumbIds);
  const thumbIdSignedUrlMap = await resourceModel.getSignedUrls(
    thumbIds,
    DEFAULT_TIME_IN_SEC
  );
  console.log(thumbIdSignedUrlMap);
  thumbIdSignedUrlMap.forEach((signedUrl, thumbId) => {
    dataRet.coursesInfo[courseThumbIdMap.get(thumbId)].thumbUrl = signedUrl;
  });

  return res.json({
    status: respCode.SUCCESS,
    data: dataRet,
  });
});
router.get("/:id/lessons", async (req, res) => {
  const id = req.params.id;
  const uid = authenModel.getUidFromReq(req);
  const user = await userModel.getRole(uid);
  console.log(user);
  if (!courseModel.isVisible(id) && user.role !== ROLE.ADMIN) {
    return res.json({
      status: respCode.SUCCESS,
      data: null,
    });
  }
  try {
    const lessons = await Lesson.find({ course: id });
    return res.json({
      status: respCode.SUCCESS,
      data: lessons,
    });
  } catch (error) {
    if (error)
      return res.status(500).json({
        status: respCode.INTERNAL_ERR,
        message: respCode.MSG_INTERNAL_ERR,
      });
  }
});
router.get("/:id", async (req, res) => {
  const id = req.params.id;
  const uid = authenModel.getUidFromReq(req);
  const user = await userModel.getRole(uid);
  if (!courseModel.isVisible(id) && user.role !== ROLE.ADMIN) {
    return res.json({
      status: respCode.SUCCESS,
      data: null,
    });
  }
  const coursesInfo = await Course.findOne({ _id: id });
  if (!coursesInfo)
    return res.json({
      status: respCode.INVALID_DATA,
      message: respCode.COURSE.INVALID_COURSE,
    });
  const isRegisterCourse = await userCourseModel.isRegisterCourse(uid, id);
  const tutors = coursesInfo.tutors;
  let tutorsInfo = [];
  for (const tutor of tutors) {
    const tutorInfo = await User.findOne({ _id: tutor });
    if (tutorInfo) {
      tutorsInfo.push({
        _id: tutorInfo.id,
        name: tutorInfo.name,
        email: tutorInfo.email,
        status: tutorInfo.status,
        addr: tutorInfo.addr,
      });
    }
  }
  const thumIdSignedUrlMap = await resourceModel.getSignedUrls(
    [coursesInfo.thumb],
    DEFAULT_TIME_IN_SEC
  );
  console.log(uid);
  res.status(200).json({
    status: respCode.SUCCESS,
    data: {
      name: coursesInfo.name,
      tutors: coursesInfo.tutors,
      description: coursesInfo.description,
      thumb: coursesInfo.thumb,
      requirement: coursesInfo.requirement,
      isVisible: coursesInfo.isVisible,
      tutorsInfo: tutorsInfo,
      isRegisterCourse: isRegisterCourse,
      thumbUrl: thumIdSignedUrlMap.get(coursesInfo.thumb) || null,
    },
  });
});
router.get("/:id/topic", async (req, res) => {
  const id = req.params.id;
  const uid = authenModel.getUidFromReq(req);
  const user = await userModel.getRole(uid);
  console.log(user);
  if (!courseModel.isVisible(id) && user.role !== ROLE.ADMIN) {
    return res.json({
      status: respCode.SUCCESS,
      data: null,
    });
  }
  try {
    const topics = await Topic.find({ course: id });
    if (topics)
      return res.json({
        status: respCode.SUCCESS,
        data: topics,
      });
    return res.json({
      status: respCode.INTERNAL_ERR,
      message: respCode.MSG_INTERNAL_ERR,
    });
  } catch (error) {
    console.log(error);
  }
});
export default router;
