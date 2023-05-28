import React, { useEffect, useState } from "react";
import CourseExcercisePage from "./CourseExcercisePage";
import CourseTheoryPage from "./CourseTheoryPage";

import LearningHeader from "./header/LearningHeader";
import LearningFooter from "./footer/LearningFooter";

//MUI
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import CssBaseline from "@mui/material/CssBaseline";
import LessionContent from "../../module/learning/LessionContent";
import NotePage from "../../module/note/NotePage";
import { TYPE_OF_DRAWER } from "../../common/constants";
import { useParams, useSearchParams } from "react-router-dom";
import {
  completeLesson,
  getCourseDetail,
  getCourseTopics,
  getTopicLessons,
} from "../../utils/courseHelper";
import { toast } from "react-toastify";
import { PlayerProvider } from "../../contexts/playerContext";

const drawerWidth = Math.floor(window.innerWidth * 0.25); //width 25%

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(
  ({ theme, open }) => ({
    flexGrow: 1,
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginRight: -drawerWidth,
    ...(open && {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginRight: 0,
    }),
  })
);

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginRight: drawerWidth,
  }),
}));

const CourseLearningPage = () => {
  const [tabIndex, setTabIndex] = React.useState(0);
  const [nextLink, setNextLink] = React.useState("#");
  const [prvLink, setPrvLink] = React.useState("#");
  const [open, setOpen] = React.useState(false);
  const [typeDrawer, setTypeDrawer] = React.useState(0);
  const [topicsAndLessions, setTopicsAndLessions] = useState([]);
  const [courses, setCourses] = React.useState({});
  const [isDone, setIsDone] = useState(false);
  const [loadingLesson, setLoadingLesson] = React.useState(false);

  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const lessonId = searchParams.get("lessonId");

  //get lesson list
  useEffect(() => {
    const getData = async (courseId) => {
      setLoadingLesson(true);
      const { data } = await getCourseTopics(courseId);
      const res = await getCourseDetail(courseId);
      setCourses({ ...res });

      if (data.length > 0) {
        const promises = data.map(async (item) => {
          const resLession = await getTopicLessons(item._id);
          return {
            topic: item,
            lession: resLession.data,
          };
        });

        const info = await Promise.all(promises);
        setTopicsAndLessions(info);
        setLoadingLesson(false);
      }
    };

    getData(id);
  }, [id, isDone]);
  const handleCompleteLesson = async (lessonId) => {
    const res = await completeLesson(lessonId);

    if (res.status === 0) {
      toast.success("Bạn đã hoàn thành bài giảng");
      setIsDone(true);
    }
  };

  const tabList = [
    {
      label: "Lý thuyết",
      component: (
        <CourseTheoryPage
          open={open}
          setOpen={setOpen}
          setTypeDrawer={setTypeDrawer}
          typeDrawer={typeDrawer}
          handleCompleteLesson={handleCompleteLesson}
          isDone={isDone}
          setIsDone={setIsDone}
          setNextLink={setNextLink}
          setPrvLink={setPrvLink}
          topicsAndLessions={topicsAndLessions}
        />
      ),
    },
    {
      label: "Bài tập",
      component: (
        <CourseExcercisePage
          // lessonId={curLesson}
          setNextLink={setNextLink}
          setPrvLink={setPrvLink}
        />
      ),
    },
  ];
  return (
    <Box sx={{ display: "flex" }}>
      <PlayerProvider>
        <CssBaseline />
        <AppBar position="fixed" sx={{ zIndex: "9999" }}>
          <LearningHeader
            setTabIndex={setTabIndex}
            tabList={tabList}
            tabIndex={tabIndex}
            setOpen={setOpen}
            open={open}
            setTypeDrawer={setTypeDrawer}
            typeDrawer={typeDrawer}
            courses={courses}
          />
        </AppBar>
        <Main open={open}>
          {tabList[tabIndex].component} {/* Q&A section */}
        </Main>
        <Drawer
          position="fixed"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: drawerWidth,
            },
          }}
          variant="persistent"
          anchor="right"
          open={open}
        >
          {typeDrawer === TYPE_OF_DRAWER.LESSON_LIST && (
            <LessionContent data={topicsAndLessions} loading={loadingLesson} />
          )}
          {typeDrawer === TYPE_OF_DRAWER.NOTE_LIST && <NotePage />}
        </Drawer>
        <LearningFooter next={nextLink} prev={prvLink} />
      </PlayerProvider>
    </Box>
  );
};

export default CourseLearningPage;
