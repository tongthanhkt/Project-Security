import React from "react";
import BasicSearch from "../../../../components/search/BasicSearch";
import useSearchFilter from "./../../../../hooks/search/useSearchFilter";

const Sidebar = ({ imgUrl, data, chapterId, setChapterId, showImg = true }) => {
  function resetId() {
    setChapterId(filterData[0]?._id);
  }

  const { filterData, setSearchItem } = useSearchFilter(data, resetId);

  return (
    <div className="w-1/4 bg-white text-black p-4 rounded-lg shadow-lg self-start">
      {/* Image */}
      {showImg && (
        <div className="w-full">
          <img
            className="object-cover h-full w-full rounded-lg"
            src={imgUrl}
            alt="course"
          />
        </div>
      )}
      <div className="flex flex-col gap-y-2 mt-4">
        <BasicSearch
          title="Tìm kiếm chương"
          fullWidth={true}
          onChange={(value) => setSearchItem(value)}
        />
        {filterData?.map((item, index) => {
          const currentItem = item._id === chapterId;

          // Chapter list
          return (
            <div
              key={item._id}
              className={`flex items-center gap-x-1 p-2 rounded-md cursor-pointer font-medium 
            hover:bg-slate-200 ${
              currentItem ? "bg-slate-200 font-semibold" : ""
            }`}
              onClick={() => setChapterId(item._id)}
            >
              {`${item.name}`}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Sidebar;
