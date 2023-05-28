import React from "react";
import TopicItem from "./TopicItem";
import uuid from "react-uuid";
import Empty from "../../../components/empty/Empty";

const TopicList = ({ data = [] }) => {
  return (
    <div className="flex flex-col gap-3 h-full">
      {data?.length > 0 ? (
        data?.map((item) => {
          return <TopicItem key={uuid()} topicInfo={item} />;
        })
      ) : (
        <Empty
          imgSrc="/images/resource/empty_lessons.png"
          message="Khóa học này trống"
          className="mt-12"
        />
      )}
    </div>
  );
};

export default TopicList;
