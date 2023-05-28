import React from "react";
import BasicButton from "../../../components/button/BasicButton";

const EditButton = ({ isEditing, setIsEditing, handleUpdate, resetValue }) => {
  function handleCancel() {
    resetValue();
    setIsEditing(false);
  }

  if (isEditing) {
    return (
      <div className="flex gap-x-2">
        <BasicButton
          className={`!text-whhite !rounded-full !border-2 h-10`}
          onClick={handleUpdate}
        >
          Lưu
        </BasicButton>
        <BasicButton
          className="!text-slate-500 !rounded-full !bg-white h-10"
          onClick={handleCancel}
          noGradient={true}
        >
          Hủy
        </BasicButton>
      </div>
    );
  } else {
    return (
      <BasicButton
        variant="outlined"
        className="!text-slate-500 !rounded-full !bg-white h-10 shadow-md !border-none"
        onClick={() => setIsEditing(true)}
        noGradient={true}
      >
        Chỉnh sửa
      </BasicButton>
    );
  }
};

export default EditButton;
