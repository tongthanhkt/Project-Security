import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ReorderIcon from "@mui/icons-material/Reorder";
import { TYPE_OF_DRAWER } from "../../../common/constants";
import EventNoteIcon from "@mui/icons-material/EventNote";

const BackToCourseDetail = ({ courseTitle = "", id = "" }) => {
  const navigate = useNavigate();
  return (
    <div className="flex gap-2 items-center">
      <button
        onClick={() => {
          navigate(`/course-detail/${id}`);
        }}
        className="hover:opacity-60"
      >
        <ArrowBackIosIcon className="!text-[20px]" />
      </button>
      <img className="-mb-2 ml-2" src="/images/mini_logo.svg" alt="" />
      <span>{courseTitle}</span>
    </div>
  );
};
const LearningHeader = ({
  tabIndex = 1,
  setTabIndex = () => {},
  tabList = [],
  courses = {},
  setOpen = () => {},
  open = false,
  setTypeDrawer = () => {},
  typeDrawer = TYPE_OF_DRAWER.LESSON_LIST,
}) => {
  const { id } = useParams();

  return (
    <div className="fixed w-screen px-4 flex justify-between bg-slate-800 text-gray-300 py-3 ">
      <BackToCourseDetail courseTitle={courses?.name} id={id} />
      <ul className="flex gap-2 items-center mx-auto absolute left-1/2 top-1/2 -translate-x-2/4 -translate-y-2/4 ">
        {tabList.map((item, index) => (
          <li
            key={index}
            className={`text-gray-100 cursor-pointer ${
              index === tabIndex && "!text-blue-400"
            }`}
            onClick={() => setTabIndex(index)}
          >
            {item.label}
          </li>
        ))}
      </ul>

      <div className="flex gap-6 items-center cursor-pointer">
        <div
          onClick={() => {
            setTypeDrawer(TYPE_OF_DRAWER.NOTE_LIST);
            // setOpen(!open);
            if (typeDrawer === TYPE_OF_DRAWER.NOTE_LIST) setOpen(!open);
            if (typeDrawer === 0) setOpen(true);
            if (typeDrawer === TYPE_OF_DRAWER.LESSON_LIST && !open)
              setOpen(true);
          }}
        >
          {" "}
          <EventNoteIcon /> Ghi chú
        </div>
        <div
          className="flex gap-1"
          onClick={() => {
            setTypeDrawer(TYPE_OF_DRAWER.LESSON_LIST);
            if (typeDrawer === TYPE_OF_DRAWER.LESSON_LIST) setOpen(!open);
            if (typeDrawer === 0) setOpen(true);
            if (typeDrawer === TYPE_OF_DRAWER.NOTE_LIST && !open) setOpen(true);
          }}
        >
          {/* <TemporaryDrawer
            anchor="right"
            title={
              <>
                <ReorderIcon />
                <span className="pr-4">Nội dung bài học</span>
              </>
            }
            className="drawer-right-content"
          >
            <LessionContent></LessionContent>
          </TemporaryDrawer> */}
          <ReorderIcon />
          <span className="pr-4">Nội dung bài học</span>
        </div>
      </div>
    </div>
  );
};

export default LearningHeader;
