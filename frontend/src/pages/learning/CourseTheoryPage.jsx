/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import _ from "lodash";
import EventNoteIcon from "@mui/icons-material/EventNote";
import ModeCommentIcon from "@mui/icons-material/ModeComment";
import Player from "../../components/player/Player";
import Empty from "../../components/empty/Empty";
import { PAGE_PATH } from "../../routes/page-paths";
import DescriptionLession from "./content/DescriptionLession";
import {
  getCourseTopics,
  getLessonDetail,
  getTopicLessons,
} from "../../utils/courseHelper";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { RESOURCE_TYPE, TYPE_OF_DRAWER } from "../../common/constants";
import { QALesson } from "./q&a/QALesson";
import { usePlayer } from "../../contexts/playerContext";

const CommentAndNote = ({
  open = false,
  setOpen = () => {},
  typeDrawer,
  setTypeDrawer = () => {},
}) => {
  return (
    <div className="sticky flex gap-4 bottom-16 float-right mr-4 ">
      <div className="text-blue-500 hover:cursor-pointer hover:opacity-70  shadow-[0_0_10px_rgb(0_0_0_/_20%)] px-4 py-2 rounded-full font-semibold  bg-white hover:bg-white z-50 text-sm">
        <ModeCommentIcon className="text-blue-400" /> Hỏi đáp
      </div>

      <div
        className="text-blue-500 hover:cursor-pointer hover:opacity-70 text-sm shadow-[0_0_10px_rgb(0_0_0_/_20%)] px-4 py-2 rounded-full font-semibold bg-white hover:bg-white z-50"
        onClick={() => {
          setTypeDrawer(TYPE_OF_DRAWER.NOTE_LIST);
          // setOpen(!open);
          if (typeDrawer === TYPE_OF_DRAWER.NOTE_LIST) setOpen(!open);
          if (typeDrawer === 0) setOpen(true);
          if (typeDrawer === TYPE_OF_DRAWER.LESSON_LIST && !open) setOpen(true);
        }}
      >
        <EventNoteIcon className="text-blue-400" /> Ghi chú
      </div>
    </div>
  );
};

function findPrevNext(arr, item) {
  const index = arr.indexOf(item);
  const prev = index > 0 ? arr[index - 1] : null;
  const next = index < arr.length - 1 ? arr[index + 1] : null;
  return { prev, next };
}

const CourseTheoryPage = ({
  open = false,
  setOpen = () => {},
  typeDrawer = TYPE_OF_DRAWER.NOTE_LIST,
  setTypeDrawer = () => {},
  handleCompleteLesson = () => {},
  isDone = false,
  setIsDone = () => {},
  setNextLink = () => {},
  setPrvLink = () => {},
  topicsAndLessions = [],
}) => {
  const [lessonInfo, setLessonInfo] = useState({});

  const [currentTime, setCurrenTime] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [none, setNone] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const lessonId = searchParams.get("lessonId");
  const [resources, setResources] = useState([]);
  const [video, setVideo] = useState("");
  const { id } = useParams();
  const navigate = useNavigate();
  // const playerRef = useRef(null);
  const { playerRef } = usePlayer();
  useEffect(() => {
    const fetchData = async () => {
      if (lessonId === null) {
        const { data } = await getCourseTopics(id);

        if (data.length > 0) {
          const promises = data.map(async (item) => {
            const resLession = await getTopicLessons(item._id);
            return {
              topic: item,
              lession: resLession.data,
            };
          });

          const info = await Promise.all(promises);

          for (let i = 0; i < info.length; i++) {
            const { lession } = info[i];

            for (let j = 0; j < lession?.length; j++) {
              if (lession[j]?.isDone === false) {
                const link = `${PAGE_PATH.COURSE_LEARNING(id)}?lessonId=${
                  lession[j]?._id
                }`;

                navigate(link);
                return;
              }
            }
          }
          setNone(true);
        } else {
          setNone(true);
        }
      } else {
        const res = await getLessonDetail(lessonId);

        const { lessonInfo: lesson, resourcesInfo, resourcesLink } = res?.data;
        const resource = resourcesInfo?.map((item) => {
          return {
            ...item,
            link: resourcesLink[item._id] || "",
          };
        });

        //get link video
        let flag = 0;
        for (let i = 0; i < resource.length; i++) {
          if (resource[i]?.type === RESOURCE_TYPE.VIDEO) {
            setVideo(resource[i]?.link);
            flag++;
          }
        }
        if (flag === 0) {
          setVideo("");
        }
        setResources(resource);
        setIsDone(lesson?.isDone);
        setLessonInfo({ ...lesson });
      }
    };
    fetchData();
  }, [id, lessonId]);

  // get next, prev lesson
  useEffect(() => {
    let lessonList = [];
    for (let i = 0; i < topicsAndLessions.length; i++) {
      const { lession: lessonInTopic } = topicsAndLessions[i];
      const idList = lessonInTopic?.map((item) => item._id);
      lessonList = [...lessonList, ...idList];
    }

    const { prev, next } = findPrevNext(lessonList, lessonId);

    setNextLink(`${PAGE_PATH.COURSE_LEARNING(id)}?lessonId=${next}`);
    setPrvLink(`${PAGE_PATH.COURSE_LEARNING(id)}?lessonId=${prev}`);
  }, [lessonId, topicsAndLessions]);
  return (
    <>
      {none ? (
        <div className="h-screen">
          <Empty
            imgSrc="/images/resource/empty_lessons.png"
            message="Khóa học này trống"
            classNameParent="h-full"
          />
        </div>
      ) : (
        <div className="relative ">
          <div className=" top-0 overflow-x-hidden overscroll-contain overlay-container pt-minus-learning-nav h-minus-footer-learning">
            <Player
              playerRef={playerRef}
              playing={playing}
              url={video}
              setCurrenTime={setCurrenTime}
              handleCompleteLesson={handleCompleteLesson}
              isDone={isDone}
            />
            <DescriptionLession
              playerRef={playerRef}
              currentTime={currentTime}
              setPlaying={setPlaying}
              name={lessonInfo?.name}
              description={lessonInfo?.description}
              resources={resources}
            />
            <QALesson></QALesson>
            <h4 className="text-center font-semibold text-sm mb-4 mt-8">
              Copyright *{" "}
              <a href="/" className="text-gradient text-md">
                Kodemy
              </a>
            </h4>
          </div>
          {/* <CommentAndNote
            setTypeDrawer={setTypeDrawer}
            typeDrawer={typeDrawer}
            open={open}
            setOpen={setOpen}
          /> */}
        </div>
      )}
    </>
  );
};

export default CourseTheoryPage;
