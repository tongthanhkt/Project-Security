import { Divider } from "@mui/material";
import React from "react";
import SimpleAccordion from "../../components/according/SimpleAccordion";
import Empty from "../../components/empty/Empty";
import "./styles/styles.css";
import Loading from "../../components/loading/Loading";

const LessionContent = ({ data = [], loading = false }) => {
  return (
    <div className="py-4 mb-[50px]  mt-[60px] h-full">
      <h3 className="font-bold px-4">Nội dung bài học</h3>
      <Divider className="!my-2" />
      {data?.length > 0 ? (
        <SimpleAccordion data={data} />
      ) : (
        <div className="h-full">
          {loading ? (
            <Loading />
          ) : (
            <Empty
              imgSrc="/images/resource/empty_lessons.png"
              message="Chưa có bài giảng"
              classNameParent="h-full"
            />
          )}
        </div>
      )}
    </div>
  );
};

export default LessionContent;
