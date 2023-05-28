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
import Lesson from "../schemas/lessonSchema.js";
import Resource from "../schemas/resourceSchema.js";
import respCode from "../utils/respCode.js";
import RESP from "../utils/respCode.js";
import userModel from "../model/user.model.js";
import validator from "../utils/validator.js";
import exerciseModel from "../model/exercise.model.js";
import UserLesson from "../schemas/userLessonSchema.js";
import topicModel from "../model/topic.model.js";
import { getNewObjectId, ROLE } from "../utils/database.js";
import userNoteModel from "../model/userNote.model.js";
import UserNoteSchema from "../schemas/userNotesSchema.js";
import userLessonModel from "../model/userLesson.model.js";
const router = express.Router();

async function validateExerciseReq(req, res) {
  const { lessonId, exerciseId } = req.body;
  if (!validator.isValidStr(lessonId) || !validator.isValidStr(exerciseId)) {
    res.json({
      status: RESP.INVALID_DATA,
      message: RESP.MSG_INVALID_DATA,
    });
    return null;
  }

  const ownerId = authenModel.getUidFromReq(req);
  const lesson = await lessonModel.findById(lessonId);
  const exercise = await exerciseModel.findById(exerciseId);

  if (!lesson || !exercise) {
    res.json({
      status: RESP.NOT_FOUND,
      message: RESP.MSG_NOT_FOUND,
    });
    return null;
  }

  const user = await userModel.getRole(ownerId);
  if (user && user.role === ROLE.ADMIN) {
    return {
      exerciseId,
      lessonId,
      ownerId,
      lesson,
      exercise,
    };
  }
  if (!(await courseModel.isTutorAssigned(ownerId, lesson.course))) {
    res.json({
      status: RESP.NOT_FOUND,
      message: RESP.MSG_NOT_FOUND,
    });
    return null;
  }

  return {
    exerciseId,
    lessonId,
    ownerId,
    lesson,
    exercise,
  };
}

async function validateReq(req, res) {
  const { resourceId, lessonId } = req.body;
  if (
    !resourceId ||
    resourceId.toString().trim().length === 0 ||
    !lessonId ||
    lessonId.toString().trim().length === 0
  ) {
    res.json({
      status: RESP.INVALID_DATA,
      message: RESP.MSG_INVALID_DATA,
    });
    return null;
  }

  const ownerId = authenModel.getUidFromReq(req);
  const lesson = await lessonModel.findById(lessonId);
  const resource = await resourceModel.findById(resourceId);

  if (!lesson || !resource) {
    res.json({
      status: RESP.NOT_FOUND,
      message: RESP.MSG_NOT_FOUND,
    });
    return null;
  }

  const user = await userModel.getRole(ownerId);
  if (user && user.role === ROLE.ADMIN) {
    return {
      resourceId,
      lessonId,
      ownerId,
      lesson,
      resource,
    };
  }
  if (!(await courseModel.isTutorAssigned(ownerId, lesson.course))) {
    res.json({
      status: RESP.NOT_FOUND,
      message: RESP.MSG_NOT_FOUND,
    });
    return null;
  }

  return {
    resourceId,
    lessonId,
    ownerId,
    lesson,
    resource,
  };
}

router.get(
  "/list-by-topic/:id",
  authenMw.stopWhenNotLogon,
  async (req, res) => {
    const uuid = authenModel.getUidFromReq(req);
    const topic_id = req.params.id;
    if (!topic_id)
      return res.json({
        status: respCode.SUCCESS,
        message: respCode.MSG_INVALID_DATA,
      });
    const lessonList = await lessonModel.findLessonsByTopic(topic_id);
    for (const lesson of lessonList) {
      if (await userLessonModel.isCompleteLesson(uuid, lesson._id)) {
        lesson.isDone = true;
      } else lesson.isDone = false;
      lesson.videoResource = { length: null };
      for (const resource of lesson.resources) {
        const resourceData = await resourceModel.findById(resource);
        if (resourceData.type === RESOURCE_TYPE.VIDEO) {
          console.log(resourceData);
          lesson.videoResource = { length: resourceData.length };
          break;
        }
      }
    }
    return res.json({
      status: respCode.SUCCESS,
      data: lessonList,
    });
  }
);

router.get("/:id/list-resource", async (req, res) => {
  const lessonId = req.params.id;
  const uid = authenModel.getUidFromReq(req);
  const user = await userModel.getRole(uid);
  console.log(user);
  if (!courseModel.isVisible(lessonId) && user.role !== ROLE.ADMIN) {
    return res.json({
      status: respCode.SUCCESS,
      data: null,
    });
  }
  try {
    const lessonInfo = await Lesson.findOne({ _id: lessonId });
    if (!lessonInfo) {
      return res.json({
        status: respCode.INVALID_DATA,
        message: respCode.MSG_INVALID_DATA,
      });
    }
    const resourceIds = lessonInfo.resources;
    let resourcesInfo = [];
    console.log(resourceIds);
    for (const id of resourceIds) {
      const resourceInfo = await Resource.findOne({ _id: id });
      if (resourceInfo) resourcesInfo.push(resourceInfo);
    }
    console.log(resourcesInfo);
    return res.json({
      status: respCode.SUCCESS,
      data: {
        _id: lessonInfo._id,
        ts: lessonInfo.ts,
        topic: lessonInfo.topic,
        description: lessonInfo.description,
        resource: resourcesInfo,
        exercises: lessonInfo.exercises,
        isVisible: lessonInfo.isVisible,
      },
    });
  } catch (error) {
    console.log(error);
    if (error)
      res.status(500).json({
        status: respCode.INTERNAL_ERR,
        message: respCode.MSG_INTERNAL_ERR,
      });
  }
});

router.post(
  "/add-resource",
  authenMw.stopWhenNotLogon,
  authenMw.stopWhenNotAdminOrTA,
  async (req, res) => {
    const validRequest = await validateReq(req, res);
    if (!validRequest) {
      return;
    }

    const { resourceId, lessonId, ownerId, lesson, resource } = validRequest;

    if (!lesson.resources.includes(resourceId)) {
      lesson.resources.push(resourceId);
      if (!(await lessonModel.save(lesson))) {
        return res.json({
          status: RESP.INTERNAL_ERR,
          message: RESP.MSG_INTERNAL_ERR,
        });
      }
    }
    if (!resource.courses.includes(lesson.course)) {
      resource.courses.push(lesson.course);
      if (!(await resourceModel.save(resource))) {
        return res.json({
          status: RESP.INTERNAL_ERR,
          message: RESP.MSG_INTERNAL_ERR,
        });
      }
    }

    return res.json({
      status: RESP.SUCCESS,
    });
  }
);

router.post(
  "/remove-resource",
  authenMw.stopWhenNotLogon,
  authenMw.stopWhenNotAdminOrTA,
  async (req, res) => {
    const validRequest = await validateReq(req, res);
    if (!validRequest) {
      return;
    }

    const { resourceId, lessonId, ownerId, lesson, resource } = validRequest;
    if (lesson.resources.includes(resourceId)) {
      lesson.resources.splice(lesson.resources.indexOf(resourceId), 1);
      if (!(await lessonModel.save(lesson))) {
        return res.json({
          status: RESP.INTERNAL_ERR,
          message: RESP.MSG_INTERNAL_ERR,
        });
      }
    }

    if (
      (await lessonModel.countLessonByCourseAndRes(
        lesson.course,
        resourceId
      )) === 0
    ) {
      resource.courses.splice(resource.courses.indexOf(lesson.course), 1);
      if (!(await resourceModel.save(resource))) {
        return res.json({
          status: RESP.INTERNAL_ERR,
          message: RESP.MSG_INTERNAL_ERR,
        });
      }
    }

    return res.json({
      status: RESP.SUCCESS,
    });
  }
);

router.post(
  "/add-exercise",
  authenMw.stopWhenNotLogon,
  authenMw.stopWhenNotAdminOrTA,
  async (req, res) => {
    const validRequest = await validateExerciseReq(req, res);
    if (!validRequest) {
      return;
    }

    const { exerciseId, lessonId, ownerId, lesson, exercise } = validRequest;
    if (!lesson.exercises.includes(exerciseId)) {
      lesson.exercises.push(exerciseId);
      if (!(await lessonModel.save(lesson))) {
        return res.json({
          status: RESP.INTERNAL_ERR,
          message: RESP.MSG_INTERNAL_ERR,
        });
      }
    }

    return res.json({
      status: RESP.SUCCESS,
    });
  }
);

router.post(
  "/remove-exercise",
  authenMw.stopWhenNotLogon,
  authenMw.stopWhenNotAdminOrTA,
  async (req, res) => {
    const validRequest = await validateExerciseReq(req, res);
    if (!validRequest) {
      return;
    }

    const { exerciseId, lessonId, ownerId, lesson, exercise } = validRequest;
    if (!lesson.exercises.includes(exerciseId)) {
      return res.json({
        status: RESP.NOT_FOUND,
        message: RESP.MSG_NOT_FOUND,
      });
    }
    lesson.exercises.splice(lesson.exercises.indexOf(exerciseId), 1);
    if (!(await lessonModel.save(lesson))) {
      return res.json({
        status: RESP.INTERNAL_ERR,
        message: RESP.MSG_INTERNAL_ERR,
      });
    }

    // only delete exercise permanently from database when it does not linked to any other lessons
    const lessonPaging = await lessonModel.getMore(
      {
        _id: { $ne: lessonId },
        exercises: { $in: [exerciseId] },
      },
      0,
      1
    );
    if (lessonPaging.docs.length === 0) {
      // asynchronously remove exercise if nobody do that exercise (user_code, user_quiz)
      exerciseModel.remove(exerciseId, exercise.type);
    }
    return res.json({
      status: RESP.SUCCESS,
    });
  }
);
// router.get("/lesson-of-topic/:id", async (req, res) => {
//   const uid = authenModel.getUidFromReq(req);
//   const topicId = req.params.id;
//   if (!topicModel.isExist(topicId))
//     return res.json({
//       status: respCode.INVALID_DATA,
//       message: respCode.TOPIC.NOT_EXIST,
//     });
//   // Get all lesson of topic
//   const lessonList = await Lesson.find({ topic: topicId });
//   // get all lesson user completed
//   const userLessons = await UserLesson.find({ student: uid });
//   const userLessonIds = userLessons.map((userLesson) => userLesson.lesson);
//   let completedLessons = new Map();
//   console.log(lessonList);
//   for (const lesson of lessonList) {
//     let isCompleted = userLessonIds.includes(lesson._id);
//     console.log(isCompleted);
//     completedLessons.set(lesson._id, isCompleted);
//   }
//   let completedLessonObj = {};
//   for (const [key, value] of completedLessons) {
//     completedLessonObj[key] = value;
//   }
//   return res.json({
//     status: respCode.SUCCESS,
//     data: {
//       lessonList: lessonList,
//       completedLessons: completedLessonObj,
//     },
//   });
// });
router.post(
  "/complete-lesson/:id",
  authenMw.stopWhenNotStudent,
  async (req, res) => {
    const lessionId = req.params.id;
    const studentId = authenModel.getUidFromReq(req);
    const id = getNewObjectId().toString();
    if (!lessonModel.isExist(lessionId || !NaN(mark))) {
      return res.json({
        status: respCode.INVALID_DATA,
        message: respCode.MSG_INVALID_DATA,
      });
    }
    const isExist = await UserLesson.findOne({
      student: studentId,
      lesson: lessionId,
    });
    if (isExist) {
      return res.json({
        status: respCode.INVALID_DATA,
        message: respCode.USER_LESSON.EXIST,
      });
    }
    let newUserLesson = new UserLesson({
      _id: id,
      student: studentId,
      lesson: lessionId,
      isDone: true,
      mark: null,
    });
    newUserLesson.save(function (err) {
      if (err) {
        return res.json({
          status: respCode.INTERNAL_ERR,
          message: respCode.MSG_INTERNAL_ERR,
        });
      }
      return res.json({
        status: respCode.SUCCESS,
        data: newUserLesson,
      });
    });
  }
);
router.post(
  "/:id/update-note",
  authenMw.stopWhenNotStudent,
  async (req, res) => {
    const lessonId = req.params.id;
    const { noteId, startTs, endTs, note } = req.body;
    const studentId = authenModel.getUidFromReq(req);
    if (!lessonModel.isExist(lessonId))
      return res.json({
        status: respCode.INVALID_DATA,
        message: respCode.LESSON.EXIST,
      });
    const existUserNote = await userNoteModel.findOne(studentId, lessonId);
    if (!existUserNote)
      return res.json({
        status: respCode.INVALID_DATA,
        message: respCode.USER_NOTE.EXIST,
      });
    if (!noteId || !startTs || !endTs || !note)
      return res.json({
        status: respCode.INVALID_DATA,
        message: respCode.USER_LESSON.REQUIRED,
      });
    const notes = existUserNote.notes;
    for (const item of notes) {
      if (item._id === noteId) {
        item.startTs = startTs;
        item.endTs = endTs;
        item.note = note;
        item.ts = new Date().getTime();
      }
    }
    try {
      await UserNoteSchema.updateOne(
        { student: studentId, lesson: lessonId },
        {
          notes: notes,
        }
      );
      return res.json({
        status: respCode.SUCCESS,
        data: existUserNote,
      });
    } catch (error) {
      return res.json({
        status: respCode.INTERNAL_ERR,
        message: respCode.MSG_INTERNAL_ERR,
      });
    }
  }
);
router.delete(
  "/:id/delete-note",
  authenMw.stopWhenNotStudent,
  async (req, res) => {
    const { noteId } = req.body;
    const lessonId = req.params.id;
    const studentId = authenModel.getUidFromReq(req);
    if (!lessonModel.isExist(lessonId))
      return res.json({
        status: respCode.INVALID_DATA,
        message: respCode.LESSON.EXIST,
      });
    const existUserNote = await userNoteModel.findOne(studentId, lessonId);
    if (!existUserNote)
      return res.json({
        status: respCode.INVALID_DATA,
        message: respCode.USER_NOTE.EXIST,
      });
    const newNotes = existUserNote.notes.filter((note) => note._id !== noteId);
    existUserNote.notes = newNotes;
    console.log(existUserNote);
    try {
      await UserNoteSchema.updateOne(
        { student: studentId, lesson: lessonId },
        { notes: newNotes }
      );
      return res.json({
        status: respCode.SUCCESS,
        data: existUserNote,
      });
    } catch (error) {
      return res.json({
        status: respCode.INTERNAL_ERR,
        message: respCode.MSG_INVALID_DATA,
      });
    }
  }
);
router.post(
  "/:id/create-note",
  authenMw.stopWhenNotStudent,
  async (req, res) => {
    const lessonId = req.params.id;
    if (!lessonModel.isExist(lessonId))
      return res.json({
        status: respCode.INVALID_DATA,
        message: respCode.LESSON.INVALID_LESSON,
      });
    const studentId = authenModel.getUidFromReq(req);
    const { startTs, endTs, note } = req.body;
    const newNote = req.body;
    console.log(req.body);
    if (isNaN(startTs) || isNaN(endTs) || !note)
      return res.json({
        status: respCode.INVALID_DATA,
        message: respCode.MSG_INVALID_DATA,
      });
    const existUserNote = await userNoteModel.findOne(studentId, lessonId);
    if (existUserNote) {
      console.log(existUserNote);
      const response = userNoteModel.createNewNote(existUserNote, newNote);
      if (response)
        return res.json({
          status: respCode.SUCCESS,
          message: respCode.MSG_SUCCESS,
        });
      return res.json({
        status: respCode.INTERNAL_ERR,
        message: respCode.MSG_INTERNAL_ERR,
      });
    }
    const userNote = new UserNoteSchema({
      _id: getNewObjectId().toString(),
      student: studentId,
      lesson: lessonId,
      notes: [
        {
          _id: getNewObjectId().toString(),
          startTs: startTs,
          endTs: endTs,
          note: note,
          ts: new Date().getTime(),
        },
      ],
    });
    try {
      console.log(userNote);
      await userNote.save();

      return res.json({
        status: respCode.SUCCESS,
        message: respCode.MSG_SUCCESS,
      });
    } catch (error) {
      return res.json({
        status: respCode.INTERNAL_ERR,
        message: respCode.MSG_INTERNAL_ERR,
      });
    }
  }
);

router.get("/:id/list-note", authenMw.stopWhenNotStudent, async (req, res) => {
  const lessonId = req.params.id;
  const studentId = authenModel.getUidFromReq(req);

  if (!lessonModel.isExist(lessonId))
    return res.json({
      status: respCode.INVALID_DATA,
      message: respCode.LESSON.INVALID_LESSON,
    });
  const lessonInfo = await Lesson.findOne({ _id: lessonId });
  console.log(lessonInfo);
  const userNote = await userNoteModel.findOne(studentId, lessonId);
  if (userNote) {
    userNote.lesson = lessonInfo._id;
  }

  if (!userNote)
    return res.json({
      status: respCode.INTERNAL_ERR,
      message: respCode.MSG_INTERNAL_ERR,
    });
  return res.json({
    status: respCode.SUCCESS,
    data: {
      userNote,
      topicId: lessonInfo.topic || null,
    },
  });
});

export default router;
