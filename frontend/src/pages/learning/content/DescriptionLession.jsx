/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useRef, useState } from "react";
import TemporaryDrawer from "../../../components/drawer/TemporaryDrawer";
import AddNote from "../../../module/note/AddNote";
import { convertSecondsToMinutes } from "../../../utils/fileHelper";
import { usePlayer } from "../../../contexts/playerContext";
import ArticleIcon from "@mui/icons-material/Article";
import AudioFileIcon from "@mui/icons-material/AudioFile";
import { RESOURCE_TYPE } from "../../../common/constants";
import ImageIcon from "@mui/icons-material/Image";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
const DescriptionLession = ({
  currentTime = 0,
  name = "Tên của bài giảng",
  description = "<strong>Đây là mô tả của bài giảng</strong>",
  setPlaying = () => {},
  resources = [],
}) => {
  const [newResource, setNewResource] = useState(resources);

  //for read more
  const [expanded, setExpanded] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const descriptionRef = useRef(null);

  useEffect(() => {
    if (descriptionRef.current.clientHeight > 80) {
      setShowButton(true);
    }
  }, []);
  function toggleExpanded() {
    setExpanded(!expanded);
  }

  useEffect(() => {
    let flag = 0;
    const temp = [];
    for (let i = 0; i < resources.length; i++) {
      if (resources[i].type === RESOURCE_TYPE.VIDEO) {
        flag++;
        if (flag > 1) {
          //ko phai video dau tien
          temp.push(resources[i]);
        }
      } else {
        temp.push(resources[i]);
      }
    }
    setNewResource(temp);
  }, [resources]);
  const [open, setOpen] = useState(true); //for drawer children
  return (
    <div className="px-48 mt-4">
      <div className="flex items-center justify-between">
        <h1 className="font-bold text-2xl">{name}</h1>
        <TemporaryDrawer
          isOpen={open}
          anchor="bottom"
          setPlaying={setPlaying}
          title={
            <button
              className="bg-gray-300 text-gray-900 px-4 py-2 rounded-md text-sm"
              onClick={() => {
                setOpen(true);
              }}
            >
              + Thêm ghi chú tại{" "}
              <strong>{convertSecondsToMinutes(currentTime)}</strong>
            </button>
          }
          className="drawer-right-content"
        >
          <AddNote
            currentTime={currentTime}
            setOpen={setOpen}
            setPlaying={setPlaying}
          />
        </TemporaryDrawer>
      </div>
      <div className="rounded-lg bg-slate-100 p-3 mt-4">
        <div className="">
          <h5 className="font-semibold text-gray-900 -mb-2">Mô tả bài giảng</h5>
          <div
            className={`mt-4 text-sm text-gray-800 max-w-4xl ${
              expanded ? "" : "h-[80px] overflow-hidden"
            }`}
            dangerouslySetInnerHTML={{ __html: description }}
            ref={descriptionRef}
          ></div>
          {showButton && (
            <div
              className="ml-auto w-fit text-right font-semibold cursor-pointer"
              onClick={toggleExpanded}
            >
              {expanded ? "Ẩn bớt" : "Đọc thêm"}
            </div>
          )}
        </div>
      </div>
      <ResourceList resources={newResource} />
    </div>
  );
};
const ResourceList = ({ resources = [] }) => {
  return (
    <div className="mt-4">
      <div className="mb-2">
        <span className="font-semibold text-gray-900 mr-2">Tài liệu</span>
        <span className=" text-sm">(Ấn vào để tải về)</span>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {resources?.length > 0 &&
          resources?.map((item) => {
            return (
              <a
                href={item?.link}
                className="rounded-lg bg-sky-100 px-3 py-2 cursor-pointer font-medium flex gap-2 items-center leading-tight"
                // download
                title={item?.name}
              >
                {item?.type === RESOURCE_TYPE.THUMB_COURSE && <ImageIcon />}
                {item?.type === RESOURCE_TYPE.DOCUMENT && <ArticleIcon />}
                {item?.type === RESOURCE_TYPE.AUDIO && <AudioFileIcon />}
                {item?.type === RESOURCE_TYPE.VIDEO && <PlayCircleIcon />}
                <div className="text-two-line"> {item?.name}</div>
              </a>
            );
          })}
      </div>
    </div>
  );
};

export default DescriptionLession;
