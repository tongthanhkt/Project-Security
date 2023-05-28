/* eslint-disable no-console */
/* eslint-disable import/extensions */
/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
import express from "express";
import authenMw from "../middleware/authen.mw.js";
import testCaseModel from "../model/testCase.model.js";
import respCode from "../utils/respCode.js";
import validator from "../utils/validator.js";

const router = express.Router();

function isValidTestCase(testCase) {
  if (!testCase) {
    return false;
  }
  const { outputFileName, out, stdin, cmd_line_arg, inputFile, inputFileName } =
    testCase;
  if (
    (outputFileName !== null && !validator.isValidStr(outputFileName)) ||
    !validator.isValidStr(out) ||
    (stdin !== null && !validator.isValidStr(stdin)) ||
    (cmd_line_arg !== null && !validator.isValidStr(cmd_line_arg)) ||
    (!inputFileName && inputFileName === null && inputFile) ||
    (!inputFile && inputFile === null && inputFileName) ||
    (inputFileName !== null &&
      inputFile !== null &&
      (!validator.isValidStr(inputFileName) ||
        !validator.isValidStr(inputFile)))
  ) {
    return false;
  }
  return true;
}

router.post(
  "/add",
  authenMw.stopWhenNotLogon,
  authenMw.stopWhenNotAdminOrTA,
  async (req, res) => {
    const { testCasesArr } = req.body;
    let testCases = null;
    try {
      testCases = JSON.parse(testCasesArr);
    } catch (err) {
      console.log(err);
      return res.json({
        status: respCode.INVALID_DATA,
        message: respCode.MSG_INVALID_DATA,
      });
    }

    for (let i = 0; i < testCases.length; i++) {
      if (!isValidTestCase(testCases[i])) {
        return res.json({
          status: respCode.INVALID_DATA,
          message: respCode.MSG_INVALID_DATA,
        });
      }
    }

    const result = await testCaseModel.insertMany(testCases);
    return res.json({
      status: respCode.SUCCESS,
      data: result,
    });
  }
);

export default router;
