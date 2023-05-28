import { ArrowBackIos } from "@mui/icons-material";
import React from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import BasicButton from "../../../components/button/BasicButton";
import { PAGE_PATH } from "../../../routes/page-paths";
import TestCaseEditTab from "../../../module/courses/course-management/exercise-management/exercise-edit/TestCaseEditTab";
import TemplateEditTab from "./../../../module/courses/course-management/exercise-management/exercise-edit/TemplateEditTab";
import { useQuery } from "react-query";
import { getLessonExercises } from "../../../utils/exerciseHelper";
import { reactQueryKey } from "../../../utils/fetch";
import RESP from "../../../common/respCode";
import Loading from "./../../../components/loading/Loading";

const ExerciseEditPage = () => {
  const [searchParams] = useSearchParams();
  const exerciseId = searchParams.get("exerciseId");
  const lessonId = searchParams.get("lessonId");
  const { id: courseId } = useParams();
  const navigate = useNavigate();

  // Fetch data
  const {
    data: exercises,
    isLoading,
    error,
  } = useQuery(reactQueryKey.LESSON_EXERCISES(lessonId), () =>
    getLessonExercises(lessonId, 1, 0)
  );
  const [curExercise, setCurExercise] = React.useState(null);

  const [tabIndex, setTabIndex] = React.useState(0);
  const selectedTab = "text-white bg-gradient !border-none";
  const tabList = [
    { label: "Test cases", component: <TestCaseEditTab /> },
    {
      label: "Templates",
      component: (
        <TemplateEditTab templateLangIds={curExercise?.templateLangIds || []} />
      ),
    },
  ];

  // Handle exercise doesn't exists
  React.useEffect(() => {
    if (exercises) {
      switch (exercises.status) {
        case RESP.SUCCESS:
          // Find current exercise
          const curExercise = exercises.data?.find(
            (item) => item._id === exerciseId
          );

          // Exercise doesn't exists
          if (!curExercise) {
            navigate(PAGE_PATH.COURSE_MANAGEMENT_DASHBOARD(courseId));
            return;
          }
          setCurExercise(curExercise);
          break;
        case RESP.NOT_FOUND:
          navigate(PAGE_PATH.COURSE_MANAGEMENT_DASHBOARD(courseId));
          break;

        default:
          break;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exercises, exerciseId]);

  if (error) return "An error has occurred: " + error.message;

  if (isLoading) {
    return <Loading />;
  } else {
    return (
      <div>
        {/* Header */}
        <div className="flex justify-between items-center shadow-md rounded-md p-4 mb-4">
          <p className="text-xl font-semibold">Id: {exerciseId}</p>
          <BasicButton
            type="button"
            onClick={() =>
              navigate(PAGE_PATH.COURSE_MANAGEMENT_DASHBOARD(courseId))
            }
            icon={<ArrowBackIos className="!p-0" />}
            className="!font-medium"
          >
            Trở về
          </BasicButton>
        </div>

        {/* Tabs */}
        <div className="inline-flex rounded-md shadow-sm mb-2">
          {tabList.map((item, index) => (
            <button
              key={item.label}
              type="button"
              onClick={() => setTabIndex(index)}
              className={`px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 
              first:rounded-l-md last:rounded-r-md hover:bg-gray-100 focus:z-10 ${
                index === tabIndex ? selectedTab : ""
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Exercise content */}
        <div className="rounded-md shadow-md p-4">
          {tabList[tabIndex].component}
        </div>
      </div>
    );
  }
};

export default ExerciseEditPage;
