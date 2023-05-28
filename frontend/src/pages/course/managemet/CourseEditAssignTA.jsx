import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { SUBMIT_STATUS } from "../../../common/constants";
import BasicButton from "../../../components/button/BasicButton";
import Loading from "../../../components/loading/Loading";
import PopupMsg from "../../../components/modal/PopupMsg";
import usePopup from "../../../hooks/usePopup";
import { AssignTAContent } from "../../../module/courses/course-management/create-new-course/create-new-course-content/AssignTAContent";
import {
  assignListTAForCourse,
  getCourseDetail,
  updateListTAForCourse,
} from "../../../utils/courseHelper";

export const CourseEditAssignTA = () => {
  const { id } = useParams();
  const [listSelectedTA, setListSelectedTA] = useState([]);
  const [isDirty, setIsDirty] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [updateStatus, setUpdateStatus] = useState();
  const {
    open: isSubmitted,
    handleOpenPopup: handleOpenSubmittedPopup,
    handleClosePopup: handleCloseSubmittedPopup,
  } = usePopup();
  const fetchListSelectedTA = async () => {
    const res = await getCourseDetail(id);
    // const promises = res.tutors.map(async (item) => {
    //     const
    // });
    console.log(res);
    setListSelectedTA(res.tutorsInfo);
    setIsReady(true);
  };
  const onListSelectedTAChange = () => {
    setIsDirty(true);
  };
  const onSubmit = async () => {
    setUpdateStatus(SUBMIT_STATUS.LOADING);
    handleOpenSubmittedPopup();
    const listTAIds = listSelectedTA.map((item) => item._id);
    const res = await updateListTAForCourse(id, listTAIds);
    console.log(res);
    if (res.status === 200) {
      setUpdateStatus(SUBMIT_STATUS.SUCCESS);
      setIsDirty(false);
    } else {
      setUpdateStatus(SUBMIT_STATUS.ERROR);
    }
  };
  useEffect(() => {
    fetchListSelectedTA();
  }, []);
  const renderFinishUpdateText = () => {
    switch (updateStatus) {
      case SUBMIT_STATUS.ERROR:
        return "Đã có lỗi xảy ra. Vui lòng thử lại";
      case SUBMIT_STATUS.SUCCESS:
        return "Cập nhật danh sách Tutor phụ trách thành công";
      case SUBMIT_STATUS.LOADING:
        return "Đang xử lý";
      default:
        return "";
    }
  };
  return isReady ? (
    <>
      <div className="flex flex-col items-center gap-16">
        <AssignTAContent
          listSelectedTA={listSelectedTA}
          setListSelectedTA={setListSelectedTA}
          onListSelectedTAChange={onListSelectedTAChange}
        ></AssignTAContent>
        <BasicButton
          className=""
          disabled={!isDirty || updateStatus === SUBMIT_STATUS.LOADING}
          onClick={onSubmit}
          loading={updateStatus === SUBMIT_STATUS.LOADING}
        >
          <strong>Cập nhật</strong>
        </BasicButton>
      </div>
      <PopupMsg
        isOpen={isSubmitted}
        handleClosePopup={handleCloseSubmittedPopup}
        status={updateStatus}
        hasOk={updateStatus !== SUBMIT_STATUS.LOADING}
        disableBackDropClick={updateStatus === SUBMIT_STATUS.LOADING}
      >
        {renderFinishUpdateText()}
      </PopupMsg>
    </>
  ) : (
    <Loading></Loading>
  );
};
