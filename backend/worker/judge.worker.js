import axios from "axios";
import JSZip from "jszip";
import judgeApi from "../utils/judgeApi.js";
import decodeUtils from "../utils/decodeUtils.js";
import {
  FILE_EXEC_CODE,
  FILE_NOT_FOUND_SEPARATOR,
  JUDGE_STATUS,
  LANG_ID,
  NUM_OF_SUBMISSIONS_PER_BATCH,
  NUM_OF_TOKENS_PER_BATCH,
  STDOUT_FILEOUT_SEPARATOR,
} from "../utils/judge.constant.js";
import encodeUtils from "../utils/encodeUtils.js";
import timeUtils from "../utils/timeUtils.js";

const runPostRun = `
bash ./postRun`;

const TIMEOUT_RUN = 6 * 1000;

const optionsBatchPost = {
  method: "POST",
  url: judgeApi.SUBMIT_BATCH_SUBMISSIONS,
  params: { base64_encoded: "true" },
  headers: {
    accept: "*/*",
    "accept-language": "en-GB,en",
    "content-type": "application/json",
    "Content-Type": "application/json",
  },
  credentials: "omit",
  mode: "cors",
};

const optionsGet = {
  method: "GET",
  params: { base64_encoded: "true", fields: "*" },
};

const customFields =
  "token,stdout,time,memory,stderr,wall_time_limit,compile_output," +
  "exit_code,message,wall_time,status,max_file_size,expected_output";

/**
 * @param {Array<Array<string>>} tokensList
 * @returns {{method: string, params: {base64_encoded: string, fields: string, tokens: string}}}
 */
function getOptionsGet(tokensList) {
  if (tokensList.length > 0) {
    let tokens = tokensList[0];
    for (let i = 1; i < tokensList.length; i++) {
      const token = tokensList[i];
      tokens = tokens.concat(",", token);
    }
    return {
      ...optionsGet,
      params: { ...optionsGet.params, tokens, fields: customFields },
    };
  }
  return optionsGet;
}

/**
 *
 * @param {Array<*>} submissions
 * @param {number} nItems
 * @returns {Array<Array<*>>}
 */
export function splitBatchSubmission(
  submissions,
  nItems = NUM_OF_SUBMISSIONS_PER_BATCH
) {
  // const nPartitions = parseInt((submissions.length + nItems - 1) / nItems);
  // return nPartitions === 1
  //   ? submissions
  //   : toPartition(submissions, nPartitions);
  const result = submissions.reduce((resultArray, item, index) => {
    const chunkIndex = Math.floor(index / nItems);
    if (!resultArray[chunkIndex]) {
      resultArray[chunkIndex] = [];
    }
    resultArray[chunkIndex].push(item);
    return resultArray;
  }, []);
  return result;
}

/**
 * @async
 * @param {Array<TestCase>} testCaseList
 * @param {string} src_code
 * @param {number} langId
 * @param {Constraint} constraint
 * @returns {Promise<Array<JudgeSubmission>>}
 */
async function buildSubmissionsWithoutInputFile(
  testCaseList,
  src_code,
  langId,
  constraint
) {
  const submissions = [];
  testCaseList.forEach((testCase) => {
    const attachData = {
      ...constraint,
      language_id: langId,
      source_code: encodeUtils.encodeText(src_code),
    };

    if (testCase.stdin) {
      attachData.stdin = encodeUtils.encodeText(testCase.stdin);
    }
    if (testCase.cmd_line_arg) {
      attachData.command_line_arguments = testCase.cmd_line_arg;
    }
    if (!testCase.outputFileName) {
      attachData.expected_output = encodeUtils.encodeText(testCase.out);
    }
    submissions.push(attachData);
  });
  return submissions;
}

/**
 * @async
 * @param {Array<TestCase>} testCaseList
 * @param {string} src_code
 * @param {number} langId
 * @param {Constraint} constraint
 * @returns {Promise<Array<Array<JudgeSubmission>>>}
 */
async function buildSubmissionsWithCustomRun(
  testCaseList,
  src_code,
  langId,
  constraint
) {
  const submissions = [];
  for (let i = 0; i < testCaseList.length; i++) {
    const testCase = testCaseList[i];
    const { MAIN, RUN, COMPILE } = FILE_EXEC_CODE.get(langId);
    const zip = new JSZip();
    zip.file(MAIN, src_code);
    if (testCase.outputFileName) {
      if (testCase.cmd_line_arg) {
        zip.file("run", RUN.concat(" ", testCase.cmd_line_arg, runPostRun));
      } else {
        zip.file("run", RUN.concat(runPostRun));
      }
      zip.file(
        "postRun",
        `#!/bin/bash\nif(test -e "${testCase.outputFileName}") && ((\`stat -c%s "${testCase.outputFileName}"\` != 0)); then\n\techo "${STDOUT_FILEOUT_SEPARATOR}" && cat ${testCase.outputFileName}\nelse\n\techo "${FILE_NOT_FOUND_SEPARATOR}"\nfi`
      );
    } else {
      zip.file("run", RUN);
    }

    if (COMPILE) {
      zip.file("compile", COMPILE);
    }

    if (testCase.inputFileName && testCase.inputFile) {
      zip.file(testCase.inputFileName, testCase.inputFile);
    }

    const encZip = await encodeUtils.encodeZip(zip);
    const attachData = {
      ...constraint,
      language_id: LANG_ID.MULTI_FILE,
      source_code: "",
      additional_files: encZip,
      max_file_size: constraint.max_file_size + 1, // 1kb more for print separators
    };
    if (testCase.stdin) {
      attachData.stdin = encodeUtils.encodeText(testCase.stdin);
    }
    if (testCase.cmd_line_arg) {
      attachData.command_line_arguments = testCase.cmd_line_arg;
    }
    attachData.expected_output = encodeUtils.encodeText(testCase.out);
    submissions.push(attachData);
  }
  return submissions;
}

/**
 * @async
 * @param {Array<TestCase>} testCaseList
 * @param {string} src_code
 * @param {number} langId
 * @param {Constraint} constraint
 * @returns {Promise<Array<Array<JudgeSubmission>>>}
 */
async function buildSubmissionsData(
  testCaseList,
  src_code,
  langId,
  constraint
) {
  if (testCaseList.length === 0) {
    return [];
  }
  let submissions = [];
  if (testCaseList[0].inputFile || testCaseList[0].outputFileName) {
    submissions = await buildSubmissionsWithCustomRun(
      testCaseList,
      src_code,
      langId,
      constraint
    );
  } else {
    submissions = await buildSubmissionsWithoutInputFile(
      testCaseList,
      src_code,
      langId,
      constraint
    );
  }
  const submissionsList = splitBatchSubmission(submissions);
  return submissionsList;
}

/**
 * @async
 * @param {Array<Array<JudgeSubmission>>} listSubmissionsList
 * @returns {Promise<Array<Array<string>>>}
 */
async function runBatchSubmission(listSubmissionsList) {
  try {
    const responses = [];
    for (let i = 0; i < listSubmissionsList.length; i++) {
      const submissionsList = listSubmissionsList[i];
      // console.log(submissionsList);
      const response = axios({
        ...optionsBatchPost,
        data: {
          submissions: submissionsList,
        },
        timeout: TIMEOUT_RUN,
      });
      responses.push(response);
    }
    const responseList = await Promise.all(responses);
    const result = [];
    for (let i = 0; i < responseList.length; i++) {
      const listTokensList = responseList[i].data;
      if (listTokensList.length > 0) {
        listTokensList.forEach((tokensList) => {
          result.push(tokensList.token);
        });
      }
    }
    const listTokensList = splitBatchSubmission(result);
    return listTokensList;
  } catch (err) {
    console.log(err);
    return [];
  }
}

/**
 *
 * @param {Array<TestCase>} testCases
 * @param {Array<Array<string>>} listTokensList
 * @returns {Map<string, string>}
 */
function mappingTokenWithTestCase(testCases, listTokensList) {
  const resultMap = new Map();
  let i = 0;
  listTokensList.forEach((tokensList) => {
    tokensList.forEach((token) => {
      if (i < testCases.length) {
        resultMap.set(token, testCases[i]._id);
      }
      i += 1;
    });
  });
  return resultMap;
}

/**
 *
 * @param {Array<Array<*>>}  listObjList
 * @returns {Array<*>}
 */
function toList(listObjList) {
  if (!listObjList) {
    return [];
  }
  let result = [];
  listObjList.forEach((objList) => {
    result = [...result, ...objList];
  });
  return result;
}

/**
 *
 * @param {string | null} out
 * @returns {{stdout: string | null, file_output: string | null}}
 */
function splitStdoutAndFileOut(out) {
  if (!out) {
    return {
      stdout: null,
      file_output: null,
    };
  }
  const notFoundSplitArr = out.split(FILE_NOT_FOUND_SEPARATOR);
  if (notFoundSplitArr.length === 1) {
    // output file exist or test case does not contain output file
    const separatorArr = out.split(STDOUT_FILEOUT_SEPARATOR);
    if (separatorArr.length !== 1) {
      // both stdout and file_output exist
      const file_output = separatorArr[1].startsWith("\n")
        ? separatorArr[1].slice(1, separatorArr[1].length)
        : separatorArr[1];
      return { stdout: separatorArr[0], file_output };
    }
  }
  // output file not found
  return { stdout: notFoundSplitArr[0], file_output: null };
}

/**
 *
 * @param {Array<SubmissionResult>} submissionResList
 * @returns {Array<SubmissionResult>}
 */
function reparseSubmissionResults(submissionResList) {
  const result = [];
  for (let i = 0; i < submissionResList.length; i++) {
    const submissionRes = submissionResList[i];
    const res = {
      ...submissionRes,
      stdout: submissionRes.stdout
        ? decodeUtils.decode(submissionRes.stdout)
        : null,
      stderr: submissionRes.stderr
        ? decodeUtils.decode(submissionRes.stderr)
        : null,
      compile_output: submissionRes.compile_output
        ? decodeUtils.decode(submissionRes.compile_output)
        : null,
      expected_output: decodeUtils.decode(submissionRes.expected_output),
    };
    // console.log(res);
    if (
      parseInt(res.status.id) === JUDGE_STATUS.ACCEPTED ||
      parseInt(res.status.id) === JUDGE_STATUS.WRONG_ANS
    ) {
      const { stdout, file_output } = splitStdoutAndFileOut(res.stdout);
      const cutFileOutput = file_output
        ? file_output.substring(0, (res.max_file_size - 1) * 1024)
        : null;
      if (
        parseInt(res.status.id) === JUDGE_STATUS.WRONG_ANS &&
        cutFileOutput === res.expected_output
      ) {
        res.status = {
          id: JUDGE_STATUS.ACCEPTED,
          description: "Accepted",
        };
      }
      result.push({ ...res, stdout, file_output });
    } else {
      result.push({ ...res, file_output: null });
    }
  }
  return result;
}

/**
 * @async
 * @param {Array<string>} tokens
 * @returns {Promise<Array<SubmissionResult>>}
 */
async function getBatchSubmissions(tokens) {
  const responses = [];
  if (tokens.length > 0) {
    const batchTokenList = splitBatchSubmission(
      [...tokens],
      NUM_OF_TOKENS_PER_BATCH
    );
    // console.log("batchTokenList:");
    // console.log(batchTokenList, "\n");
    for (let i = 0; i < batchTokenList.length; i++) {
      const tokensList = batchTokenList[i];
      const response = axios({
        ...getOptionsGet(tokensList),
        url: judgeApi.SUBMIT_BATCH_SUBMISSIONS,
      });
      responses.push(response);
    }
    const responseList = await Promise.all(responses);
    const result = [];
    for (let i = 0; i < responseList.length; i++) {
      const submissionsList = responseList[i].data;
      // console.log(submissionsList.submissions);
      const resultItem = reparseSubmissionResults(submissionsList.submissions);
      // console.log(resultItem);
      result.push(resultItem);
    }
    // console.log(result);
    return toList(result);
  }
  return responses;
}

/**
 *
 * @param {number} statusId
 * @returns {boolean}
 */
function isSuccess(statusId) {
  switch (statusId) {
    case JUDGE_STATUS.ACCEPTED:
      return true;
    default:
      return false;
  }
}

function genSubmissionResultNotDone(token) {
  return {
    stdout: null,
    time: null,
    memory: -1,
    stderr: null,
    token,
    wall_time_limit: null,
    compile_output: null,
    exit_code: -1,
    message: null,
    wall_time: null,
    file_output: null,
    status: {
      id: JUDGE_STATUS.CUSTOM_ERR_NOT_DONE + "",
      description: "Not done",
    },
  };
}

/**
 *
 * @typedef JudgeSubmission
 * @property {number} wall_time_limit
 * @property {number} memory_limit
 * @property {number} max_file_size
 * @property {boolean} enable_network
 * @property {number} language_id
 * @property {string} source_code
 * @property {string} additional_files
 * @property {string} stdin
 * @property {string} command_line_arguments
 * @property {string} expected_output
 */

/**
 * Class produce functionalities for run code
 *
 * @class Judge0Worker
 * @implements {RunCodeWorkerAdapter}
 */
export class Judge0Worker {
  constructor() {}

  /**
   * @async
   * @param {Array<TestCase>} testCaseList
   * @param {string} src_code
   * @param {number} langId
   * @param {Constraint} constraint
   * @returns {Promise<Map<string, string>>}
   */
  async runCodeSubmissions(testCaseList, src_code, langId, constraint) {
    const listSubmissionsList = await buildSubmissionsData(
      testCaseList,
      src_code,
      langId,
      constraint
    );
    // console.log(listSubmissionsList);
    const listTokensList = await runBatchSubmission(listSubmissionsList);
    // console.log(listTokensList);

    return mappingTokenWithTestCase(testCaseList, listTokensList);
  }

  /**
   * @async
   * @param {Array<string>} tokenList
   * @param {number} timeout
   * @param {number} nRetry
   * @returns {Promise<{errMap: Map<string, SubmissionResult>, resultMap: Map<string, SubmissionResult}>}
   */
  async getResultSubmissions(tokenList, timeout, nRetry) {
    const resultMap = new Map();
    const errMap = new Map();
    const tokens = [...tokenList];
    for (let i = 0; i < nRetry; i++) {
      if (i !== 0) {
        console.log("retry:", i);
      }
      const responses = await getBatchSubmissions(tokens);
      // console.log(responses);
      for (let j = 0; j < responses.length; j++) {
        const response = responses[j];
        if (
          response.status.id === JUDGE_STATUS.IN_QUEUE ||
          response.status.id === JUDGE_STATUS.PROCESSING
        ) {
          console.log("cont");
          continue;
        }
        // console.log(response.status);
        if (isSuccess(response.status.id)) {
          resultMap.set(response.token, response);
        } else {
          errMap.set(response.token, response);
        }
        const index = tokens.findIndex((token) => token === response.token);
        if (index !== -1) {
          tokens.splice(index, 1);
        }
        // console.log("spliced", tokens);
      }

      if (tokens.length === 0) {
        break;
      }
      if (i !== nRetry - 1) {
        await timeUtils.sleep(timeout);
      }
    }

    // if tokens is not empty -> state == IN_QUEUE || PROCESSING
    tokens.forEach((token) => {
      resultMap.set(token, genSubmissionResultNotDone(token));
    });
    // console.log(resultMap, errMap);
    return {
      resultMap,
      errMap,
    };
  }
}
