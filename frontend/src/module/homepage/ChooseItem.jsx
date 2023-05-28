import React from "react";

const ChooseItem = ({ image = "", title = "", script = "" }) => {
  return (
    <div className="py-12 px-8 rounded-md ">
      <img className="mx-auto" src={image} alt="icon" />
      <div className="text-center">
        <h3 className="font-bold text-[22px] mb-6 mt-8">{title}</h3>
        <p
          className="text-base text-[#6B7385]"
          dangerouslySetInnerHTML={{ __html: script }}
        />
      </div>
    </div>
  );
};

export default ChooseItem;
