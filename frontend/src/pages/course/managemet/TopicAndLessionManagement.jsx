import React, { useEffect, useState } from "react";
import BasicButton from "../../../components/button/BasicButton";
import usePopup from "../../../hooks/usePopup";
import TopicItem from "../../../module/courses/topic/TopicItem";
import ModalAddTopic from "../../../module/courses/topic/ModalAddTopic";
import ModalAddLession from "../../../module/courses/lession/ModalAddLession";
import { useParams } from "react-router-dom";
import { getCourseTopics, getTopicLessons } from "../../../utils/courseHelper";
import TopicList from "../../../module/courses/topic/TopicList";

const TopicAndLessionManagement = () => {
  const [topicsAndLessions, setTopicsAndLessions] = useState([]);

  const { id } = useParams();

  const {
    open: openAddTopic,
    handleClosePopup: handleCloseAddTopic,
    handleOpenPopup: handleOpenAddTopic,
  } = usePopup();

  useEffect(() => {
    const getData = async (courseId) => {
      const { data } = await getCourseTopics(courseId);

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
      }
    };

    getData(id);
  }, [id]);
  return (
    <>
      <div>
        <div className="flex justify-between mb-4">
          <h1 className="font-bold text-3xl">Danh sách các chương</h1>
          <BasicButton
            variant="none"
            className="!text-white"
            onClick={handleOpenAddTopic}
          >
            Thêm chương mới
          </BasicButton>
        </div>
        <TopicList data={topicsAndLessions} />
        <ModalAddTopic
          openAddTopic={openAddTopic}
          handleCloseAddTopic={handleCloseAddTopic}
          topicsAndLessions={topicsAndLessions}
          setTopicsAndLessions={setTopicsAndLessions}
        />
      </div>
    </>
  );
};

export default TopicAndLessionManagement;
