import React from "react";
import EditButton from "../../button/EditButton";
import useToggle from "../../../../hooks/useToggle";

const EditableInfo = ({ label, value, subtitle, defaultValue }) => {
  const inputRef = React.useRef(undefined);
  const { value: isEditing, toggleValue: setIsEditing } = useToggle(false);

  function handleUpdate() {
    setIsEditing(false);
    console.log(inputRef.current.value);
  }

  function resetValue() {
    inputRef.current.value = value;
  }

  return (
    <div className="mt-6 flex">
      {/* User info */}
      <div className="flex-1">
        <div className="font-semibold mb-2 text-lg">{label}</div>
        <input
          ref={inputRef}
          type="text"
          defaultValue={value || defaultValue}
          // value={value}
          className="p-0 w-full border-none focus:ring-0 bg-transparent"
          disabled={!isEditing}
          maxLength={40}
        />
        <div className="text-gray-400">{subtitle}</div>
      </div>
      {/* Edit button */}
      <EditButton
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        handleUpdate={handleUpdate}
        resetValue={resetValue}
      />
    </div>
  );
};

export default EditableInfo;
