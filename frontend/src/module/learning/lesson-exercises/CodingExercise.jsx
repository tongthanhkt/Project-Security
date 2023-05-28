import React from "react";
import { useQuery, useQueryClient } from "react-query";
import { LANG_ID } from "../../../common/constants";
import CodeEditorAdapter from "../../../components/input/CodeEditorAdapter";
import {
  getLastRunCode,
  getSubmitHistory,
  getSubmitInfo,
} from "../../../utils/exerciseHelper";
import { reactQueryKey } from "../../../utils/fetch";
import { getTemplate } from "../../../utils/templateHelper";
import EditorConsole from "./console/EditorConsole";

const CodingExercise = ({ exercise, lessonId }) => {
  // React.useEffect(() => {
  //   const runHistory = submitHistory?.data?.docs;
  //   if (runHistory?.length > 0) {
  //     const lastRun = runHistory[runHistory.length - 1];

  //     const isLastRunComplete = isRunComplete(lastRun.test_cases);

  //     if (!isLastRunComplete) {

  //     }
  //   }
  // }, [submitHistory]);

  const codeEditorRef = React.useRef();
  const [lastingCode, setLastingCode] = React.useState("");
  const [language, setLanguage] = React.useState(LANG_ID.NODEJS);

  // ******* Get template *******
  const {
    data: template,
    // eslint-disable-next-line no-unused-vars
    isLoading: isLoadingTemplate,
    error: errorTemplate,
  } = useQuery(
    reactQueryKey.TEMPLATE_INFO(lessonId, exercise._id, language),
    () => getTemplate(lessonId, exercise._id, language)
  );

  // ******* Get run history *******
  // eslint-disable-next-line no-unused-vars
  const queryClient = useQueryClient();
  const [submitId, setSubmitId] = React.useState(null);

  // Submit history
  const {
    // eslint-disable-next-line no-unused-vars
    data: submitHistory,
    // eslint-disable-next-line no-unused-vars
    isLoading: isLoadingHistory,
    error: errorHistory,
  } = useQuery(reactQueryKey.SUBMIT_CODE_HISTORY(lessonId, exercise._id), () =>
    getSubmitHistory(lessonId, exercise._id, 0, 1, 1)
  );

  // Submit info
  const {
    // eslint-disable-next-line no-unused-vars
    data: submitInfo,
    isLoading: isLoadingSubmitInfo,
    error: errorSubmitInfo,
  } = useQuery(
    reactQueryKey.SUBMIT_CODE_INFO(lessonId, exercise._id, submitId),
    () => getSubmitInfo(submitId),
    {
      // Only fetch when submitId exists
      enabled: !!submitId,
    }
  );

  //last run code
  React.useEffect(() => {
    const fetchLastingCode = async () => {
      const resLastRun = await getLastRunCode(lessonId, exercise._id);
      console.log(
        "🚀 ~ file: CodeEditorAdapter.jsx:290 ~ fetchLastingCode ~ resLastRun:",
        resLastRun
      );
      const resLastSubmit = await getSubmitHistory(lessonId, exercise?._id);
      if (resLastRun?.data?.ts > resLastSubmit?.data?.docs[0]?.ts)
        setLastingCode(resLastRun?.data);
      else setLastingCode(resLastSubmit?.data?.docs[0]);
    };
    fetchLastingCode();
  }, [exercise, lessonId]);

  React.useEffect(() => {
    if (lastingCode) {
      setLanguage(lastingCode.langId);
    }
  }, [lastingCode]);

  // Loading status
  const isFetching =
    // isLoadingHistory
    isLoadingSubmitInfo;

  if (errorHistory) return "An error has occurred: " + errorHistory.message;
  if (errorSubmitInfo)
    return "An error has occurred: " + errorSubmitInfo.message;
  if (errorSubmitInfo) return "An error has occurred: " + errorTemplate.message;

  return (
    <div className="pt-minus-learning-nav h-minus-footer-learning">
      <div className="h-full w-full p-6 flex gap-x-4">
        {/* Description */}
        <div
          dangerouslySetInnerHTML={{ __html: exercise.question }}
          className="w-[40%] shadow-md p-4 max-h-full overflow-y-auto"
        />

        {/* Code editor */}
        <div className="w-[60%] h-full shadow-md bg-slate-50 overflow-y-auto">
          <CodeEditorAdapter
            theme="vs-dark"
            defaultValue={template?.data?.template || lastingCode?.src_code}
            language={language}
            setLanguage={setLanguage}
            ref={codeEditorRef}
          />
          <EditorConsole
            getEditorVal={codeEditorRef.current?.getEitorValue}
            isRefetching={isFetching}
            exerciseId={exercise?._id}
            langId={language}
            lessonId={lessonId}
            setSubmitId={setSubmitId}
            submitInfo={submitHistory}
            exercise={exercise}
          />
        </div>
      </div>
    </div>
  );
};

export default CodingExercise;
