import { API } from "../common/api";
import { handleGet, handlePost } from "./fetch";

export async function getLessonExercises(
  lessonId,
  isGetTemplateLangIds = 0,
  isGetQuizCompletedStatus = 0
) {
  try {
    const res = await handleGet(
      API.GET_LESSON_EXERCISES(
        lessonId,
        isGetTemplateLangIds,
        isGetQuizCompletedStatus
      )
    );
    return res;
  } catch (error) {
    console.log(
      "🚀 ~ file: courseHelper.js:44 ~ getCourseTopics ~ error:",
      error
    );
  }
}

export async function createQuiz(question, trueAnsIndex, answers) {
  try {
    const reqData = {
      question: question,
      trueAnsIndex: trueAnsIndex,
      answers: JSON.stringify(answers),
    };
    console.log(
      "🚀 ~ file: exerciseHelper.js:23 ~ createQuiz ~ reqData:",
      reqData
    );
    const res = await handlePost(API.CREATE_QUIZ, reqData);
    return res;
  } catch (error) {
    console.log("🚀 ~ file: exerciseHelper.js:26 ~ createQuiz ~ error:", error);
  }
}

export async function addQuizToLesson(lessonId, exerciseId) {
  try {
    const reqAdd = {
      lessonId,
      exerciseId: exerciseId,
    };
    const res = await handlePost(API.ADD_EXERCISES_LESSON, reqAdd);
    return res;
  } catch (error) {
    console.log(
      "🚀 ~ file: exerciseHelper.js:42 ~ addQuizToLesson ~ error:",
      error
    );
  }
}

export async function removeExerciseFromLesson(lessonId, exerciseId) {
  try {
    const reqRemove = {
      lessonId,
      exerciseId: exerciseId,
    };
    console.log(
      "🚀 ~ file: exerciseHelper.js:63 ~ removeExerciseFromLesson ~ reqRemove:",
      reqRemove
    );
    const res = await handlePost(API.REMOVE_EXERCISE, reqRemove);
    return res;
  } catch (error) {
    console.log(
      "🚀 ~ file: exerciseHelper.js:59 ~ removeExerciseFromLesson ~ error:",
      error
    );
  }
}

export async function createCoding(
  question,
  examplesArr,
  testCasesArr,
  wall_time_limit,
  memory_limit,
  max_file_size,
  enable_network
) {
  try {
    const reqAdd = {
      question,
      examplesArr: JSON.stringify(examplesArr),
      testCasesArr: JSON.stringify(testCasesArr),
      wall_time_limit,
      memory_limit,
      max_file_size,
      enable_network,
    };
    console.log("🚀 ~ file: exerciseHelper.js:81 ~ reqAdd:", reqAdd);
    const res = await handlePost(API.CREATE_CODING, reqAdd);
    return res;
  } catch (error) {
    console.log("🚀 ~ file: exerciseHelper.js:92 ~ error:", error);
  }
}

// Code compile
// Run code
export async function runCode(src_code, langId, lessonId, exerciseId) {
  try {
    const reqAdd = {
      src_code,
      langId,
      lessonId,
      exerciseId,
    };
    console.log("🚀 ~ file: exerciseHelper.js:101 ~ runCode ~ reqAdd:", reqAdd);
    const res = await handlePost(API.RUN_CODE, reqAdd);
    return res;
  } catch (error) {
    console.log("🚀 ~ file: exerciseHelper.js:110 ~ runCode ~ error:", error);
  }
}

// Submit code
export async function submitCode(src_code, langId, lessonId, exerciseId) {
  try {
    const reqSubmit = {
      src_code,
      langId,
      lessonId,
      exerciseId,
    };

    const res = await handlePost(API.SUBMIT_CODE, reqSubmit);
    return res;
  } catch (error) {
    console.log(
      "🚀 ~ file: exerciseHelper.js:130 ~ submitCode ~ error:",
      error
    );
  }
}
export async function getLastRunCode(
  lessonId = "",
  exerciseId = "",
  isShortInfo = 0,
  isWait = 0
) {
  try {
    const res = await handleGet(
      API.LAST_RUN_CODE(lessonId, exerciseId, isShortInfo, isWait)
    );
    return res;
  } catch (error) {
    console.log(
      "🚀 ~ file: exerciseHelper.js:139 ~ getLastRunCode ~ error:",
      error
    );
  }
}
export async function getSubmitHistory(
  lessonId,
  exerciseId,
  page = 0,
  limit = 1,
  isDesc = 1
) {
  try {
    const res = await handleGet(
      API.GET_SUBMIT_HISTORY(lessonId, exerciseId, page, limit, isDesc)
    );
    return res;
  } catch (error) {
    console.log(
      "🚀 ~ file: exerciseHelper.js:139 ~ getLastRunCode ~ error:",
      error
    );
  }
}
export async function getSubmitInfo(submissionId) {
  try {
    const res = await handleGet(API.GET_SUBMIT_INFO(submissionId));
    return res;
  } catch (error) {
    console.log("🚀 ~ file: exerciseHelper.js:158 ~ error:", error);
  }
}
