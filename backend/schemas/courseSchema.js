/* eslint-disable import/extensions */
import db, { Schema } from "../utils/database.js";
import paginate from "mongoose-paginate-v2";

const Courses = new Schema(
  {
    _id: String,
    name: String,
    tutors: [String], // userId
    description: String,
    requirement: String,
    thumb: String,
    isVisible: Boolean,
  },
  { versionKey: false }
);

Courses.plugin(paginate);
const Course = db.model("courses", Courses);
export default Course;
