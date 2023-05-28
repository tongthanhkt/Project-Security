import React, { useEffect, useRef, useState } from "react";
import uuid from "react-uuid";
import { useSelector } from "react-redux";
import { API } from "../../common/api";
import BasicPagination from "../../components/pagination/BasicPagination";
import BasicTitle from "../../components/title/BasicTitle";
import CourseList from "../../module/courses/CourseList";
import { handleGet } from "../../utils/fetch";
import BasicFilter from "./filter/BasicFilter";
import {
  changeStudentCourse,
  getCourseDetail,
  getCourseDetailList,
} from "../../utils/courseHelper";
import {
  mergeTwoArrSameKey,
  mergeTwoCourseSameId,
} from "../../utils/fileHelper";

const filters = [
  {
    id: uuid(),
    code: "all",
    name: "Tất cả",
  },
  {
    id: uuid(),
    code: "studying",
    name: "Đang học",
  },
  {
    id: uuid(),
    code: "done",
    name: "Đã hoàn thành",
  },
];

const ITEMS_PER_PAGE = 4;
const handleData = (res) => {
  const { docs: courseGens } = res?.data?.course;
  console.log(
    "🚀 ~ file: MyCoursePage.jsx:41 ~ handleData ~ courseGens:",
    courseGens
  );

  const { coursesInfo } = res?.data;

  //tạo mảng mới có _id là key của obj
  const courseArr = Object.entries(coursesInfo).map(([key, value]) => ({
    _id: key,
    ...value,
  }));
  console.log(
    "🚀 ~ file: MyCoursePage.jsx:53 ~ courseArr ~ courseArr:",
    courseArr
  );
  let courses = mergeTwoCourseSameId(courseGens, courseArr);
  console.log(
    "🚀 ~ file: MyCoursePage.jsx:52 ~ handleData ~ courses:",
    courses
  );

  courses = changeStudentCourse(courses);
  return courses;
};
const CourseListPage = () => {
  const [list, setList] = useState([]);
  const [pageCount, setPageCount] = useState(0);

  const { user } = useSelector((state) => state.auth);
  const userId = user?.data.id;

  const handlePageClick = async (event) => {
    console.log(event.selected + 1);
    const res = await getListCourse(event.selected + 1, userId);
    const { totalPages } = res?.data?.course;

    const courses = handleData(res);
    setList(courses);
    setPageCount(totalPages);
  };
  const getListCourse = async (page, userId) => {
    const res = await handleGet(
      `${API.COURSES_OF_STUDENT}/${userId}?page=${page}&limit=${ITEMS_PER_PAGE}`
    );
    console.log("🚀 ~ file: MyCoursePage.jsx:111 ~ getListCourse ~ res:", res);
    return res;
  };

  useEffect(() => {
    const getData = async () => {
      const res = await getListCourse(1, userId);

      const { totalPages } = res?.data?.course;
      const courses = handleData(res);

      setList(courses);
      setPageCount(totalPages);
    };
    getData();
  }, []);

  console.log("list", list);
  return (
    <div className={`pt-[96px] wrapper my-12 min-h-screen`}>
      <div className="flex justify-between">
        <BasicTitle>Khóa học của tôi</BasicTitle>
      </div>
      <BasicFilter filters={filters} path="/my-course" />

      <BasicPagination
        itemsPerPage={ITEMS_PER_PAGE}
        pageCount={pageCount}
        handlePageClick={handlePageClick}
      >
        <CourseList courses={list} className="mb-12" />
      </BasicPagination>
    </div>
  );
};

export default CourseListPage;
