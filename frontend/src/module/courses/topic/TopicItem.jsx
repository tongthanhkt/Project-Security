import { Book, MenuBook } from "@mui/icons-material";
import React, { useEffect, useState } from "react";
import BasicAccordion from "../../../components/accordion/BasicAccordion";
import usePopup from "../../../hooks/usePopup";
import LessionItem from "../lession/LessionItem";
import LessionList from "../lession/LessionList";
import ModalAddLession from "../lession/ModalAddLession";

const TopicItem = ({ topicInfo = {} }) => {
  const { topic, lession } = topicInfo;
  const {
    open: openAddLession,
    handleClosePopup: handleCloseAddLession,
    handleOpenPopup: handleOpenAddLession,
  } = usePopup();
  const [lessonList, setLessonList] = useState([]);
  useEffect(() => {
    setLessonList(lession);
  }, [lession]);
  return (
    <>
      <BasicAccordion
        title={topic?.name}
        openIcon={<MenuBook />}
        closeIcon={<Book />}
        subInfo={`${lession.length || 0} Bài giảng`}
      >
        <LessionList lessions={lessonList} />
        <div className="w-full text-center">
          <button
            className=" bg-gray-200 mt-4 px-4 py-2 rounded-lg "
            onClick={handleOpenAddLession}
          >
            + Thêm bài giảng
          </button>
        </div>
      </BasicAccordion>
      <ModalAddLession
        topic={topic}
        openAddLession={openAddLession}
        handleCloseAddLession={handleCloseAddLession}
        lessonList={lessonList}
        setLessonList={setLessonList}
      />
    </>
  );
};

export default TopicItem;
