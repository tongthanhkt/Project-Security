import React, { useState } from "react";
import { API } from "../../../common/api";
import BasicModal from "../../../components/modal/BasicModal";
import { useParams } from "react-router-dom";
import { handlePost } from "../../../utils/fetch";
import { toast } from "react-toastify";

const ModalAddTopic = ({
  openAddTopic = () => {},
  handleCloseAddTopic = () => {},
  topicsAndLessions = [],
  setTopicsAndLessions = () => {},
}) => {
  const [topicTitle, setTopicTitle] = useState("");
  const [error, setError] = useState("");
  const { id } = useParams();
  const handleAddTopic = async () => {
    if (topicTitle.length < 6) setError("Tên chương phải chứa ít nhất 6 kí tự");
    else {
      const res = await handlePost(API.CREATE_TOPIC(id), {
        courseName: topicTitle,
      });
      console.log("🚀 ~ file: ModalAddTopic.jsx:18 ~ res ~ res:", res);
      if (res?.status === 0) {
        setTopicsAndLessions([
          ...topicsAndLessions,
          {
            topic: res?.data || [],
            lession: [],
          },
        ]);
        setTopicTitle("");
        toast.success(`Thêm chương ${topicTitle} thành công`);
        handleCloseAddTopic();
      }
      setError("");
    }
  };
  return (
    <BasicModal open={openAddTopic} handleClose={handleCloseAddTopic}>
      <div className="flex flex-col gap-4">
        <h2 className="font-bold text-xl">Thêm chương mới</h2>
        <input
          type="text"
          value={topicTitle}
          placeholder="Nhập tên topic"
          className=" rounded-lg border-blue-400 w-[400px]"
          onChange={(e) => setTopicTitle(e.target.value)}
        />
        {error && (
          <div className="text-red-400 -mt-3 ml-1 text-sm">{error}</div>
        )}
        <div className="flex gap-2  justify-center">
          <button
            className="font-semibold  px-4 py-2 rounded-lg"
            onClick={handleCloseAddTopic}
          >
            Hủy
          </button>
          <button
            className="font-semibold text-white bg-green-500 px-4 py-2 rounded-lg"
            onClick={handleAddTopic}
          >
            Tạo mới
          </button>
        </div>
      </div>
    </BasicModal>
  );
};

export default ModalAddTopic;
