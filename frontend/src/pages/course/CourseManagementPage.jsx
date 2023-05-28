import React, { useState, useEffect } from "react";
import usePopup from "../../hooks/usePopup";
import { CREATE_COURSE_FAILED, nav_height } from "../../utils/constant";
import BasicTitle from "../../components/title/BasicTitle";
import { getListAllCourse, searchCourseByKey } from "../../utils/courseHelper";
import { mergeTwoArrSameKey } from "../../utils/fileHelper";
import { CourseManagementActions } from "../../module/courses/course-management/CourseManagementActions";
import { CreateNewCourseModal } from "../../module/courses/course-management/create-new-course/CreateNewCourseModal";
import { CourseTablePaginated } from "../../module/courses/course-management/CourseTablePaginated";

const ITEMS_PER_PAGE = 7;

const handleData = (res) => {
  const { docs: courseGens } = res?.data?.course;

  const { coursesInfo } = res?.data;

  //tạo mảng mới có _id là key của obj
  const courseArr = Object.entries(coursesInfo).map(([key, value]) => ({
    _id: key,
    ...value,
  }));
  let courses = mergeTwoArrSameKey(courseGens, courseArr, "_id");
  return courses;
};

const CourseManagementPage = () => {
  const [listCourse, setListCourse] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const fetchAllCourse = async () => {
    setIsLoading(true);
    const res = await getListAllCourse(1);
    console.log(handleData(res));
    setListCourse(handleData(res));
    setPageCount(res.data.course.totalPages);
    setIsLoading(false);
  };
  const handleSearchCourse = async (value) => {
    // Nếu keyword là rỗng thì trả về tất cả khoá học
    if (value === "") {
      fetchAllCourse();
      return;
    }
    // Ngược lại thì search khoá học theo keyword
    setIsLoading(true);
    const res = await searchCourseByKey(value, 1, ITEMS_PER_PAGE);
    console.log("search result", handleData(res));
    setCurrentPage(1);
    setListCourse(handleData(res));
    setPageCount(res.data.course.totalPages);
    setKeyword(value);
    setIsLoading(false);
  };
  const handlePageClick = async (event) => {
    // Nếu keyword là rỗng thì trả về tất cả khoá học
    const page = event.selected + 1;
    if (keyword === "") {
      setIsLoading(true);
      const res = await getListAllCourse(page);
      setCurrentPage(page);
      setListCourse(handleData(res));
      setPageCount(res.data.course.totalPages);
      setIsLoading(false);
    } else {
      // Ngược lại thì chuyển trang search khoá học theo keyword
      setIsLoading(true);
      const res = await searchCourseByKey(keyword, page, ITEMS_PER_PAGE);
      console.log("search result", handleData(res));
      setCurrentPage(page);
      setListCourse(handleData(res));
      setPageCount(res.data.course.totalPages);
      setIsLoading(false);
    }
  };
  const onCreateResult = async (msg) => {
    if (msg === CREATE_COURSE_FAILED) return;
    if (currentPage !== 1) return;
    setIsLoading(true);
    const res = await getListAllCourse(1);
    setListCourse(handleData(res));
    setIsLoading(false);
  };
  const {
    open: openCreateNewCourse,
    handleOpenPopup: handleOpenCreateNewCourse,
    handleClosePopup: handleCloseCreateNewCourse,
  } = usePopup();
  useEffect(() => {
    fetchAllCourse();
  }, []);
  return (
    <div className={`wrapper mt-10 pt-[${nav_height}px]`}>
      <BasicTitle>Quản lí khoá học</BasicTitle>
      <CourseManagementActions
        handleSearchCourse={handleSearchCourse}
        handleOpenCreateNewCourse={handleOpenCreateNewCourse}
      ></CourseManagementActions>
      <div className="mt-4">
        <CourseTablePaginated
          itemsPerPage={ITEMS_PER_PAGE}
          items={listCourse}
          pageCount={pageCount}
          handlePageClick={handlePageClick}
          isLoading={isLoading}
        ></CourseTablePaginated>
      </div>
      {openCreateNewCourse && (
        <CreateNewCourseModal
          handleClose={handleCloseCreateNewCourse}
          onCreateResult={onCreateResult}
        ></CreateNewCourseModal>
      )}
    </div>
  );
};
export default CourseManagementPage;
