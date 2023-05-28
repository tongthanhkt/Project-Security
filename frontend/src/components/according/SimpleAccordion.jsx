import * as React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { PAGE_PATH } from "../../routes/page-paths";
import { useRef } from "react";
import { convertSecondsToMinutes } from "../../utils/fileHelper";
const LessionItem = ({ lesson = {}, index = 1 }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const lessonId = searchParams.get("lessonId");
  const { id } = useParams(); //ID COURSE
  const naviagte = useNavigate();

  var link = `${PAGE_PATH.COURSE_LEARNING(id)}?lessonId=${lesson?._id}`;
  return (
    <div
      className={`flex items-center justify-between px-5 py-2 border-b-2 hover:bg-slate-100 cursor-pointer ${
        lesson?.isDone && "bg-gray-100"
      } ${lessonId === lesson?._id && "!bg-blue-100 "}`}
      onClick={() => {
        naviagte(link);
      }}
    >
      <div className="flex flex-col gap-2">
        <div className="text-sm max-w-[280px] text-one-line">
          {index + 1}. {lesson?.name}
        </div>
        <div className="ml-2 text-[12px]  text-gray-600">
          <PlayCircleIcon className="!text-[18px] " />{" "}
          {convertSecondsToMinutes(lesson?.videoResource?.length || 0)}
        </div>
      </div>
      {lesson?.isDone && (
        <CheckCircleIcon className="text-[#5db85c] !text-[18px]"></CheckCircleIcon>
      )}
    </div>
  );
};
export default function SimpleAccordion({ data = [] }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const lessonId = searchParams.get("lessonId");
  const [expanded, setExpanded] = React.useState(false);
  const handleAccordionChange = (event, isExpanded) => {
    setExpanded(isExpanded);
  };

  const isLessionInTopic = (lessonList) => {
    for (let i = 0; i < lessonList.length; i++) {
      if (lessonList[i]._id === lessonId) {
        return true;
      }
    }
    return false;
  };

  return (
    <div className="pb-[50px]">
      {data?.length > 0 &&
        data?.map((item, index) => {
          const inTopic = isLessionInTopic(item?.lession) || false;

          return (
            <Accordion
              defaultExpanded={inTopic}
              // expanded={inTopic || expanded}
              // onChange={handleAccordionChange}
              className="!border-none !shadow-none  !m-0"
              key={item?.topic?._id}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                className="!bg-[#f7f8fa]"
              >
                <div className="font-semibold">
                  {index + 1}. {item?.topic?.name}
                </div>
              </AccordionSummary>
              <AccordionDetails className="!p-0">
                {item?.lession?.length > 0 ? (
                  item?.lession?.map((lesson, index) => (
                    <LessionItem
                      key={lesson._id}
                      index={index}
                      lesson={lesson}
                    />
                  ))
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    Chưa có bài giảng
                  </div>
                )}
              </AccordionDetails>
            </Accordion>
          );
        })}
    </div>
  );
}
