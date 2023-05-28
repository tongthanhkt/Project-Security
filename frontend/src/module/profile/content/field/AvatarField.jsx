import { EditOutlined } from "@mui/icons-material";
import { Avatar, IconButton } from "@mui/material";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SUBMIT_STATUS } from "../../../../common/constants";
import OptionModal from "../../../../components/modal/OptionModal";
import PopupMsg from "../../../../components/modal/PopupMsg";
import usePopup from "../../../../hooks/usePopup";
import useToggle from "../../../../hooks/useToggle";
import { update } from "../../../../redux-toolkit/authSlice";
import { removeAvatar, updateAvatar } from "../../../../utils/profileHelper";
import EditButton from "../../button/EditButton";

const UPLOAD_AVATAR = 0;
const REMOVE_AVATAR = 1;
const CANCEL_EDIT = 2;

const AvatarField = ({ label }) => {
  const { user } = useSelector((state) => state?.auth);
  const dispatch = useDispatch();
  const fileRef = React.useRef(null);
  const [showEditOptionsModal, setShowEditOptionsModal] = React.useState(false);
  const [editStatus, setEditStatus] = React.useState(null);
  const [resMsg, setResMsg] = React.useState("");
  const {
    open: isSubmitted,
    handleOpenPopup: handleOpenSubmittedPopup,
    handleClosePopup: handleCloseSubmittedPopup,
  } = usePopup();
  const listOptions = [
    {
      label: "Tải ảnh lên",
      value: UPLOAD_AVATAR,
      textStyle: "text-blue-500",
    },
    user?.data?.picture && {
      label: "Gỡ ảnh hiện tại",
      value: REMOVE_AVATAR,
      textStyle: "text-red-500",
    },
    {
      label: "Huỷ",
      value: CANCEL_EDIT,
    },
  ];
  const handleCloseOptionsModal = () => {
    setShowEditOptionsModal(false);
  };

  const uploadProfilePic = async (e) => {
    const file = e.target?.files?.[0];
    console.log(file);
    if (file) {
      handleOpenSubmittedPopup();
      setShowEditOptionsModal(false);
      setEditStatus(SUBMIT_STATUS.LOADING);
      // Change avatar
      const res = await updateAvatar(file);
      console.log(res);
      if (res && res.status === 0) {
        const newUser = { ...user.data };
        newUser.picture = res.data;
        dispatch(update(newUser));
        setEditStatus(SUBMIT_STATUS.SUCCESS);
        setResMsg("Cập nhật ảnh đại diện thành công");
      } else if (res && res.status === 1) {
        setEditStatus(SUBMIT_STATUS.ERROR);
        setResMsg("File không hợp lệ vui lòng thử lại");
      } else if (res && res.status === 6) {
        setEditStatus(SUBMIT_STATUS.ERROR);
        setResMsg(res.message);
      } else {
        setEditStatus(SUBMIT_STATUS.ERROR);
        setResMsg(res.message);
      }
    }
  };
  const onRemoveAvatar = async () => {
    //Remove avatar
    handleOpenSubmittedPopup();
    setShowEditOptionsModal(false);
    setEditStatus(SUBMIT_STATUS.LOADING);
    // Remove avatar
    const res = await removeAvatar();
    console.log(res);
    if (res && res.status === 0) {
      const newUser = { ...user.data };
      newUser.picture = "";
      dispatch(update(newUser));
      setEditStatus(SUBMIT_STATUS.SUCCESS);
      setResMsg("Gỡ ảnh đại diện thành công");
    } else if (res && res.status === 0) {
      setEditStatus(SUBMIT_STATUS.ERROR);
      setResMsg("Không tìm thấy ảnh đại diện");
    } else {
      setEditStatus(SUBMIT_STATUS.ERROR);
      setResMsg(res.message);
    }
  };
  const onSelectEditAvaOption = (value) => {
    switch (value) {
      case UPLOAD_AVATAR:
        fileRef.current.click();
        break;
      case REMOVE_AVATAR:
        onRemoveAvatar();
        break;
      case CANCEL_EDIT:
        setShowEditOptionsModal(false);
        break;
      default:
        return;
    }
  };

  const handleUpload = () => {
    setShowEditOptionsModal(true);
    // fileRef.current.click();
  };

  // function resetPhoto() {
  //   console.log("reset");
  // }
  const renderFinishEditText = () => {
    switch (editStatus) {
      case SUBMIT_STATUS.ERROR:
        return resMsg;
      case SUBMIT_STATUS.SUCCESS:
        return resMsg;
      case SUBMIT_STATUS.LOADING:
        return "Đang xử lý";
      default:
        return "";
    }
  };
  return (
    <>
      <div className="mt-6 flex flex-col items-center justify-center ">
        {/* User info */}
        <div className="font-semibold mb-2 text-lg">{label}</div>
        {/* File upload */}
        <input
          type="file"
          className="hidden"
          ref={fileRef}
          onChange={uploadProfilePic}
          accept="image/png,image/jpeg,image/gif"
        />
        {/* Avatar */}
        <IconButton onClick={handleUpload} className="!p-0 !relative">
          <Avatar className="!w-32 !h-32" src={user?.data?.picture} />
          {/* Overlay */}
          <div
            className={`flex flex-col bg-black opacity-0 hover:opacity-60 duration-300 absolute inset-0
          justify-center items-center text-white rounded-full`}
          >
            <EditOutlined />
            <h1 className="text-sm font-semibold mt-2">Chỉnh sửa</h1>
          </div>
        </IconButton>
        <div className="text-gray-400 mt-2">
          Chấp nhận các tệp: JPG, PNG hoặc GIF
        </div>
        {/* Edit button */}
        {/* <EditButton
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        resetValue={resetPhoto}
      /> */}
        <OptionModal
          isShow={showEditOptionsModal}
          handleClose={handleCloseOptionsModal}
          listOptions={listOptions}
          title="Thay đổi ảnh đại diện"
          onSelectOption={onSelectEditAvaOption}
        ></OptionModal>
      </div>
      <PopupMsg
        isOpen={isSubmitted}
        handleClosePopup={handleCloseSubmittedPopup}
        status={editStatus}
        hasOk={editStatus !== SUBMIT_STATUS.LOADING}
        disableBackDropClick={editStatus === SUBMIT_STATUS.LOADING}
      >
        {renderFinishEditText()}
      </PopupMsg>
    </>
  );
};

export default AvatarField;
