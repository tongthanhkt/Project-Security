import env from "./env.js";

export default {
  SUBMIT_SINGLE_SUBMISSION: `${env.JUDGE0_SERVER}/submissions`,
  SUBMIT_BATCH_SUBMISSIONS: `${env.JUDGE0_SERVER}/submissions/batch`,

  getSingleSubmission(token) {
    if (token.toString().length > 0) {
      return `${env.JUDGE0_SERVER}/submissions/${token}`;
    }
    return null;
  },

  getBatchSubmissions(tokenList) {
    if (tokenList.length > 0) {
      let tokens = tokenList[0];
      for (let i = 1; i < tokenList.length; i++) {
        const token = array[i];
        tokens = tokens.concat(",", token);
      }
      return `${env.JUDGE0_SERVER}/batch?tokens=${tokens}`;
    }
    return null;
  },
};
