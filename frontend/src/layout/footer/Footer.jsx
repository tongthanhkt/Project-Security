/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";

const Info = () => {
  return (
    <div className="flex gap-16 items-start">
      <img src="/images/full_logo.svg" alt="" />
      <div className="flex gap-8">
        <InfoItem></InfoItem>
        <InfoItem></InfoItem>
        <InfoItem></InfoItem>
        <InfoItem></InfoItem>
      </div>
    </div>
  );
};
const InfoItem = ({ title = "Home" }) => {
  return (
    <div className="min-w-[170px]">
      <div className="text-white  font-semibold">
        <h3 className="text-[22px]">{title}</h3>
        <div className="flex flex-col gap-[10px] mt-[20px] text-base ">
          <p>About</p>
          <p>About</p>
          <p>About</p>
        </div>
      </div>
    </div>
  );
};
const Socials = () => {
  return (
    <div className="flex justify-between items-center">
      <p className="text-sm leading-[24px] text-[#E7E5EA]">
        © 2022 Kodemy LLC. All Rights Reserved. Terms & Conditions. Privacy
        Policy.
      </p>
      <div className="flex gap-4 ">
        <a href="#">
          <img src="/icons/LinkedIn.svg" alt="linkedin" />
        </a>
        <a href="#">
          <img src="/icons/Facebook.svg" alt="Facebook" />
        </a>
        <a href="#">
          <img src="/icons/Twitter.svg" alt="linkedin" />
        </a>
      </div>
    </div>
  );
};
const Footer = () => {
  return (
    <div className=" bg-[#292F3A] mt-10">
      <div className="wrapper">
        <div className="pt-24 pb-12 ">
          <Info />
          <div className="w-full h-[0.1px] bg-[#7B88A8] opacity-30 mt-10 mb-5" />
          <Socials />
        </div>
      </div>
    </div>
  );
};

export default Footer;
