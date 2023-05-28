import React, { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
const statistics = [
  {
    url: "/icons/statistic/banner_video.svg",
    unit: "Videos",
    quantity: 80,
  },
  {
    url: "/icons/statistic/banner_students.svg",
    unit: "Học viên",
    quantity: 80,
  },
  {
    url: "/icons/statistic/banner_strick.svg",
    unit: "Mẹo hay",
    quantity: 80,
  },
  {
    url: "/icons/statistic/banner_support.svg",
    unit: "Hỗ trợ",
    quantity: 80,
  },
];
function RandomNumber({ number }) {
  const [isActive, setIsActive] = useState(false);
  const [randomNumber, setRandomNumber] = useState(0);

  const { ref, inView } = useInView({
    threshold: 0.5, // Số lượng pixel nhìn thấy component được tính là hiển thị 50% trở lên
    triggerOnce: true, // Chỉ tính toán một lần khi nhìn thấy component
  });

  // Khi component được nhìn thấy, bắt đầu random số
  React.useEffect(() => {
    if (inView) {
      setIsActive(true);
      const interval = setInterval(() => {
        setRandomNumber(Math.floor(Math.random() * 50) + 1);
      }, 100);
      setTimeout(() => {
        clearInterval(interval);
        setRandomNumber(number);
      }, 1000);
    }
  }, [inView, number]);

  return <span ref={ref}>{isActive ? randomNumber : number}</span>;
}
const Statistic = () => {
  return (
    <div className="w-max absolute -bottom-16 rounded-md px-12 py-8 bg-white flex gap-[120px] justify-center items-center left-1/2 -translate-x-1/2 shadow-[2px_2px_10px_rgba(29,_32,_44,_0.1)] ">
      {statistics.map((item) => (
        <div key={item.url} className="flex gap-4 relative statistic-item ">
          <img src={item.url} alt="" />
          <div className="text-[#001C7F]">
            <p className=" text-[32px] font-bold leading-[32px]">
              {/* {item.quantity}+ */}
              <RandomNumber number={item.quantity} />+
            </p>
            <p>{item.unit}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Statistic;
