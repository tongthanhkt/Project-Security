import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "react-query";
import { reactQueryKey } from "../../../utils/fetch";
import Loading from "../../../components/loading/Loading";
import Empty from "../../../components/empty/Empty";
import { getCourseTopics } from "../../../utils/courseHelper";
import Sidebar from "./../../../module/courses/course-management/resource-management/Sidebar";
import CourseResource from "./../../../module/courses/course-management/resource-management/CourseResource";

const CourseResourcePage = () => {
  const { id: courseId } = useParams();
  const [chapId, setChapId] = React.useState(null);

  const {
    data: courseChapter,
    error,
    isLoading,
  } = useQuery(reactQueryKey.COURSER_CHAPTER(courseId), () =>
    getCourseTopics(courseId)
  );

  if (error) return "An error has occurred: " + error.message;

  return (
    <div
      className={`wrapper pt-minus-nav pb-10 ${
        courseChapter?.data?.length === 0
          ? "flex justify-center h-minus-footer"
          : ""
      }`}
    >
      {isLoading ? (
        <Loading />
      ) : courseChapter?.data?.length === 0 ? (
        <Empty
          imgSrc="/images/resource/empty_lessons.png"
          message="Khóa học này trống"
        />
      ) : (
        <div className="flex gap-x-10">
          {/* Course info */}
          <Sidebar
            data={courseChapter?.data}
            chapterId={chapId}
            setChapterId={setChapId}
            showImg={false}
          />
          {/* Course */}
          <CourseResource chapterId={chapId} />
        </div>
      )}
    </div>
  );
};

export default CourseResourcePage;
