import express from "express";
import authenMw from "../middleware/authen.mw.js";
import uploadModel from "../model/upload.model.js";
import RESP from "../utils/respCode.js";
import uploadWorker from "../worker/upload.worker.js";
import numberUtils from "../utils/numberUtils.js";
import { UPLOAD_STATUS } from "../utils/database.js";
import authenModel from "../model/authen.model.js";
import resourceModel, { RESOURCE_TYPE } from "../model/resource.model.js";

const router = express.Router();

function isPartInfoListValid(partInfoList) {
  try {
    const arrayObj = JSON.parse(partInfoList.toString());
    for (let i = 0; i < arrayObj.length; i++) {
      const { PartNumber, ETag } = arrayObj[i];
      if (
        !PartNumber ||
        !ETag ||
        !numberUtils.isNumberic(PartNumber) ||
        ETag.toString().trim().length === 0
      ) {
        return null;
      }
    }
    return JSON.parse(partInfoList.toString());
  } catch (err) {
    console.log(err);
    return null;
  }
}

function compare(partA, partB) {
  if (partA.PartNumber < partB.PartNumber) {
    return -1;
  }
  if (partA.PartNumber > partB.PartNumber) {
    return 1;
  }
  return 0;
}

router.post(
  "/start-upload",
  authenMw.stopWhenNotLogon,
  authenMw.stopWhenNotAdminOrTA,
  async (req, res) => {
    try {
      const { fileName } = req.body;
      if (!fileName || fileName.toString().trim().length === 0) {
        return res.json({
          status: RESP.INVALID_DATA,
          message: RESP.MSG_INVALID_DATA,
        });
      }

      const ownerId = authenModel.getUidFromReq(req);
      const resId = uploadModel.genId();
      const filePath = uploadModel.toFilePath(resId, fileName);
      const multipartUpload = await uploadWorker.initMultipartUpload(filePath);
      const uploadId = multipartUpload.UploadId;
      const resource = await uploadModel.create({
        _id: resId,
        fileName,
        uploadId,
        uploaderId: ownerId,
      });

      if (!resource) {
        return res.json({
          status: RESP.INTERNAL_ERR,
          message: RESP.MSG_INTERNAL_ERR,
        });
      }

      return res.json({
        status: RESP.SUCCESS,
        data: {
          resourceId: resId,
          fileName,
          uploadId,
        },
      });
    } catch (err) {
      console.log(err);
      res.json({
        status: RESP.INTERNAL_ERR,
        message: RESP.MSG_INTERNAL_ERR,
      });
    }
  }
);

router.post(
  "/part-upload",
  authenMw.stopWhenNotLogon,
  authenMw.stopWhenNotAdminOrTA,
  async (req, res) => {
    try {
      const { resourceId, nthPath } = req.body;
      if (
        !resourceId ||
        resourceId.toString().trim().length === 0 ||
        !nthPath ||
        !numberUtils.isNumberic(nthPath) ||
        numberUtils.toNum(nthPath) <= 0
      ) {
        return res.json({
          status: RESP.INVALID_DATA,
          message: RESP.MSG_INVALID_DATA,
        });
      }

      const resource = await uploadModel.findById(resourceId);
      if (!resource || resource.status !== UPLOAD_STATUS.UPLOADING) {
        return res.json({
          status: RESP.NOT_FOUND,
          message: RESP.MSG_NOT_FOUND,
        });
      }

      const presignedUrl = await uploadWorker.getMultipartPreSignedUrl(
        uploadModel.toFilePath(resourceId, resource.name),
        resource.uploadId,
        numberUtils.toNum(nthPath)
      );

      return res.json({
        status: RESP.SUCCESS,
        data: {
          presignedUrl,
        },
      });
    } catch (err) {
      console.log(err);
      res.json({
        status: RESP.INTERNAL_ERR,
        message: RESP.MSG_INTERNAL_ERR,
      });
    }
  }
);

router.post(
  "/complete-upload",
  authenMw.stopWhenNotLogon,
  authenMw.stopWhenNotAdminOrTA,
  async (req, res) => {
    try {
      const { resourceId, partInfoList, type, length } = req.body;
      if (
        !resourceId ||
        resourceId.toString().trim().length === 0 ||
        !partInfoList ||
        !type ||
        !resourceModel.isValidResourceType(type) ||
        ((type === RESOURCE_TYPE.AUDIO || type === RESOURCE_TYPE.VIDEO) &&
          (!length ||
            !numberUtils.isNumberic(length) ||
            numberUtils.toNum(length) <= 0))
      ) {
        return res.json({
          status: RESP.INVALID_DATA,
          message: RESP.MSG_INVALID_DATA,
        });
      }

      const partsInfo = isPartInfoListValid(partInfoList);
      if (!partsInfo) {
        return res.json({
          status: RESP.INVALID_DATA,
          message: RESP.MSG_INVALID_DATA,
        });
      }

      partsInfo.sort(compare);
      console.log(partsInfo);

      const resource = await uploadModel.findById(resourceId);
      if (!resource || resource.status !== UPLOAD_STATUS.UPLOADING) {
        return res.json({
          status: RESP.NOT_FOUND,
          message: RESP.MSG_NOT_FOUND,
        });
      }

      const filePath = uploadModel.toFilePath(resourceId, resource.name);
      if (
        !(await uploadWorker.finalizeMultipartUpload(
          filePath,
          resource.uploadId,
          partsInfo
        ))
      ) {
        return res.json({
          status: RESP.UPLOAD_NOT_FOUND,
          message: RESP.UPLOAD_MSG_NOT_FOUND,
        });
      }

      const objInfo = await uploadWorker.isExist(filePath);
      if (!objInfo || !objInfo.ContentLength) {
        console.log("Error to get size of uploaded file");
        return res.json({
          status: RESP.INTERNAL_ERR,
          message: RESP.MSG_INTERNAL_ERR,
        });
      }
      uploadModel.update({
        _id: resourceId,
        size: objInfo.ContentLength,
        type,
        length: length ? numberUtils.toNum(length) : 0,
      });
      // TODO: get size of file

      return res.json({
        status: RESP.SUCCESS,
      });
    } catch (err) {
      console.log(err);
      res.json({
        status: RESP.INTERNAL_ERR,
        message: RESP.MSG_INTERNAL_ERR,
      });
    }
  }
);

export default router;
