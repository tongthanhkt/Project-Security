import React from "react";
import { useQuery } from "react-query";
import BasicSearch from "../../../../../components/search/BasicSearch";
import { getCourseTopics } from "../../../../../utils/courseHelper";
import { reactQueryKey } from "../../../../../utils/fetch";

const Sidebar = ({ courseId, topicId, setTopicId }) => {
  const {
    data: courseChapter,
    error,
    // eslint-disable-next-line no-unused-vars
    isLoading,
  } = useQuery(reactQueryKey.COURSER_CHAPTER(courseId), () =>
    getCourseTopics(courseId)
  );

  React.useEffect(() => {
    setTopicId(courseChapter?.data[0]._id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseChapter]);

  if (error) return "An error has occurred: " + error.message;

  return (
    <div className="flex flex-col gap-y-4 p-4 w-1/4 shadow-md rounded-md">
      {/* Search */}
      <BasicSearch title="Tìm kiếm chương" />
      {/* Topics */}
      {courseChapter?.data.map((item) => {
        const selected = item._id === topicId;
        return (
          <button
            key={item._id}
            onClick={() => setTopicId(item._id)}
            className={`p-2 border-l-blue-600 font-semibold text-left
        hover:text-white hover:bg-gradient hover:border-l-0 hover:translate-x-2 hover:rounded-md 
        transition duration-500 ease-out ${
          selected ? "text-white bg-gradient translate-x-2 rounded-md" : ""
        } ${selected ? "border-l-0" : "border-l-4"}`}
          >
            {item.name}
          </button>
        );
      })}
    </div>
  );
};

export default Sidebar;
