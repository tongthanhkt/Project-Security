import { API } from "../common/api";
import { handleGet, handlePost, handlePut } from "./fetch";

// ******* COURSE ********
export const getCourseDetail = async (course_id) => {
  try {
    const res = await handleGet(`${API.COURSE_DETAIL}/${course_id}`);
    return res.data;
  } catch (error) {
    console.log(
      "🚀 ~ file: courseHelper.js:5 ~ getCourseDetailList ~ error:",
      error
    );
  }
};
export const getListAllCourse = async (page, itemPerPage = 7) => {
  const res = await handleGet(`${API.GET_ALL_COURSE(page, itemPerPage)}`);
  return res;
};
export const changeStudentCourse = (courses) => {
  const newList = courses?.map((item) => {
    return {
      _id: item._id,
      // image: item.thumb,
      image: "/images/course/angular_course.png",
      title: item.name,
      students: item.nStudents,
      lessions: item.nLessions,
    };
  });
  return newList;
};

export const createNewCourse = async (createData) => {
  try {
    const res = handlePost(API.CREATE_COURSE, createData);
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const assignListTAForCourse = async (idCourse, listTAIds) => {
  const data = {
    ids: listTAIds,
  };
  try {
    console.log("listTAIds", listTAIds);
    const res = await handlePost(API.ASSIGN_TA_FOR_COURSE(idCourse), data);
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const searchCourseByKey = async (key, page, itemPerPage) => {
  try {
    const res = await handleGet(
      API.SEARCH_COURSE_BY_KEY(key, page, itemPerPage)
    );
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const updateCourseInfo = async (id, updateData) => {
  try {
    const res = await handlePut(API.UPDATE_COURSE_INFO(id), updateData);
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const updateListTAForCourse = async (id, listTAIds) => {
  const data = {
    ids: listTAIds,
  };
  try {
    const res = await handlePut(API.UPDATE_TA_FOR_COURSE(id), data);
    return res;
  } catch (error) {
    console.log(error);
  }
};
// export const getCourseDetailList = async (courses = []) => {
//   const temp = [];
//   const detailCourses = courses.map((course) =>
//     getCourseDetail(course.course).then((res) => {
//       temp.push(res);
//     })
//   );

//   return temp;
// };

// ******* TOPIC ********
export const getCourseTopics = async (courseId) => {
  try {
    const res = await handleGet(API.GET_LIST_TOPIC(courseId));
    return res;
  } catch (error) {
    console.log(
      "🚀 ~ file: courseHelper.js:44 ~ getCourseTopics ~ error:",
      error
    );
  }
};

// ******* LESSON ********
export const getTopicLessons = async (topicId) => {
  try {
    const res = await handleGet(API.GET_LIST_LESSON(topicId));
    return res;
  } catch (error) {
    console.log(
      "🚀 ~ file: courseHelper.js:57 ~ getTopicLessons ~ error:",
      error
    );
  }
};
export const createLesson = async (courseId, data) => {
  try {
    const res = await handlePost(API.CREATE_LESSON(courseId), { ...data });
    return res;
  } catch (error) {
    console.log(
      "🚀 ~ file: courseHelper.js:110 ~ createLesson ~ error:",
      error
    );
  }
};
export const completeLesson = async (lessonId) => {
  try {
    const res = await handlePost(API.COMPLETE_LESSON(lessonId), {});
    return res;
  } catch (error) {
    console.log(
      "🚀 ~ file: courseHelper.js:110 ~ createLesson ~ error:",
      error
    );
  }
};
export const getLessonDetail = async (lessonId) => {
  try {
    const res = await handleGet(API.GET_LESSON_DETAIL(lessonId));
    return res;
  } catch (error) {
    console.log(
      "🚀 ~ file: courseHelper.js:57 ~ getTopicLessons ~ error:",
      error
    );
  }
};
