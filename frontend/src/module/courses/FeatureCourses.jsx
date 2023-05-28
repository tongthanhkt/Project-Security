/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import _ from "lodash";
import BasicTitle from "../../components/title/BasicTitle";
import uuid from "react-uuid";
import CourseList from "./CourseList";
import { usePasssed } from "../../contexts/passedContext";
import { handleGet } from "../../utils/fetch";
import { API } from "../../common/api";
import {
  mergeTwoArrSameKey,
  mergeTwoCourseSameId,
} from "../../utils/fileHelper";
import { changeStudentCourse } from "../../utils/courseHelper";
const courses = [
  {
    image: "/images/course/react_course.png",
    title: "React Font to Back",
    students: 20,
    lessions: 50,
  },
  {
    image: "/images/course/js_course.png",
    title: "React Font to Back",
    students: 20,
    lessions: 50,
  },
  {
    image: "/images/course/node_course.png",
    title: "React Font to Back",
    students: 20,
    lessions: 50,
  },
  {
    image: "/images/course/angular_course.png",
    title: "React Font to Back",
    students: 20,
    lessions: 50,
  },
];
const FeatureCourses = () => {
  const { listPassed } = usePasssed();
  const [recommendCourses, setRecommendedCourses] = useState([]);
  useEffect(() => {
    const getData = async () => {
      const params = "page=0&limit=4";
      try {
        const res = await handleGet(`${API.RECOMMEND_COURSES}?${params}`);

        const { docs: courseGens } = res?.data?.courses;

        const { coursesInfo } = res?.data;

        //tạo mảng mới có _id là key của obj
        const courseArr = Object.entries(coursesInfo).map(([key, value]) => ({
          _id: key,
          ...value,
        }));

        let courses = mergeTwoArrSameKey(courseArr, courseGens, "_id");
        courses = changeStudentCourse(courses);

        setRecommendedCourses(courses);
      } catch (error) {
        console.log(
          "🚀 ~ file: FeatureCourses.jsx:46 ~ getData ~ error:",
          error
        );
      }
    };
    getData();
  }, []);
  return (
    <div
      id="st2"
      className={`mb-24 mt-36 wrapper ${
        listPassed.includes(1) && "fade-in-from-bottom"
      }`}
    >
      <BasicTitle>Khóa học nổi bật miễn phí</BasicTitle>
      <CourseList courses={recommendCourses} />
    </div>
  );
};

export default FeatureCourses;
