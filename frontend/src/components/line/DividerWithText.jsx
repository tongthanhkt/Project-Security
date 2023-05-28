import React from "react";

const DividerWithText = ({ text, lineClass, textClass }) => {
  return (
    <div className="inline-flex items-center justify-center w-full relative my-4">
      <hr
        className={`h-[2px] w-96 bg-slate-400 border-0 rounded ${lineClass}`}
      />
      <div className="absolute px-4 -translate-x-1/2 bg-white left-1/2">
        <h4 className={`font-semibold text-slate-600 ${textClass}`}>{text}</h4>
      </div>
    </div>
  );
};

export default DividerWithText;
