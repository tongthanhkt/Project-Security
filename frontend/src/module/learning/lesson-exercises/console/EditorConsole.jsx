import { CheckCircle, Error, PlayArrow, Settings } from "@mui/icons-material";
import React from "react";
import { useMutation } from "react-query";
import { JUDGE_STATUS } from "../../../../common/constants";
import RESP from "../../../../common/respCode";
import BasicButton from "../../../../components/button/BasicButton";
import { runCode, submitCode } from "../../../../utils/exerciseHelper";

const SUBMIT_TYPE = {
  RUN_CODE: 0,
  SUBMIT_CODE: 1,
};

function testCaseContructor(
  results,
  time,
  status,
  msg,
  expectedRes,
  stdin,
  cmd_line_arg,
  outputFileName,
  inputFile,
  inputFileName,
  isErr = false
) {
  this.out = results;
  this.time = time;
  this.statusId = status;
  this.msg = msg;
  this.expectOut = expectedRes;
  this.stdin = stdin;
  this.cmd_line_arg = cmd_line_arg;
  this.isErr = isErr;
  this.outputFileName = outputFileName;
  this.inputFileName = inputFileName;
  this.inputFile = inputFile;
}

const EditorConsole = ({
  getEditorVal,
  langId,
  lessonId,
  exercise = {},
  setSubmitId,
  submitInfo,
  isRefetching = false,
}) => {
  const [testCaseResult, setTestCaseResult] = React.useState([]);
  const [submitType, setSubmitType] = React.useState(SUBMIT_TYPE.RUN_CODE);
  const [passTestCase, setPassTestCase] = React.useState(0);

  // ******* Handle func *******
  function isRunComplete(testCases, field) {
    return (
      testCases.find(
        (item) =>
          item[field] === JUDGE_STATUS.PROCESSING ||
          item[field] === JUDGE_STATUS.IN_QUEUE
      ) === undefined
    );
  }

  function getRunMsg(testCase, field) {
    var resMsg;
    var isErr = false;
    switch (testCase[field]) {
      // Right answ
      case JUDGE_STATUS.ACCEPTED:
        resMsg = "Test case đạt";
        break;

      // Wrong ans
      case JUDGE_STATUS.WRONG_ANS:
        resMsg = "Test case chưa đạt";
        break;

      // Waiting
      case JUDGE_STATUS.IN_QUEUE:
      case JUDGE_STATUS.PROCESSING:
        resMsg = "Đang được xử lý";
        break;

      // Error
      default:
        resMsg = testCase.stderr || testCase.compile_output || "Error";
        isErr = true;
        break;
    }
    return { resMsg, isErr };
  }

  function getPassedTestCase(testCases) {
    return testCases.filter(
      (item) =>
        item.status === JUDGE_STATUS.ACCEPTED ||
        item.statusId === JUDGE_STATUS.ACCEPTED
    ).length;
  }

  function getMoreTestCaseInfo(testCaseId) {
    const exerciseMoreInfo = exercise?.examples?.find(
      (item) => item._id === testCaseId
    );

    return exerciseMoreInfo;
  }

  function formatTestCase(testCaseResults, type) {
    var formatRes;
    switch (type) {
      case SUBMIT_TYPE.SUBMIT_CODE:
        formatRes = testCaseResults.map((item) => {
          // Get test case compile msg
          const { isErr, resMsg } = getRunMsg(item, "status");

          // Return test case results with expected output
          return new testCaseContructor(
            null,
            null,
            item.status,
            resMsg,
            null,
            null,
            null,
            null,
            null,
            null,
            isErr
          );
        });
        break;

      default:
        break;
    }
    return formatRes;
  }

  // ******* Run code *******
  function handleRunCode() {
    setSubmitType(SUBMIT_TYPE.RUN_CODE);

    // Run value from 3rd party editor
    const reqData = {
      src_code: getEditorVal(),
      langId,
      lessonId,
      exerciseId: exercise._id,
    };

    // Post code to run
    mutationRunCode.mutate(reqData);
  }

  function handleSubmitCode(data) {
    setSubmitType(SUBMIT_TYPE.SUBMIT_CODE);

    // Run value from 3rd party editor
    const reqData = {
      src_code: getEditorVal(),
      langId,
      lessonId,
      exerciseId: exercise._id,
    };

    // Post code to submit
    mutationSubmitCode.mutate(reqData);
  }

  // Run code
  const mutationRunCode = useMutation(
    ({ src_code, langId, lessonId, exerciseId }) =>
      runCode(src_code, langId, lessonId, exerciseId),
    {
      onError: (error) => {
        alert(error);
      },
      onSuccess: (data, variables) => {
        console.log("Run code resp return: ", data);

        if (data.status === RESP.SUCCESS) {
          // Set running state
          const testCaseResults = data.data.testCases;

          // Format returned test case
          const formatRes = testCaseResults.map((res) => {
            //  Find expected output
            const {
              out: expectOut,
              stdin,
              cmd_line_arg,
              outputFileName,
              inputFile,
              inputFileName,
            } = getMoreTestCaseInfo(res.testCaseId);

            // Get test case compile msg
            const { isErr, resMsg } = getRunMsg(res, "statusId");

            // Return test case results with expected output
            return new testCaseContructor(
              res.out,
              res.time,
              res.statusId,
              resMsg,
              expectOut,
              stdin,
              cmd_line_arg,
              outputFileName,
              inputFile,
              inputFileName,
              isErr
            );
          });
          setTestCaseResult(formatRes);

          // Check if run complete
          if (isRunComplete(formatRes, "statusId")) {
            // clearInterval(interValRunCode.current);
          }
        } else {
          alert(data.message);
        }
      },
    }
  );

  // Submit code
  const mutationSubmitCode = useMutation(
    ({ src_code, langId, lessonId, exerciseId }) =>
      submitCode(src_code, langId, lessonId, exerciseId),
    {
      onError: (error) => {
        alert(error);
      },
      onSuccess: (data, variables) => {
        console.log("Submit code resp return: ", data);

        if (data.status === RESP.SUCCESS) {
          setSubmitId(data.data._id);
          // Set running state
          const testCaseResults = data?.data?.test_cases;

          // Format returned test case
          const formatRes = formatTestCase(
            testCaseResults,
            SUBMIT_TYPE.SUBMIT_CODE
          );
          setTestCaseResult(formatRes);

          // Check if run complete
          if (isRunComplete(formatRes, "statusId")) {
            // clearInterval(interValRunCode.current);
          }
        } else {
          alert(data.message);
        }
      },
    }
  );

  // ******* State change *******

  const isRunning =
    mutationRunCode?.isLoading || mutationSubmitCode?.isLoading || isRefetching;

  // Handle exercise change
  React.useEffect(() => {
    // Clear console on exercise change
    setTestCaseResult([]);
    setPassTestCase(0);
  }, [exercise]);

  // Scroll to bottom
  const messagesEndRef = React.useRef(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Handle testCaseResult change
  React.useEffect(() => {
    // Handle passed test cases
    const numOfPassed = getPassedTestCase(testCaseResult);
    setPassTestCase(numOfPassed);

    // if (testCaseResult.length > 0) {
    //   switch (submitType) {
    //     case SUBMIT_TYPE.SUBMIT_CODE:
    //       if (isRunComplete(testCaseResult, "status") === false) {
    //         queryClient.invalidateQueries(
    //           reactQueryKey.SUBMIT_CODE_INFO(lessonId, exercise._id, submitId)
    //         );
    //         // Set interval for running until done
    //         interValRunCode.current = setInterval(() => {
    //           queryClient.invalidateQueries(
    //             reactQueryKey.SUBMIT_CODE_INFO(lessonId, exercise._id, submitId)
    //           );
    //         }, DELAY);
    //       } else {
    //         // Clear fetch when done
    //         clearInterval(interValRunCode.current);
    //       }
    //       break;

    //     default:
    //       break;
    //   }
    // }

    // Scroll to bottom
    scrollToBottom();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [testCaseResult]);

  // Handle get submit code info until done
  React.useEffect(() => {
    if (submitInfo?.data) {
      const testCaseList = submitInfo.data.test_cases;
      if (testCaseList) {
        if (isRunComplete(testCaseList, "status")) {
          // Run complete
        } else {
          // Update run status
          setTestCaseResult(
            formatTestCase(testCaseList, SUBMIT_TYPE.SUBMIT_CODE) || []
          );
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submitInfo]);

  const [curTestCase, setCurTestCase] = React.useState(0);

  return (
    <>
      {/* Run btn */}
      <div className="flex justify-end items-center p-2">
        {/* File list */}
        <ul className="flex flex-wrap text-sm font-medium text-center">
          {/* Run button */}
          <li className="ml-2 font-semibold inline-block p-2">
            <BasicButton
              className={`!bg-white ${
                isRunning ? "!text-slate-200" : "!text-black"
              } !p-2 !font-semibold !relative`}
              noGradient={true}
              onClick={() => handleRunCode(getEditorVal())}
              disabled={isRunning}
            >
              <span>Run code</span>
              {isRunning ? (
                <div className="absolute top-0 text-black">
                  <div className="relative">
                    <img
                      src="/icons/loading/spinner_dot.svg"
                      className="h-10 w-10 animate-spin"
                      alt="dot_spinner"
                    />
                    <PlayArrow className="absolute top-[8px] right-[8px]" />
                  </div>
                </div>
              ) : null}
            </BasicButton>
          </li>
          {/* Submit button */}
          <li className="ml-2 font-semibold inline-block p-2">
            <BasicButton
              className="!p-2 !font-semibold !relative"
              onClick={() => handleSubmitCode(getEditorVal())}
              disabled={isRunning}
            >
              <span>Submit code</span>
              {isRunning ? (
                <div className="absolute top-0 text-white">
                  <div className="relative">
                    <img
                      src="/icons/loading/spinner_dot.svg"
                      className="h-10 w-10 animate-spin"
                      alt="dot_spinner"
                    />
                    <PlayArrow className="absolute top-[8px] right-[8px]" />
                  </div>
                </div>
              ) : null}
            </BasicButton>
          </li>
        </ul>
      </div>
      {isRunning ? (
        <div className="mx-auto flex flex-col items-center justify-center">
          <Settings className="animate-spin !w-20 !h-20" />
          <div>Đang xử lý</div>
        </div>
      ) : testCaseResult?.length !== 0 ? (
        <>
          {/* Overview */}
          <div
            className={`bg-white mb-4 p-2 text-2xl font-semibold ${
              passTestCase === testCaseResult.length
                ? "text-green-500"
                : "text-red-600"
            }`}
          >{`${passTestCase}/${testCaseResult.length} test case đạt`}</div>

          <div className="p-2 flex gap-y-2 bg-white text-lg gap-x-8 mb-6">
            {/* Sidebar */}
            <SideBar
              testCaseResult={testCaseResult}
              curTestCase={curTestCase}
              setCurTestCase={setCurTestCase}
            />

            {/* Content */}
            <RunResultItem
              testCase={testCaseResult[curTestCase]}
              submitType={submitType}
            />
          </div>
        </>
      ) : null}
    </>
  );
};

const SideBar = ({ testCaseResult, curTestCase, setCurTestCase }) => {
  const selected = "bg-slate-100 p-2 rounded-md font-medium";

  function renderIcon(statusId) {
    switch (statusId) {
      case JUDGE_STATUS.ACCEPTED:
        return <CheckCircle className="text-green-500" />;
      case JUDGE_STATUS.IN_QUEUE:
      case JUDGE_STATUS.PROCESSING:
        return (
          <img
            src="/icons/loading/spinner_dot.svg"
            className="h-8 w-8 animate-spin"
            alt="dot_spinner"
          />
        );

      default:
        return <Error className="text-yellow-500" />;
    }
  }

  return (
    <ul className="test-case-side w-1/5 h-full p-2">
      {testCaseResult.map((item, index) => (
        <li
          key={index}
          onClick={() => setCurTestCase(index)}
          className={`p-2 cursor-pointer flex items-center gap-x-1 ${
            curTestCase === index ? selected : ""
          }`}
        >
          {renderIcon(item.statusId)}
          {`Test case ${index + 1}`}
        </li>
      ))}
    </ul>
  );
};

const OutputInfo = ({ label, message }) => {
  if (message) {
    return (
      <div>
        <p className="text-slate-400 text-sm mb-1">{label}</p>
        <p className="p-2 bg-slate-200 rounded-md whitespace-pre-line">
          {message}
        </p>
      </div>
    );
  } else {
    return null;
  }
};

const OutputInfoFile = ({ label, fileName, content }) => {
  if (fileName) {
    return (
      <div>
        <p className="text-slate-400 text-sm mb-1">{label}</p>
        <div className="p-2 bg-slate-200 rounded-md ">
          <p className="whitespace-pre-line">{fileName}</p>
          <hr className="bg-white h-[2px] rounded-md" />
          <p className="whitespace-pre-line">{content}</p>
        </div>
      </div>
    );
  } else {
    return null;
  }
};

const RunResultItem = ({ testCase, submitType }) => {
  return (
    <div className="test-case-results flex-1 flex flex-col gap-y-8">
      {testCase ? (
        <>
          <OutputInfo label="Tin nhắn biên dịch" message={testCase?.msg} />
          {/* Hide output when error */}
          {testCase.isErr || submitType === SUBMIT_TYPE.SUBMIT_CODE ? null : (
            <>
              <OutputInfo
                label="Tham số dòng lệnh"
                message={testCase.cmd_line_arg}
              />

              <OutputInfo label="Đầu vào (input)" message={testCase.stdin} />

              <OutputInfoFile
                label="File đầu vào (input file)"
                fileName={testCase.inputFileName}
                content={testCase.inputFile}
              />

              {testCase.outputFileName ? (
                <OutputInfoFile
                  label="File đầu ra (output file)"
                  fileName={testCase.outputFileName}
                  content={testCase.out || "\n"}
                />
              ) : (
                <OutputInfo
                  label="Đầu ra (output)"
                  message={testCase.out || "\n"}
                />
              )}

              {testCase.outputFileName ? (
                <OutputInfoFile
                  label="Đầu ra đúng"
                  fileName={testCase.outputFileName}
                  content={testCase.expectOut}
                />
              ) : (
                <OutputInfo label="Đầu ra đúng" message={testCase.expectOut} />
              )}
            </>
          )}
        </>
      ) : null}
    </div>
  );
};

export default EditorConsole;
