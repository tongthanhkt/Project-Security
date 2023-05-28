import React from "react";
import Sidebar from "../../module/profile/Sidebar";
import Content from "./../../module/profile/Content";

const ProfilePage = () => {
  const [tabIndex, setTabIndex] = React.useState(0);

  return (
    <div className="wrapper pt-minus-nav flex gap-x-8 min-h-minus-footer">
      <Sidebar tabIndex={tabIndex} setTabIndex={setTabIndex} />
      <Content tabIndex={tabIndex} />
    </div>
  );
};

export default ProfilePage;
