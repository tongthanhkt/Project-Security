import React from "react";

const SectionDivider = ({ sectName }) => {
  return (
    <div className="inline-flex items-center justify-center w-full mb-8">
      <hr className="w-96 h-1 bg-gradient border-0 rounded" />
      <div className="absolute px-4 -translate-x-1/2 bg-white left-1/2">
        <h4 className="font-semibold text-2xl text-gradient">{sectName}</h4>
      </div>
    </div>
  );
};

export default SectionDivider;
