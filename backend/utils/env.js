import dotenv from "dotenv";
import decodeUtils from "./decodeUtils.js";

dotenv.config();

const args = process.argv.slice(2);
const isDev = !args[0] || args[0].toLowerCase() === "dev";

const envVar = {
  DB_HOST: process.env.DB_HOST,
  DB_USER: process.env.DB_USER,
  DB_PASS: process.env.DB_PASS,
  DB_NAME: process.env.DB_NAME,
  SECRET_APP: process.env.SECRET_APP,
  PORT: process.env.PORT,
  EXP_TOK_TIME: process.env.EXP_TOK_TIME,
  EXP_TOK_LONG_TIME: process.env.EXP_TOK_LONG_TIME,
  IS_DEV: isDev,
  IS_ONRENDER: process.env.IS_ONRENDER || false,

  DOMAIN: isDev ? process.env.DOMAIN_DEV : process.env.DOMAIN,
  DOMAIN_DEV: process.env.DOMAIN_DEV,
  GG_APP_ID: process.env.GG_APP_ID,
  GG_SECRET: process.env.GG_SECRET,
  GG_CALLBACK_URL: process.env.DOMAIN + process.env.GG_CALLBACK_URL,

  JITSI_APP_ID: process.env.JITSI_APP_ID || "my_jitsi_app_id",
  JITSI_SECRET: process.env.JITSI_SECRET || "my_jitsi_app_secret",

  JUDGE0_SERVER: process.env.JUDGE0_SERVER,

  REDIS_PUB_SUB_HOST: isDev
    ? process.env.REDIS_PUB_SUB_STAG_SERVER
    : process.env.REDIS_PUB_SUB_SERVER,
  REDIS_PUB_SUB_PORT: isDev
    ? process.env.REDIS_PUB_SUB_STAG_PORT
    : process.env.REDIS_PUB_SUB_PORT,

  SENDGRID_API_KEY: decodeUtils.decode(process.env.SENDGRID_API_KEY),
  SENDGRID_FORGOT_PWD_TEMPLATE: decodeUtils.decode(
    process.env.SENDGRID_FORGOT_PWD_TEMPLATE
  ),
  SENDGRID_VERIFY_EMAIL_TEMPLATE: decodeUtils.decode(
    process.env.SENDGRID_VERIFY_EMAIL_TEMPLATE
  ),
  SENDGRID_TA_INVITATION_TEMPLATE: decodeUtils.decode(
    process.env.SENDGRID_TA_INVITATION_TEMPLATE
  ),
  SENDGRID_FROM_EMAIL: process.env.SENDGRID_FROM_EMAIL,

  STORAGE_CERT_NAME: process.env.STORAGE_CERT_NAME,
  STORAGE_BUCKET: process.env.STORAGE_BUCKET,

  S3_REGION: process.env.S3_REGION || "ap-southeast-1",
  S3_BUCKET_NAME: process.env.S3_BUCKET_NAME || "kodemyvideoresources",
  S3_ACCESS_KEY: process.env.S3_ACCESS_KEY,
  S3_SECRET_KEY: process.env.S3_SECRET_KEY,

  AVT_MAX_SIZE: process.env.AVT_MAX_SIZE || 1 * 1024 * 1024, // in bytes
  STORAGE_BUCKET: process.env.STORAGE_BUCKET || "kodemy.appspot.com",
  STORAGE_CERT_NAME:
    process.env.STORAGE_CERT_NAME || "kodemy-firebase-adminsdk.json",
};

export default envVar;
