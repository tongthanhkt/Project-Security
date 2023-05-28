import React from "react";
import uuid from "react-uuid";
import { useNavigate } from "react-router-dom";

const CourseStatistic = ({ quantity = 0, title = "Học viên", image = "" }) => {
  return (
    <div className="flex gap-1 items-center  text-sm text-[#6B7385] font-semibold">
      <img src={image} alt="" />
      <span>
        {quantity} {title}
      </span>
    </div>
  );
};
const CourseItem = ({ course = {} }) => {
  const navigate = useNavigate();
  return (
    <div
      key={uuid()}
      className="course-item flex flex-col bg-white rounded-lg p-3 w-fit shadow-[2px_2px_8px_rgba(0,_0,_0,_0.1)] cursor-pointer hover:scale-105 hover:ease-in hover:duration-300"
      onClick={() => navigate(`/course-detail/${course._id}`)}
    >
      <img src={course.image} alt="course" />
      <h3
        className=" font-bold text-xl mt-4 mb-2 course-item__title flex-1"
        title={course.title}
      >
        {course.title}
      </h3>
      <div className="flex gap-3 flex-col">
        <CourseStatistic
          title="Bài giảng"
          quantity={course.lessions}
          image="/icons/course/lession_icon.svg"
        />
        <CourseStatistic
          title="Học viên"
          quantity={course.students}
          image="/icons/course/student_icon.svg"
        />
      </div>
    </div>
  );
};

export default CourseItem;
