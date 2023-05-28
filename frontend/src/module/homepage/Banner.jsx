import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import Statistic from "./Statistic";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import uuid from "react-uuid";

const SCBanner = styled.div`
  padding-top: 110px;
  background-color: #f5f7fa;
  position: relative;
  background-image: url("/images/bg_banner.png") !important;
  background-position: top center;
  background-size: cover;
  background-repeat: no-repeat;
  background-image: url(${(props) => props.image});
`;
const texts = ["Mọi người.", "Sinh viên.", "Học sinh.", "Developer."];
// const texts = ["Học sinh", "Học sinh"];

function VerticalSliderCarousel() {
  const sliderRef = useRef(null);

  useEffect(() => {
    const slider = sliderRef.current;

    const interval = setInterval(() => {
      if (slider) {
        slider?.slickPrev();
      }
    }, 3000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const settings = {
    vertical: true,
    dots: false,
    arrows: false,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    className: "relative top-6",

    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <Slider {...settings} ref={sliderRef} className="w-fit top-6">
      {texts.map((item) => (
        <span className="text-gradient" key={uuid()}>
          {item}
        </span>
      ))}
    </Slider>
  );
}
const Banner = () => {
  return (
    <SCBanner id="st1" className="banner ">
      <div className="wrapper relative h-full flex justify-between items-center gap-[18px]">
        <div className="w-1/2">
          <h1 className="w-full mb-8 text-[56px] font-bold leading-[84px] ">
            Nền tảng học trực tuyến miễn phí{" "}
            <span>
              dành cho{" "}
              <span className="w-[100px] inline-block">
                <VerticalSliderCarousel className="w-auto" />
              </span>
            </span>
          </h1>
          <p className="text-[#6B7385] text-xl font-medium leading-[34px] -tracking[0.3px]">
            Sự linh hoạt trong địa điểm và thời gian học này đặc biệt phù hợp
            cho đối tượng các học viên vừa học vừa làm, giúp họ có thể sắp xếp
            thời gian thoải mái hơn.
          </p>
        </div>
        <div className="w-1/2 flex items-center justify-center  mb-[42px]">
          <div className="w-full orderly-fadein-from-right">
            <img src="/images/user_banner.png" alt="" className="w-100" />
          </div>
        </div>
        <Statistic></Statistic>
      </div>
    </SCBanner>
  );
};

export default Banner;
