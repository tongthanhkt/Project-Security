import { MenuBook } from "@mui/icons-material";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { BasicEditor } from "../../../components/input/BasicEditor";
import MultipleFileUpload from "../../../components/input/file/MultipleFileUpload";
import BasicModal from "../../../components/modal/BasicModal";
import ConfirmPopup from "../../../components/modal/ConfirmPopup";
import useMultiUpload from "../../../hooks/upload/useMultiUpload";
import usePopup from "../../../hooks/usePopup";
import UploadResourcePage from "../../../pages/resource/UploadResourcePage";
import { createLesson } from "../../../utils/courseHelper";
import FileList from "./FileList";
import LockResetIcon from "@mui/icons-material/LockReset";
const ModalAddLession = ({
  topic = {},
  openAddLession = () => {},
  handleCloseAddLession = () => {},
  setLessonList = () => {},
  lessonList = [],
}) => {
  const [lessionDesc, setLessionDesc] = useState("");
  const [lessionTitle, setLessionTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const { id } = useParams();

  const [files, setFiles] = useState([]);
  const { open, handleOpenPopup, handleClosePopup } = usePopup();
  const {
    handleInitUploadMulti,
    handleUploadMulti,
    listResource,
    isUploading,
  } = useMultiUpload(files);

  const removeFile = (filename) => {
    setFiles(files.filter((file) => file.name !== filename));
  };
  const resetField = () => {
    setLessionDesc("");
    setLessionTitle("");
    setFiles([]);
  };

  const handleAddLesson = async () => {
    setLoading(true);
    const data = {
      topic: topic?._id,
      name: lessionTitle,
      description: lessionDesc,
      resourceIds: [],
      exerciseIds: [],
      isVisible: true,
    };

    let isUploadSuccess = false;
    //upload resource
    if (files.length > 0) {
      const listResource = await handleInitUploadMulti();
      isUploadSuccess = await handleUploadMulti(listResource);
      console.log(
        "🚀 ~ file: ModalAddLession.jsx:60 ~ handleAddLesson ~ isUploadSuccess:",
        isUploadSuccess
      );

      data.resourceIds = listResource?.map((item) => item.resourceId);
    }
    if (isUploadSuccess) {
      const res = await createLesson(id, data);

      if (res.status === 0) {
        console.log([...lessonList, res?.data]);
        toast.success("Tạo bài giảng thành công");
        setLessionDesc("");
        setLessionDesc("");
        setLessonList([...lessonList, res?.data]);
        handleCloseAddLession();
        setFiles([]);
      } else {
        toast.error("Tạo bài giảng không thành công");
        console.log("Error: " + res?.message);
      }
    } else {
      toast.error("Tải tập tin thất bại vui lòng thử lại");
    }
    setLoading(false);
  };
  return (
    <BasicModal
      open={openAddLession}
      handleClose={() => {
        if (lessionDesc !== "" || lessionDesc !== "" || files.length > 0)
          handleOpenPopup();
        else handleCloseAddLession();
      }}
    >
      <div className="flex flex-col gap-4">
        <h2 className="font-bold text-xl text-center">Thêm bài giảng</h2>
        <div className="flex flex-col gap-2">
          <label htmlFor="lession" className="font-semibold">
            Chương
          </label>
          <div className="px-4 py-3 bg-gray-200 rounded-lg flex items-center gap-2">
            {" "}
            <MenuBook /> {topic?.name || "Đây là chương"}
          </div>
        </div>
        <div className="">
          <div className="flex flex-col gap-2">
            <label htmlFor="lession" className="font-semibold">
              Tên bài giảng
            </label>
            <input
              disabled={loading}
              id="lession"
              type="text"
              placeholder="Nhập tên bài giảng"
              className=" rounded-lg border-blue-400 w-[400px]"
              value={lessionTitle}
              onChange={(e) => setLessionTitle(e.target.value)}
            />
          </div>
          {/* <div className="text-red-400 mt-1 ml-1 text-sm">
              Tên bài giảng đã tồn tại.
            </div> */}
        </div>
        <div>
          <div className="flex flex-col gap-2 mb-12">
            <label htmlFor="lession" className="font-semibold">
              Mô tả bài giảng
            </label>
            <BasicEditor
              disabled={loading}
              className="h-[200px]"
              onChange={setLessionDesc}
              value={lessionDesc}
            ></BasicEditor>
          </div>
        </div>
        {/* upload */}
        <MultipleFileUpload
          files={files}
          setFiles={setFiles}
          removeFile={removeFile}
          loading={loading}
        />
        <FileList files={files} setFiles={setFiles} removeFile={removeFile} />

        <div className="flex gap-2  justify-center">
          <button
            className="font-semibold  px-4 py-2 rounded-lg"
            onClick={handleCloseAddLession}
          >
            Hủy
          </button>
          <button
            disabled={loading}
            className={`font-semibold text-white bg-green-500 px-4 py-2 rounded-lg ${
              loading && "opacity-50"
            }`}
            onClick={() => {
              handleAddLesson();
            }}
          >
            {loading ? "Đang tạo..." : "Tạo mới"}
          </button>
        </div>
      </div>
      <ConfirmPopup
        isOpen={open}
        handleClose={handleClosePopup}
        yesBtnLabel="Xác nhận"
        handleConfirm={() => {
          handleClosePopup();
          resetField();
          handleCloseAddLession();
        }}
      >
        Bạn có chắc chắn hủy thao tác?
      </ConfirmPopup>
    </BasicModal>
  );
};

export default ModalAddLession;
