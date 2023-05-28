import React from "react";
import { useQuery } from "react-query";
import { getLessonExercises } from "../../utils/exerciseHelper";
import { reactQueryKey } from "../../utils/fetch";
import Loading from "./../../components/loading/Loading";
import CodingExercise from "../../module/learning/lesson-exercises/CodingExercise";
import { EXERCISE_TYPE } from "../../common/constants";
import MultiChoiceExercise from "./../../module/learning/lesson-exercises/MultiChoiceExercise";
import { useSearchParams } from "react-router-dom";
import { PAGE_PATH } from "../../routes/page-paths";

const LINK_TYPE = {
  NEXT: "next",
  PRV: "prv",
};

const CourseExcercisePage = ({ setNextLink, setPrvLink }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const lessonId = searchParams.get("lessonId");
  const exerciseId = searchParams.get("exerciseId");

  // Fetch data
  const {
    data: exercises,
    isLoading,
    error,
  } = useQuery(reactQueryKey.LESSON_EXERCISES(lessonId), () =>
    getLessonExercises(lessonId, 1)
  );
  const [curExercise, setCurExercise] = React.useState(null); // whole exercise obj
  const [exerciseIndex, setExerciseIndex] = React.useState(null);
  const [codeExerciseList, setCodeExerciseList] = React.useState([]); // [id1, id2, ...]

  function renderExercise(data) {
    switch (data?.type) {
      case EXERCISE_TYPE.CODING:
        return (
          <CodingExercise
            exercise={data}
            lessonId={lessonId}
            codeExerciseList={codeExerciseList}
          />
        );
      case EXERCISE_TYPE.MULTI_CHOICE:
        return <MultiChoiceExercise data={data} lessonId={lessonId} />;

      default:
        break;
    }
  }

  function setNavLink(type) {
    var link = `${PAGE_PATH.COURSE_LEARNING(
      "63fb671182962758df2dce77"
    )}?lessonId=${lessonId}`;
    var exerciseId = curExercise._id;
    const exerciseList = exercises.data;

    switch (type) {
      case LINK_TYPE.NEXT:
        if (exerciseIndex + 1 < exerciseList.length) {
          exerciseId = exerciseList[exerciseIndex + 1]._id;
          setNextLink((link += `&exerciseId=${exerciseId}`));
        } else {
          setNextLink((link += `&exerciseId=${exerciseId}`));
        }
        break;
      case LINK_TYPE.PRV:
        if (exerciseIndex - 1 >= 0) {
          exerciseId = exerciseList[exerciseIndex - 1]._id;
          setPrvLink((link += `&exerciseId=${exerciseId}`));
        } else {
          setPrvLink((link += `&exerciseId=${exerciseId}`));
        }
        break;

      default:
        break;
    }
  }

  // Set search params 1st time
  React.useEffect(() => {
    if (exercises?.data?.length > 0 && !exerciseId) {
      const exerciseList = exercises.data;
      setCurExercise(exerciseList[0]);
      setSearchParams({
        lessonId,
        exerciseId: exerciseList[0]._id,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exercises]);

  // Set coding exercise list
  React.useEffect(() => {
    if (exercises?.data?.length > 0) {
      const exerciseList = exercises.data;
      // Get list of exercise
      const codingExerciseList = exerciseList.filter(
        (item) => item.type === EXERCISE_TYPE.CODING
      );
      setCodeExerciseList(codingExerciseList.map((item) => item._id));
    }
  }, [exercises]);

  // Set curr exercise state when search param change
  React.useEffect(() => {
    if (exercises?.data?.length > 0 && exerciseId) {
      const curExerciseIndex = exercises?.data?.findIndex(
        (item) => item._id === exerciseId
      );

      setExerciseIndex(curExerciseIndex);
      setCurExercise(exercises.data[curExerciseIndex]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exercises, exerciseId]);

  // Set next and prv link
  React.useEffect(() => {
    if (exercises?.data?.length > 0 && curExercise && exerciseIndex !== null) {
      setNavLink(LINK_TYPE.NEXT);
      setNavLink(LINK_TYPE.PRV);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [curExercise, exerciseIndex]);

  if (error) return "An error has occurred: " + error.message;

  return (
    <>
      {isLoading ? (
        <Loading hScreen={false} />
      ) : exercises?.data?.length === 0 ? (
        "Không có BT"
      ) : (
        renderExercise(curExercise)
      )}
    </>
  );
};

export default CourseExcercisePage;
