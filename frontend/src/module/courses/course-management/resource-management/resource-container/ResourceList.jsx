import React from "react";
import { useQuery } from "react-query";
import ResourceItem from "./ResourceItem";
import UploadButton from "./UploadButton";
import { Skeleton } from "@mui/material";
import { getLessonsResource } from "../../../../../utils/resourceHelper";
import useSearchFilter from "../../../../../hooks/search/useSearchFilter";
import BasicSearch from "../../../../../components/search/BasicSearch";
import Empty from "../../../../../components/empty/Empty";
import { reactQueryKey } from "../../../../../utils/fetch";

const ResourceList = ({ lessonId }) => {
  const { data, error, isLoading } = useQuery(
    reactQueryKey.LESSON_RESOURCE(lessonId),
    () => getLessonsResource(lessonId)
  );
  const resourceList = data?.data?.resource;

  const { filterData, setSearchItem } = useSearchFilter(resourceList);

  if (error) return "An error has occurred: " + error.message;

  return (
    <div
      className={`resource-content p-4 border border-t-0 border-slate-200 rounded-b-md flex
        flex-col gap-y-4 shadow-lg relative`}
    >
      {isLoading ? (
        <div className="flex justify-between">
          <Skeleton
            variant="rounded"
            height={40}
            className="!bg-slate-200 w-1/5"
          />
          <Skeleton
            variant="circular"
            height={40}
            width={40}
            className="!bg-slate-200 w-1/5"
          />
        </div>
      ) : (
        <div
          className={`flex items-center ${
            resourceList?.length === 0 ? "justify-end" : "justify-between"
          }`}
        >
          {resourceList?.length > 0 ? (
            <BasicSearch
              title="Tìm kiếm tài liệu"
              onChange={(value) => setSearchItem(value)}
            />
          ) : null}
          <UploadButton lessonId={lessonId} />
        </div>
      )}

      {isLoading ? (
        <div className="flex flex-col gap-y-5">
          <div className="flex gap-x-2">
            <Skeleton
              variant="rounded"
              height={100}
              className="!bg-slate-200 w-1/5"
            />
            <Skeleton
              variant="rounded"
              height={100}
              className="!bg-slate-200 flex-1"
            />
          </div>
          <div className="flex gap-x-2">
            <Skeleton
              variant="rounded"
              height={100}
              className="!bg-slate-200 w-1/5"
            />
            <Skeleton
              variant="rounded"
              height={100}
              className="!bg-slate-200 flex-1"
            />
          </div>
        </div>
      ) : filterData?.length > 0 ? (
        filterData?.map((item, index) => (
          <ResourceItem key={index} data={item} lessonId={lessonId} />
        ))
      ) : (
        <Empty
          imgSrc="/images/resource/empty_resources.png"
          message="Chưa có tài liệu"
        />
      )}
    </div>
  );
};

export default ResourceList;
