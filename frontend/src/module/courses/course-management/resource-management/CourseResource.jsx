import { Grow, Skeleton, Slide } from "@mui/material";
import React from "react";
import Lessons from "./resource-container/Lessons";
import { useQuery } from "react-query";
import { reactQueryKey } from "../../../../utils/fetch";
import { getTopicLessons } from "../../../../utils/courseHelper";
import Empty from "../../../../components/empty/Empty";

const CourseResource = ({ chapterId }) => {
  // const curLessons = getLessonsList("ch01");

  const { data, error, isLoading } = useQuery(
    reactQueryKey.TOPIC_LESSON(chapterId),
    () => getTopicLessons(chapterId)
  );
  const curLessons = data?.data;

  if (error) return "An error has occurred: " + error.message;

  return (
    <div
      className={`flex-1 overflow-x-hidden ${
        curLessons?.length === 0 ? "m-auto" : ""
      }`}
    >
      {isLoading ? (
        <div className="flex flex-col gap-y-4">
          <Skeleton variant="rounded" height={60} className="!bg-slate-200" />
          <Skeleton variant="rounded" height={60} className="!bg-slate-200" />
          <Skeleton variant="rounded" height={60} className="!bg-slate-200" />
        </div>
      ) : curLessons?.length > 0 ? (
        curLessons?.map((item) => (
          <Slide
            key={item.lessonId || item._id}
            in={true}
            direction="down"
            timeout={1000}
            unmountOnExit
          >
            <Lessons lessonId={item._id} lessonName={item.description} />
          </Slide>
        ))
      ) : (
        <Grow in={true} unmountOnExit timeout={1000}>
          <Empty
            imgSrc="/images/resource/empty_lessons.png"
            message="Chưa có bài giảng"
          />
        </Grow>
      )}
    </div>
  );
};

export default CourseResource;
