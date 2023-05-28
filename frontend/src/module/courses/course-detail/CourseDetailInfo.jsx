import { useEffect, useState } from "react";
import Empty from "../../../components/empty/Empty";
import BasicTitle from "../../../components/title/BasicTitle";
import { CourseChapter } from "./CourseChapter";

export const CourseDetailInfo = ({ courseDetail, topicsAndLessions, id }) => {
  const [listOpenChapter, setListOpenChapter] = useState([]);
  const closeAllChapter = () => {
    const listControl = Array(topicsAndLessions?.length).fill(false);
    setListOpenChapter([...listControl]);
  };
  const openAllChapter = () => {
    const listControl = Array(topicsAndLessions?.length).fill(true);
    setListOpenChapter([...listControl]);
  };
  const handleOnClickOpenAllChapter = () => {
    if (listOpenChapter.every((item) => item === true)) {
      closeAllChapter();
    } else openAllChapter();
  };
  const handleOnClickChapter = (index) => {
    var listOpenChapterCopy = [...listOpenChapter];
    listOpenChapterCopy[index] = !listOpenChapterCopy[index];
    setListOpenChapter([...listOpenChapterCopy]);
  };
  useEffect(() => {
    closeAllChapter();
  }, [topicsAndLessions]);
  return (
    <div className="basis-11/12">
      <div>
        {/* <h1 className="font-bold text-3xl">Lập trình C++ cơ bản, nâng cao</h1> */}
        <BasicTitle>{courseDetail?.name}</BasicTitle>
        <p
          className="pt-2"
          dangerouslySetInnerHTML={{ __html: courseDetail?.description }}
        ></p>
      </div>
      <h2 className="pt-4 font-bold text-xl">Nội dung khoá học</h2>
      <div className="pt-5 flex justify-between">
        <div className="flex gap-4">
          <h4>
            <span className="font-bold">{topicsAndLessions?.length}</span>{" "}
            chương
          </h4>
          <p>•</p>
          <h4>
            <span className="font-bold">
              {topicsAndLessions?.reduce(
                (sum, item) => sum + item?.lession?.length,
                0
              )}
            </span>{" "}
            bài học
          </h4>
          <p>•</p>
          <h4>
            Thời lượng <span className="font-bold">08 giờ 43 phút</span>
          </h4>
        </div>
        {topicsAndLessions.length > 0 && (
          <h4
            className="font-bold text-blue-500 cursor-pointer hover:text-blue-400"
            onClick={() => handleOnClickOpenAllChapter()}
          >
            {listOpenChapter.every((item) => item === true)
              ? "Thu gọn tất cả"
              : "Mở rộng tất cả"}
          </h4>
        )}
      </div>
      <div className="pt-4 flex flex-col gap-2">
        {topicsAndLessions.length > 0 ? (
          topicsAndLessions?.map((item, index) => (
            <CourseChapter
              key={item.topic._id}
              topic={item.topic}
              lessons={item.lession}
              isOpen={listOpenChapter[index]}
              onClick={() => handleOnClickChapter(index)}
            ></CourseChapter>
          ))
        ) : (
          <Empty
            imgSrc="/images/empty_state_images/no_files_found.png"
            message={"Chưa có nội dung cho khoá học này"}
          ></Empty>
        )}
      </div>
      {courseDetail?.requirement !== "" &&
        courseDetail?.requirement !== undefined && (
          <div>
            <h2 className="mt-6 font-bold text-xl">Yêu cầu khoá học</h2>
            <h4
              className="mt-4"
              dangerouslySetInnerHTML={{ __html: courseDetail?.requirement }}
            ></h4>
          </div>
        )}
    </div>
  );
};
