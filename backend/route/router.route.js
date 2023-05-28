/* eslint-disable array-callback-return */
/* eslint-disable no-console */
/* eslint-disable import/extensions */
import apiTest from "../api/test.api.js";
import apiAuth from "../api/authen.api.js";
import apiUser from "../api/user.api.js";
import apiMeeting from "../api/meeting.api.js";
import apiUpload from "../api/upload.api.js";
import apiPayment from "../api/payment.api.js";
import apiResource from "../api/resource.api.js";
import apiCourse from "../api/course.api.js";
import apiCourse1 from "../api/course1.api.js";
import apiLesson from "../api/lesson.api.js";
import apiLesson1 from "../api/lesson1.api.js";
import apiExercise from "../api/exercise.api.js";
import apiTestCase from "../api/testCase.api.js";
import apiQuiz from "../api/quiz.api.js";
import apiUtil from "../api/util.api.js";
import apiCodingExercise from "../api/codingExercise.api.js";
import apiManageTA from "../api/manageTA.api.js";
import apiAdmin from "../api/admin.api.js";
import apiScoringExer from "../api/scoreCoding.api.js";
import apiExerHistory from "../api/exerHistory.api.js";
import apiMetrics from "../api/metric.api.js";
import apiTemplateCoding from "../api/templateCoding.api.js";
import apiAvatar from "../api/avatar.api.js";
import apiUserLessonComment from "../api/userCommentLesson.api.js";
import apiVerfiyUser from "../api/verifyUser.api.js";
import { initColabCodeWss } from "./ws/colabCode.ws.js";
import { initColabCodeWssV2 } from "./ws/colabCodeV2.ws.js";

export default (httpServer, httpsServer, app, ws, __dirname) => {
  // initColabCodeWss("/ws/api/colab-code", httpServer, httpsServer);
  initColabCodeWssV2("/ws/api/colab-code", app);

  app.use("/api", apiTest);
  app.use("/api/authen", apiAuth);
  app.use("/api/user/verify-status", apiVerfiyUser);
  app.use("/api/user", apiUser);
  app.use("/api/meeting", apiMeeting);
  app.use("/api/upload", apiUpload);
  app.use("/api/payment", apiPayment);
  app.use("/api/resource", apiResource);
  app.use("/api/lesson", apiLesson);
  app.use("/api/lesson", apiLesson1);
  app.use("/api/course", apiCourse);
  app.use("/api/course", apiCourse1);
  app.use("/api/exercise/quiz", apiQuiz);
  app.use("/api/exercise/coding", apiCodingExercise);
  app.use("/api/exercise/template/coding", apiTemplateCoding);
  app.use("/api/exercise/submit/coding", apiScoringExer);
  app.use("/api/exercise/history", apiExerHistory);
  app.use("/api/exercise", apiExercise);
  app.use("/api/test-case", apiTestCase);
  app.use("/api/util", apiUtil);
  app.use("/api/admin/manage-teaching-assistant", apiManageTA);
  app.use("/api/admin", apiAdmin);
  app.use("/api/profile/avatar", apiAvatar);
  app.use("/api/user-lesson-comments", apiUserLessonComment);
  app.use("/", apiMetrics);
  // Served react route

  // pathInfos.map((path) => {
  //   console.log(`init ${path}`);
  //   app.get(path, (req, res) => {
  //     return res.sendFile(`${__dirname}/build/index.html`);
  //   });
  // });
  app.get("/*", (req, res) => {
    return res.sendFile(`${__dirname}/build/index.html`);
  });
};
