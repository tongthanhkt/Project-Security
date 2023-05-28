/* eslint-disable import/extensions */
import mongoose from "mongoose";
import env from "./env.js";

export const connectionInfo = {
  host: env.DB_HOST,
  dbName: env.DB_NAME,
  user: env.DB_USER,
  password: env.DB_PASS,
  connectionUrl: `mongodb+srv://${env.DB_USER}:${env.DB_PASS}@${env.DB_HOST}/${env.DB_NAME}`,
};

export const STATUS_ACCOUNT = {
  activated: 0,
  verifying: 1,
};

export const ROLE = {
  ADMIN: 0,
  TA: 1,
  STUDENT: 2,
  VIP_STUDENT: 3,
  BAN: -1,
};

export const UPLOAD_STATUS = {
  DONE: 0,
  UPLOADING: 1,
};

export function isValidRole(role) {
  switch (role) {
    case ROLE.ADMIN:
    case ROLE.TA:
    case ROLE.STUDENT:
    case ROLE.VIP_STUDENT:
    case ROLE.BAN:
      return true;

    default:
      return false;
  }
}

export const DEFAULT_LIMIT = 5;

export function getNewObjectId() {
  return new mongoose.Types.ObjectId();
}

export function toObjectId(objIdStr) {
  return mongoose.Types.ObjectId(objIdStr);
}

export const { Schema } = mongoose;
export const { ObjectId } = mongoose;

const db = mongoose.createConnection(connectionInfo.connectionUrl);

export default db;
