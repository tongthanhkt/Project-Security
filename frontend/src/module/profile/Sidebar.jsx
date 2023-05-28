import React from "react";
import {
  AdminPanelSettingsOutlined,
  PersonOutlineOutlined,
} from "@mui/icons-material";
import Card from "./Card";

function settingContructor(label, icon) {
  this.label = label;
  this.icon = icon;
}

const field = [
  new settingContructor(
    "Cài đặt tài khoản",
    <PersonOutlineOutlined className="text-cyan-500" />
  ),
  new settingContructor(
    "Cài đặt bảo mật",
    <AdminPanelSettingsOutlined className="text-cyan-500" />
  ),
];

const Sidebar = ({ setTabIndex, tabIndex }) => {
  return (
    <Card width="w-1/5">
      <div className="text-3xl font-semibold mb-2">Cài đặt</div>
      <ul className="space-y-2">
        {/* Item */}
        {field.map((item, index) => (
          <li key={item.label} onClick={() => setTabIndex(index)}>
            <div
              className={`flex items-center p-2 text-base font-normal text-gray-900 rounded-lg
              hover:bg-gray-200 cursor-pointer ${
                index === tabIndex ? "bg-gray-200" : ""
              }`}
            >
              {/* Icon */}
              {item.icon}
              {/* Text */}
              <span className="ml-3">{item.label}</span>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
};

export default Sidebar;
