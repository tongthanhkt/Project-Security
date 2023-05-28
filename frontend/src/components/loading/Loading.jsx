import React from "react";

const Loading = ({ hScreen = true }) => (
  <div
    className={`${hScreen ? "h-screen" : ""} flex items-center justify-center`}
  >
    <div className="flex">
      <div className="w-2 h-2 rounded-full mr-2 animate-ping bg-indigo-500"></div>
      <div className="w-2 h-2 rounded-full mr-2 animate-ping delay-1s bg-pink-500"></div>
      <div className="w-2 h-2 rounded-full animate-ping delay-2s bg-purple-500"></div>
    </div>
  </div>
);

export default Loading;
