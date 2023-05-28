import axios from "axios";

export const handlePost = async (api, data) => {
  try {
    const resp = await axios.post(api, data);
    return resp.data;
  } catch (error) {
    console.log("🚀 ~ file: fetch.js:8 ~ handlePost ~ error", error);
  }
};

export const handleGet = async (api) => {
  try {
    const resp = await axios.get(api);
    return resp.data;
  } catch (error) {
    console.log("🚀 ~ file: fetch.js ~ line 16 ~ handleGet ~ error", error);
  }
};

export const handlePut = async (api, data) => {
  try {
    const resp = await axios.put(api, data);
    return resp;
  } catch (error) {
    console.log(error);
  }
};

export const handleDelete = async (api, data) => {
  try {
    const resp = await axios.delete(api, { data });
    return resp;
  } catch (error) {
    console.log(error);
  }
};

export const reactQueryKey = {
  COURSER_CHAPTER: (courseId) =>
    courseId ? ["courseTopic", courseId] : "courseTopic",
  TOPIC_LESSON: (topicId) =>
    topicId ? ["topicLesson", topicId] : "topicLesson",
  LESSON_RESOURCE: (lessonId) =>
    lessonId ? ["lessonResource", lessonId] : "lessonResource",

  // Exercises
  LESSON_EXERCISES: (lessonId) =>
    lessonId ? ["lessonExercise", lessonId] : "lessonExercise",

  // Submit code
  SUBMIT_CODE_HISTORY: (lessonId, exerciseId) =>
    lessonId && exerciseId
      ? ["submitCodeHistory", lessonId, exerciseId]
      : "submitCodeHistory",
  SUBMIT_CODE_INFO: (lessonId, exerciseId, submitId) =>
    lessonId && exerciseId && submitId
      ? ["submitCodeInfo", lessonId, exerciseId, submitId]
      : "submitCodeInfo",

  // Template
  TEMPLATE_INFO: (lessonId, exerciseId, langId) =>
    lessonId && exerciseId && langId
      ? ["templateInfo", lessonId, exerciseId, langId]
      : "templateInfo",
};
