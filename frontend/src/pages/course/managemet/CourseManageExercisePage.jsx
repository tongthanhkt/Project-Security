import React from "react";
import { useParams, useSearchParams } from "react-router-dom";
import Sidebar from "../../../module/courses/course-management/exercise-management/sidebar/Sidebar";
import LessonList from "../../../module/courses/course-management/exercise-management/content/LessonList";
import ExerciseEditPage from "./ExerciseEditPage";

const CourseManageExercisePage = () => {
  const { id: courseId } = useParams();
  const [topicId, setTopicId] = React.useState(null);
  const [searchParams] = useSearchParams();
  const exerciseId = searchParams.get("exerciseId");
  const lessonId = searchParams.get("lessonId");

  if (exerciseId && lessonId) {
    return <ExerciseEditPage />;
  } else {
    // Reset search params
    searchParams.delete("exerciseId");
    searchParams.delete("lessonId");
    return (
      <div className="flex gap-x-4 h-full">
        {/* Sidebar */}
        <Sidebar
          courseId={courseId}
          topicId={topicId}
          setTopicId={setTopicId}
        />
        <LessonList topicId={topicId} />
      </div>
    );
  }
};

export default CourseManageExercisePage;
