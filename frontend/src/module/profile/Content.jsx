import React from "react";
import InfoTab from "./content/tab/InfoTab";
import SecurityTab from "./content/tab/SecurityTab";
import Card from "./Card";

const tabList = [<InfoTab />, <SecurityTab />];

const Content = ({ tabIndex }) => {
  return <Card width="w-4/5">{tabList[tabIndex]}</Card>;
};

export default Content;
