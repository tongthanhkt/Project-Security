import React from "react";
import uuid from "react-uuid";
import CourseItem from "./CourseItem";
import "./styles/styles.css";

const CourseList = ({ courses = [], className = {} }) => {
  return (
    <div
      className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 fade-in-from-bottom ${className}`}
    >
      {courses.map((course) => (
        <CourseItem key={uuid()} course={course}></CourseItem>
      ))}
    </div>
  );
};

export default CourseList;
