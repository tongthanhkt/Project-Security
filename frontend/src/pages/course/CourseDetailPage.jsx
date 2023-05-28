import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { nav_height } from "../../utils/constant";
import { CourseDetailInfo } from "../../module/courses/course-detail/CourseDetailInfo";
import { CourseGenerralInfo } from "../../module/courses/course-detail/CourseGeneralInfo";
import {
  getCourseDetail,
  getCourseTopics,
  getTopicLessons,
} from "../../utils/courseHelper";
const CourseDetailPage = () => {
  const { id } = useParams();
  const [courseDetail, setCourseDetail] = useState(null);
  const [topicsAndLessions, setTopicsAndLessions] = useState([]);
  const getData = async (courseId) => {
    const { data } = await getCourseTopics(courseId);
    if (data.length > 0) {
      const promises = data.map(async (item) => {
        const resLession = await getTopicLessons(item._id);
        return {
          topic: item,
          lession: resLession.data,
        };
      });

      const info = await Promise.all(promises);
      setTopicsAndLessions(info);
    }
  };
  useEffect(() => {
    getCourseDetail(id).then((res) => {
      setCourseDetail(res);
    });
    getData(id);
  }, []);
  return (
    <div
      className={`flex items-start px-4 py-4 gap-32 wrapper pt-[${nav_height}px]`}
    >
      <CourseDetailInfo
        topicsAndLessions={topicsAndLessions}
        courseDetail={courseDetail}
        id={id}
      ></CourseDetailInfo>
      <CourseGenerralInfo
        topicsAndLessions={topicsAndLessions}
        courseDetail={courseDetail}
        id={id}
      ></CourseGenerralInfo>
    </div>
  );
};

export default CourseDetailPage;
