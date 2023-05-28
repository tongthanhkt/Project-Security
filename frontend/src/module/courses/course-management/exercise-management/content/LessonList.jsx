import { Book, MenuBook } from "@mui/icons-material";
import { Grow, Skeleton } from "@mui/material";
import React from "react";
import { useQuery } from "react-query";
import BasicAccordion from "../../../../../components/accordion/BasicAccordion";
import Empty from "../../../../../components/empty/Empty";
import { getTopicLessons } from "../../../../../utils/courseHelper";
import { reactQueryKey } from "../../../../../utils/fetch";
import ExerciseList from "./ExerciseList";

const LessonList = ({ topicId }) => {
  const {
    data: lessons,
    error,
    isLoading,
  } = useQuery(reactQueryKey.TOPIC_LESSON(topicId), () =>
    getTopicLessons(topicId)
  );

  if (error) return "An error has occurred: " + error.message;

  return (
    <>
      <div className="flex-1 flex flex-col gap-y-2 bg-white p-4 shadow-md rounded-md">
        {isLoading ? (
          <LessonItemSkeleton />
        ) : lessons?.data.length === 0 ? (
          <Grow in={true} unmountOnExit timeout={1000}>
            <Empty
              imgSrc="/images/resource/empty_resources.png"
              message="Chưa có tài liệu"
            />
          </Grow>
        ) : (
          lessons?.data.map((item) => (
            <LessonItem key={item._id} data={item} topicId={topicId} />
          ))
        )}
      </div>
    </>
  );
};

const LessonItem = ({ data, topicId }) => {
  return (
    <BasicAccordion
      title={data.description}
      openIcon={<MenuBook />}
      closeIcon={<Book />}
      subInfo={`${data.exercises.length} bài tập`}
    >
      {/* Exercise list */}
      <ExerciseList lessonId={data._id} topicId={topicId} />
    </BasicAccordion>
  );
};

const LessonItemSkeleton = () => {
  return (
    <>
      <Skeleton
        variant="rounded"
        height={40}
        width="100%"
        className="!bg-slate-200"
      />
      <Skeleton
        variant="rounded"
        height={40}
        width="100%"
        className="!bg-slate-200"
      />
    </>
  );
};

export default LessonList;
