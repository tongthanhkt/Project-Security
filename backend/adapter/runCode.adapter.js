/**
 *
 * @typedef TestCase
 * @property {string} _id
 * @property {string} outputFileName
 * @property {string} out
 * @property {string} stdin
 * @property {string} cmd_line_arg
 * @property {string} inputFile
 * @property {string} inputFileName
 */

/**
 *
 * @typedef Constraint
 * @property {number} wall_time_limit
 * @property {number} memory_limit
 * @property {number} max_file_size
 * @property {boolean} enable_network
 */

/**
 *
 * @typedef SubmissionResult
 * @property {string | null} stdout
 * @property {string | null} file_output
 * @property {string} time
 * @property {string} expected_output
 * @property {number} memory
 * @property {string | null} stderr
 * @property {string} token
 * @property {string} wall_time_limit
 * @property {number} max_file_size
 * @property {string | null} compile_output
 * @property {number} exit_code
 * @property {string | null} message
 * @property {string} wall_time
 * @property {{id: string, description: string}} status
 */

/**
 * Interface for classes that represent a run code worker
 * @interface
 */
class RunCodeWorkerAdapter {
  constructor() {}

  /**
   * @async
   * @param {Array<TestCase>} testCaseList
   * @param {string} src_code
   * @param {number} langId
   * @param {Constraint} constraint
   * @returns {Map<string, string>}
   */
  async runCodeSubmissions(testCaseList, src_code, langId, constraint) {
    throw new Error("not implemented");
  }

  /**
   * @async
   * @param {Array<string>} tokenList
   * @param {number} timeout
   * @param {number} retry
   * @returns {Promise<{errMap: Map<string, SubmissionResult>, resultMap: Map<string, SubmissionResult}>}
   */
  async getResultSubmissions(tokenList, timeout, retry) {
    throw new Error("not implemented");
  }
}
