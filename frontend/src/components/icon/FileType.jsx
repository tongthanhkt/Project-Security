import {
  ArticleOutlined,
  AudioFileOutlined,
  InsertPhotoOutlined,
  PlayCircleFilledWhiteOutlined,
} from "@mui/icons-material";
import React from "react";
import { RESOURCE_TYPE } from "../../common/constants";

const FileType = ({ type, ...props }) => {
  switch (type) {
    case RESOURCE_TYPE.VIDEO:
      return <PlayCircleFilledWhiteOutlined {...props} />;
    case RESOURCE_TYPE.DOCUMENT:
      return <ArticleOutlined {...props} />;
    case RESOURCE_TYPE.AUDIO:
      return <AudioFileOutlined {...props} />;
    case RESOURCE_TYPE.THUMB_COURSE:
      return <InsertPhotoOutlined {...props} />;

    default:
      break;
  }
};

export default FileType;
