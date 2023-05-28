import env from "../utils/env.js";
import { SendgridWorker } from "../worker/sendgrid.worker.js";

const sendGridCli = new SendgridWorker();

export const mailService = {
  /**
   *
   * @param {string} subject
   * @param {string} templateId
   * @param {string} fromEmail
   * @param {string} toEmail
   * @param {*} customObj
   * @returns {Promise<Boolean>}
   */
  async sendEmail(subject, templateId, fromEmail, toEmail, customObj) {
    // if (!env.IS_DEV) {
    return await sendGridCli.sendEmail(
      subject,
      templateId,
      fromEmail,
      toEmail,
      customObj
    );
    // }
    // return true;
  },
};
