import React from "react";
import LessionItem from "./LessionItem";

const LessionList = ({ lessions = [] }) => {
  return (
    <div className="flex flex-col gap-3">
      {lessions?.length > 0 ? (
        lessions.map((item, index) => (
          <LessionItem index={index + 1} key={item._id} lession={item} />
        ))
      ) : (
        <div className="w-full">
          <img
            src="/images/resource/empty_lessons.png"
            alt="empty_image"
            className="mx-auto"
          />
          <h3 className="text-center text-gray-400 font-semibold">
            Chưa có bài giảng
          </h3>
        </div>
      )}
    </div>
  );
};

export default LessionList;
