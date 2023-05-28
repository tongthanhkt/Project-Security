import AWS from "aws-sdk";
import uploadModel from "../model/upload.model.js";
import env from "../utils/env.js";

const UPLOAD_PART_OP = "uploadPart";
const GET_PRESIGNED_URL_OP = "getObject";

const s3 = new AWS.S3({
  credentials: {
    accessKeyId: env.S3_ACCESS_KEY,
    secretAccessKey: env.S3_SECRET_KEY,
  },
  signatureVersion: "v4",
  region: env.S3_REGION,
});

export default {
  async initMultipartUpload(fileName) {
    const multipartUpload = await s3
      .createMultipartUpload({
        Bucket: env.S3_BUCKET_NAME,
        Key: fileName,
      })
      .promise();

    // console.log(multipartUpload);
    return multipartUpload;
  },

  async getMultipartPreSignedUrl(fileName, awsUploadId, nthPath) {
    // nthPath must be between 1 and 10,000
    const signedUrl = await s3.getSignedUrlPromise(UPLOAD_PART_OP, {
      Bucket: env.S3_BUCKET_NAME,
      Key: fileName,
      UploadId: awsUploadId,
      PartNumber: nthPath,
      Expires: 5 * 60, // default 5 mins
    });
    // console.log(signedUrl);
    return signedUrl;
  },

  async finalizeMultipartUpload(fileName, awsUploadId, parts) {
    try {
      const completeMultipartUpload = await s3
        .completeMultipartUpload({
          Bucket: env.S3_BUCKET_NAME,
          Key: fileName,
          UploadId: awsUploadId,
          MultipartUpload: {
            Parts: parts,
          },
        })
        .promise();
      // console.log(completeMultipartUpload);
      return completeMultipartUpload;
    } catch (err) {
      console.log(err);
      return null;
    }
  },

  async getSignedUrl(
    filePath,
    expireTime = uploadModel.DEFAULT_EXPIRED_RESOURCE
  ) {
    // default expiration time is 2 hours
    try {
      if (!(await this.isExist(filePath))) {
        return null;
      }
      const signedUrl = await s3.getSignedUrlPromise(GET_PRESIGNED_URL_OP, {
        Bucket: env.S3_BUCKET_NAME,
        Key: filePath,
        Expires: expireTime,
      });
      // console.log(signedUrl);
      return signedUrl;
    } catch (err) {
      console.log(err);
      return null;
    }
  },

  async isExist(filePath) {
    try {
      const params = {
        Bucket: env.S3_BUCKET_NAME,
        Key: filePath,
      };
      const info = await s3.headObject(params).promise();
      return info;
    } catch (err) {
      console.log("isExist:", err);
      return null;
    }
  },

  async remove(filePath) {
    try {
      await s3
        .deleteObject({ Bucket: env.S3_BUCKET_NAME, Key: filePath })
        .promise();
    } catch (err) {
      console.log(err);
      return null;
    }
  },
};
