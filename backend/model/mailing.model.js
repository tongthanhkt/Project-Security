/* eslint-disable no-console */
/* eslint-disable import/extensions */
import { mailService } from "../service/mail.service.js";
import env from "../utils/env.js";

export default {
  async sendVerifyEmail({ name, email, hours = 24, token }) {
    const verifyLink = `${env.DOMAIN}/verification/verify-email?token=${token}`;

    return await mailService.sendEmail(
      `Verify your email at Kodemy website`,
      env.SENDGRID_VERIFY_EMAIL_TEMPLATE,
      env.SENDGRID_FROM_EMAIL,
      email,
      {
        name,
        link: verifyLink,
        hours,
      }
    );
  },

  async sendTAInvitationEmail({ email, token, hours = 24 }) {
    const invitationLink = `${env.DOMAIN}/invitation/teaching-assistant/join?token=${token}`;

    return await mailService.sendEmail(
      `You have an invitation to join to Kodemy website`,
      env.SENDGRID_TA_INVITATION_TEMPLATE,
      env.SENDGRID_FROM_EMAIL,
      email,
      {
        link: invitationLink,
        name: email,
        hours,
      }
    );
  },

  async sendForgotPwdEmail({ email, token, name, hours = 24 }) {
    const verifyLink = `${env.DOMAIN}/forgot-password/reset?token=${token}`;

    return await mailService.sendEmail(
      `Reset your password at Kodemy website`,
      env.SENDGRID_FORGOT_PWD_TEMPLATE,
      env.SENDGRID_FROM_EMAIL,
      email,
      {
        name,
        link: verifyLink,
        hours,
      }
    );
  },
};
