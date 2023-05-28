import { DEFAULT_CONSTRAINT } from "../utils/judge.constant.js";
import { Judge0Worker } from "../worker/judge.worker.js";

const judgeClient = new Judge0Worker();

export const runCodeService = {
  /**
   * @async
   * @param {Array<TestCase>} testCaseList
   * @param {string} src_code
   * @param {number} langId
   * @param {Constraint} constraint
   * @returns {Promise<Map<string, string>>}
   */
  async runCodeSubmissions(testCaseList, src_code, langId, constraint) {
    return await judgeClient.runCodeSubmissions(
      testCaseList,
      src_code,
      langId,
      constraint
        ? constraint
        : {
            enable_network: DEFAULT_CONSTRAINT.enable_network,
            max_file_size: DEFAULT_CONSTRAINT.max_file_size,
            memory_limit: DEFAULT_CONSTRAINT.memory_limit,
            wall_time_limit: DEFAULT_CONSTRAINT.wall_time_limit,
          }
    );
  },

  /**
   * @async
   * @param {Array<string>} tokenList
   * @param {number} timeout
   * @param {number} retry
   * @returns {Promise<{errMap: Map<string, SubmissionResult>, resultMap: Map<string, SubmissionResult}>}
   */
  async getResultSubmissions(tokenList, timeout, retry) {
    return await judgeClient.getResultSubmissions(tokenList, timeout, retry);
  },
};
