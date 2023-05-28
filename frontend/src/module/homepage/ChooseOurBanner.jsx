import React from "react";

const ChooseOurBanner = () => {
  return (
    <div className="mb-24 choose-our__banner relative">
      <div className="max-w-[604px]">
        <h4 className="text-2xl leading-[48px]">Kodemy</h4>
        <p className="font-bold text-[32px] leading-[48px] mb-[6px]">
          Học tập là một kho báu đi theo chủ nhân của nó tới mọi nơi.
        </p>
      </div>
      <div className="absolute top-[62px] left-4">
        <img src="/images/dots.png" alt="" />
      </div>
      <div className="absolute -top-[5px] -right-[105px]">
        <img className="w-full" src="/images/choose_our.png" alt="" />
      </div>
    </div>
  );
};

export default ChooseOurBanner;
