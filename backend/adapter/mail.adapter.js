class MailAdapter {
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
    throw new Error("not implemented");
  }
}
