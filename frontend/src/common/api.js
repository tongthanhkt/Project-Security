export const API = {
  LOGOUT: "/api/authen/logout",
  LOGIN: "/api/authen/login",
  LOGIN_GOOGLE: "/api/authen/google",
  REGISTER: "/api/authen/register",
  CREATE_MEETING: "/api/meeting/create",
  JOIN_MEETING: "/api/meeting/join",
  EXTEND_MEETING: "/api/meeting/extend-time",

  // Profile
  UPDATE_AVATAR: "/api/profile/avatar/update",
  REMOVE_AVATAR: "/api/profile/avatar/remove",

  // Upload
  UPLOAD_INIT: "api/upload/start-upload",
  UPLOAD_PART: "api/upload/part-upload",
  UPLOAD_COMPLETE: "api/upload/complete-upload",
  REMOVE_RESOURCE_PERMANENT: "/api/resource/remove",

  // Payment
  CREATE_ORDER: "/api/payment/create_payment_url",
  UPDATE_ORDER: "/api/payment/payment_update",
  RECEIVE_ORDER: "/api/payment/return_payment_results",

  // Topic
  GET_LIST_TOPIC: (courseId) => {
    return `/api/course/${courseId}/topic`;
  },
  CREATE_TOPIC: (courseId) => {
    return `/api/admin/create-topic/${courseId}`;
  },

  // Lesson
  ADD_RESOURCE: "/api/lesson/add-resource",
  REMOVE_RESOURCE: "/api/lesson/remove-resource",
  GET_LIST_RESOURCE: (lessonId) => {
    return `/api/lesson/${lessonId}/list-resource`;
  },
  GET_LIST_LESSON: (topicId) => {
    return `/api/lesson/list-by-topic/${topicId}`;
  },
  GET_LESSON_DETAIL: (lessonId) => {
    return `/api/lesson/detail/${lessonId}`;
  },
  CREATE_LESSON: (courseId) => `/api/admin/create-lesson/${courseId}`,
  COMPLETE_LESSON: (lessonId) => `/api/lesson/complete-lesson/${lessonId}`,

  // Course
  COURSE_DETAIL: "/api/course",
  RECOMMEND_COURSES: "/api/course/recommend-courses",
  CREATE_COURSE: "/api/course/create",
  ASSIGN_TA_FOR_COURSE: (id) => `/api/admin/assign-ta-for-course/${id}`,
  GET_ALL_COURSE: (page, itemPerPage) =>
    `/api/course/list?page=${page}&limit=${itemPerPage}`,
  COURSES_OF_STUDENT: "/api/course/user",
  REGISTRY_COURSES: "/api/course/registry",
  SEARCH_COURSE_BY_KEY: (key, page, itemPerPage) =>
    `/api/course/list?page=${page}&limit=${itemPerPage}&search=${key}`,
  UPDATE_COURSE_INFO: (id) => `/api/course/update/${id}`,
  UPDATE_TA_FOR_COURSE: (id) => `/api/admin/update-tas-of-course/${id}`,

  // Exercise
  GET_LESSON_EXERCISES: (
    lessonId,
    isGetTemplateLangIds,
    isGetQuizCompletedStatus
  ) =>
    `/api/exercise/entire-list?lessonId=${lessonId}&isGetTemplateLangIds=${isGetTemplateLangIds}&isGetQuizCompletedStatus=${isGetQuizCompletedStatus}`,
  ADD_EXERCISES_LESSON: "/api/lesson/add-exercise",
  CREATE_QUIZ: "/api/exercise/quiz/create",
  REMOVE_EXERCISE: "/api/lesson/remove-exercise",
  CREATE_CODING: "/api/exercise/coding/create",

  // Test case
  CREATE_TEST_CASE: "/api/test-case/add",

  //note
  CREATE_NOTE: (id) => {
    return `/api/lesson/${id}/create-note`;
  },
  LIST_NOTE: (id) => {
    return `/api/lesson/${id}/list-note`;
  },
  DELETE_NOTE: (id) => {
    return `/api/lesson/${id}/delete-note`;
  },
  UPDATE_NOTE: (id) => {
    return `/api/lesson/${id}/update-note`;
  },

  // Run code
  RUN_CODE: "/api/exercise/coding/run",
  // Submit code
  SUBMIT_CODE: "/api/exercise/submit/coding/scoring",
  LAST_RUN_CODE: (lessonId, exerciseId, isShortInfo, isWait) =>
    `/api/exercise/coding/last-run-code?lessonId=${lessonId}&exerciseId=${exerciseId}&isShortInfo=${isShortInfo}&isWait=${isWait}`,
  GET_SUBMIT_HISTORY: (lessonId, exerciseId, page, limit, isDesc) => {
    return `/api/exercise/history/coding?lessonId=${lessonId}&exerciseId=${exerciseId}&page=${page}&limit=${limit}&isDesc=${isDesc}`;
  },
  GET_SUBMIT_INFO: (submissionId) => {
    return `/api/exercise/history/coding-submission-info?submissionId=${submissionId}`;
  },

  // Template
  CREATE_TEMPLATE: "/api/exercise/template/coding/create",
  GET_TEMPLATE: (lessonId, exerciseId, langId) =>
    `/api/exercise/template/coding/info?lessonId=${lessonId}&exerciseId=${exerciseId}&langId=${langId}`,
  DELETE_TEMPLATE: "/api/exercise/template/coding/remove",

  // TA
  SEARCH_TA: (key) => {
    return `/api/util/ta?search=${key}`;
  },
};

export const WS_API = {
  COLAB_CODE: "/ws/api/colab-code",
};
