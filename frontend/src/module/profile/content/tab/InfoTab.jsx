import React from "react";
import { useSelector } from "react-redux";
import AvatarField from "../field/AvatarField";
import EditableInfo from "../field/EditableInfo";

function fieldContructor(label, value, defaultValue, subtitle) {
  this.label = label;
  this.value = value;
  this.defaultValue = defaultValue;
  this.subtitle = subtitle;
}

const InfoTab = () => {
  const { user } = useSelector((state) => state?.auth);
  const field = [
    new fieldContructor(
      "Họ và tên",
      user.data.name,
      "Thêm họ và tên",
      "Tên của bạn xuất hiện trên trang cá nhân và bên cạnh các bình luận của bạn."
    ),
    new fieldContructor(
      "Bio",
      "Đây là gt",
      "Thêm họ và tên",
      "Hiển thị trên trang cá nhân của bạn"
    ),
    new fieldContructor(
      "Nơi cư trú",
      user.data.addr,
      "Thêm nơi cư trú",
      "Thành phố nơi bạn cư trú"
    ),
    new fieldContructor(
      "Số điên thoại",
      "0921212122",
      "Thêm số điện thoại",
      "Điện thoại liên kết với tài khoản của bạn"
    ),
  ];
  return (
    <>
      {/* Header */}
      <div className="text-3xl font-semibold">Thông tin cá nhân</div>
      {/* Divider */}
      <hr className="bg-slate-200 mt-2" />

      {/* Editable info */}
      <div className="flex justify-center">
        <AvatarField label="Ảnh đại diện" />
      </div>
      {field.map((item) => (
        <EditableInfo
          key={item.label}
          label={item.label}
          value={item.value}
          subtitle={item.subtitle}
          defaultValue={item.defaultValue}
        />
      ))}
    </>
  );
};

export default InfoTab;
