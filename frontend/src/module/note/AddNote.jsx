import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import BasicButton from "../../components/button/BasicButton";
import { BasicEditor } from "../../components/input/BasicEditor";
import { convertSecondsToMinutes } from "../../utils/fileHelper";
import { createNote } from "../../utils/noteHelper";

const AddNote = ({
  currentTime = 0,
  setOpen = () => {},
  setPlaying = () => {},
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const lessonId = searchParams.get("lessonId");
  const [note, setNote] = useState("");
  const handleAddNote = async () => {
    const res = await createNote(currentTime, currentTime, note, lessonId);
    console.log("🚀 ~ file: AddNote.jsx:17 ~ handleAddNote ~ res:", res);
    if (res.status === 0) {
      toast.success("Thêm ghi chú thành công");
      setOpen(false);
      setPlaying(true);
    } else {
      toast.error("Thêm ghi chú không thành công");
    }
  };
  return (
    <div className="min-h-[360px] px-48 py-4 max-h-[600px] mb-12">
      <h3 className="font-bold text-lg">
        Thêm ghi chú tại{" "}
        <span className="px-3 py-1 rounded-full bg-blue-400 font-semibold text-white">
          {convertSecondsToMinutes(currentTime)}
        </span>
      </h3>
      <BasicEditor
        className="h-[200px] my-4"
        onChange={setNote}
        value={note}
      ></BasicEditor>
      <div className=" mt-16 text-right">
        <button
          className="font-bold mr-3"
          onClick={() => {
            setOpen(false);
            setPlaying(true);
          }}
        >
          Hủy bỏ
        </button>
        <BasicButton
          className="!rounded-full !font-bold"
          onClick={handleAddNote}
        >
          Tạo ghi chú
        </BasicButton>
      </div>
    </div>
  );
};

export default AddNote;
