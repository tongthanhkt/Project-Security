import sendgrid from "@sendgrid/mail";
import env from "../utils/env.js";

sendgrid.setApiKey(env.SENDGRID_API_KEY);

async function sendEmail(mailMsg) {
  try {
    await sendgrid.send(mailMsg);
    return true;
  } catch (error) {
    console.error("sendgrid.worker.js: sendEmail", error);

    if (error.response) {
      console.error(error.response.body);
    }
  }
  return false;
}

/**
 * Class produce functionalities for sending email
 *
 * @class SendgridWorker
 * @implements {MailAdapter}
 */
export class SendgridWorker {
  constructor() {}

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
    const mailMsg = {
      to: toEmail,
      from: { email: fromEmail, name: "Kodemy website" },
      subject,
      templateId,
      dynamicTemplateData: customObj,
    };
    // console.log(mailMsg);
    return await sendEmail(mailMsg);
  }
}
