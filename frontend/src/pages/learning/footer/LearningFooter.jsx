import React from "react";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useNavigate } from "react-router-dom";
const LearningFooter = ({ prev = "#", next = "#" }) => {
  const navigate = useNavigate();
  const isNextNull = next.includes("null");
  const isPrevNull = prev.includes("null");
  return (
    <footer
      style={{ zIndex: 9999 }}
      className=" flex gap-4 justify-center items-center fixed bottom-0 left-0 bg-gray-200 w-screen h-[50px]  shadow-[0_-2px_1px_rgb(0_0_0_/_10%)] z-50"
    >
      <button
        onClick={() => {
          navigate(prev);
        }}
        disabled={isPrevNull}
        className={`flex items-center font-semibold ${
          isPrevNull && "!opacity-50"
        }`}
      >
        <ArrowBackIosIcon className=" !text-[16px] hover:opacity-50" />
        <span>Bài trước</span>
      </button>
      <button
        className={`flex items-center rounded-lg border-2 hover:opacity-80 border-blue-400 px-4 py-1 text-gradient ${
          isNextNull && "!opacity-50 "
        }`}
        disabled={isNextNull}
        onClick={() => {
          navigate(next);
        }}
      >
        Bài tiếp theo{" "}
        <ArrowForwardIosIcon className="text-blue-400 !text-[16px]" />
      </button>
    </footer>
  );
};

export default LearningFooter;
