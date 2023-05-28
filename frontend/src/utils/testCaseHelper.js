import { API } from "../common/api";
import { handlePost } from "./fetch";

export async function createTestCases(testCasesArr) {
  try {
    const reqData = { testCasesArr: JSON.stringify(testCasesArr) };
    console.log(
      "🚀 ~ file: testCaseHelper.js:8 ~ createTestCases ~ reqData:",
      reqData
    );

    const res = await handlePost(API.CREATE_TEST_CASE, reqData);
    return res;
  } catch (error) {
    console.log("🚀 ~ file: testCaseHelper.js:34 ~ error:", error);
  }
}
