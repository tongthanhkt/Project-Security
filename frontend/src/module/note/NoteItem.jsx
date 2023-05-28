import React, { useEffect, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import Edit from "@mui/icons-material/Edit";
import { BasicEditor } from "../../components/input/BasicEditor";
import usePopup from "../../hooks/usePopup";
import ConfirmPopup from "../../components/modal/ConfirmPopup";
import BasicButton from "../../components/button/BasicButton";
import { convertSecondsToMinutes } from "../../utils/fileHelper";
import { API } from "../../common/api";
import { handlePost } from "../../utils/fetch";
import { toast } from "react-toastify";
import { useSearchParams } from "react-router-dom";
import { usePlayer } from "../../contexts/playerContext";
const NoteItem = ({
  data = {},
  handleDelete = () => {},
  lesson = {},
  topic = {},
}) => {
  const [toggleEdit, setToggleEdit] = useState(false);
  const [note, setNote] = useState("");
  const { open, handleOpenPopup, handleClosePopup } = usePopup();
  const [searchParams, setSearchParams] = useSearchParams();
  const lessonId = searchParams.get("lessonId");
  const { playerRef } = usePlayer();
  useEffect(() => {
    setNote(data?.note);
  }, []);

  const handleUpdate = async () => {
    const payload = {
      noteId: data?._id,
      startTs: data?.startTs,
      endTs: data?.endTs,
      note,
    };
    const res = await handlePost(API.UPDATE_NOTE(lessonId), payload);
    if (res.status === 0) {
      toast.success("Cập nhật ghi chú thành công");
    } else {
      setNote(data?.note);
    }
  };
  const handleMoveToTime = () => {
    const time = data?.startTs;
    if (time < 1) playerRef.current?.seekTo(1);
    else playerRef.current?.seekTo(time);
  };

  return (
    <>
      <div className="mt-8">
        <div className="flex justify-between items-center ">
          <div className="flex gap-2">
            <span
              className="font-semibold text-sm text-white cursor-pointer rounded-full px-3 py-1 bg-blue-400"
              onClick={handleMoveToTime}
            >
              {convertSecondsToMinutes(data?.startTs)}
            </span>
            <span
              className="ml-2 font-semibold text-gradient text-sm text-one-line max-w-[100px]"
              title={topic?.name}
            >
              {topic?.name}
            </span>
            <span
              className="text-gray-900 font-semibold  text-sm text-one-line max-w-[120px]"
              title={lesson?.name}
            >
              {lesson?.name}
            </span>
          </div>
          <div className="flex gap-2">
            <div
              className="cursor-pointer text-gray-500"
              onClick={() => setToggleEdit(!toggleEdit)}
            >
              <Edit />
            </div>
            <div
              className="cursor-pointer text-gray-500"
              onClick={handleOpenPopup}
            >
              <DeleteIcon />
            </div>
          </div>
        </div>
        {!toggleEdit ? (
          <div
            className="p-4 mt-4 bg-[#f7f8fa] rounded-md text-sm"
            dangerouslySetInnerHTML={{ __html: note }}
          ></div>
        ) : (
          <>
            <BasicEditor className="my-4" value={note} onChange={setNote} />
            <div className="text-right">
              <button
                className="mr-4 font-bold rounded-lg"
                onClick={() => {
                  setToggleEdit(false);
                  setNote(data?.note);
                }}
              >
                Hủy
              </button>
              <BasicButton
                variant="none"
                sx={{ borderRadius: 3, color: "#fff" }}
                onClick={() => {
                  handleUpdate();
                  setToggleEdit(false);
                }}
              >
                Cập nhật
              </BasicButton>
            </div>
          </>
        )}
      </div>

      <ConfirmPopup
        isOpen={open}
        handleClose={handleClosePopup}
        handleConfirm={() => handleDelete(data?._id)}
      >
        Bạn có chắc chắn xóa ghi chú này?
      </ConfirmPopup>
    </>
  );
};

export default NoteItem;
