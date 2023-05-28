import React from "react";
import uuid from "react-uuid";
import BasicTitle from "../../components/title/BasicTitle";
import { usePasssed } from "../../contexts/passedContext";
import ChooseItem from "./ChooseItem";
import ChooseOurBanner from "./ChooseOurBanner";

const choose_items = [
  {
    image: "/images/save_money.png",
    title: "Tiết kiệm chi phí",
    script:
      "Ở <strong>Kodemy</strong>, bạn có thể học được các khóa học chất lượng về tin học, lập trình và mỹ thuật đa phương tiện được giảng dạy bởi giảng viên chất lượng quốc tế.",
  },
  {
    image: "/images/clock.png",
    title: "Học không giới hạn",
    script:
      "Bạn sẽ được học đi học lại nhiều lần nếu chưa hiểu. Lợi thế của các video bạn có thể thực hành và làm theo các bài giảng đã được quay sẵn.",
  },

  {
    image: "/images/knowledge.png",
    title: "Kiến thức thực tế",
    script:
      "Các bài giảng trong khóa học là những kiến thức thực tế được làm việc trong môi trường quốc tế, giúp học viên có thể làm được việc sau khóa học.",
  },
];
const ChooseOur = () => {
  const { listPassed } = usePasssed();

  return (
    <div id="st3" className=" bg-white">
      <div className="wrapper">
        <ChooseOurBanner />
        <BasicTitle className="">Tại sao chọn chúng tôi</BasicTitle>
        <div
          className={`flex justify-between gap-10 ${
            listPassed.includes(2) && "fade-in-from-bottom"
          }`}
        >
          {choose_items.map((item) => (
            <ChooseItem
              key={uuid()}
              image={item.image}
              title={item.title}
              script={item.script}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChooseOur;
