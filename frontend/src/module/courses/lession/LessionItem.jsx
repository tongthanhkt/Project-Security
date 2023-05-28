import React from "react";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";

const LessionItem = ({ lession = {}, index = 1 }) => {
  return (
    <div className="flex justify-between border border-gray-300 px-4 py-3 rounded-md ">
      <div className="font-semibold">
        {index}. {lession?.name}
      </div>
      <div className="text-gray-500">
        <PlayCircleIcon className="!text-xl mr-1" />
        <span>3:35</span>
      </div>
    </div>
  );
};

export default LessionItem;
