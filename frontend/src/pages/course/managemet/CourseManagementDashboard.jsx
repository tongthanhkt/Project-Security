import React, { useEffect } from "react";
import CourseResourcePage from "./CourseResourcePage";
import CourseManageExercisePage from "./CourseManageExercisePage";
import TopicAndLessionManagement from "./TopicAndLessionManagement";
import { CourseEditInfoPage } from "./CourseEditInfoPage";
import { CourseEditAssignTA } from "./CourseEditAssignTA";
import { useParams } from "react-router-dom";
import { getCourseDetail } from "../../../utils/courseHelper";

const CourseManagementDashboard = () => {
  const { id } = useParams();
  const onEditing = (isEditing) => {
    console.log("vào on Editing");
    setIsEditting(isEditing);
  };
  const onUpdateCourseInfoSuccess = () => {
    fetchCourseInfo();
  };
  const managementList = [
    { index: 0, title: "Bài học", component: <TopicAndLessionManagement /> },
    { index: 1, title: "Tài liệu", component: <CourseResourcePage /> },
    { index: 2, title: "Bài tập", component: <CourseManageExercisePage /> },
    {
      index: 3,
      title: "Thông tin khóa học",
      component: (
        <CourseEditInfoPage onUpdateSuccess={onUpdateCourseInfoSuccess} />
      ),
    },
    { index: 4, title: "Tutor phụ trách", component: <CourseEditAssignTA /> },
  ];
  const [showConfirmChangeTab, setShowConfirmChangeTab] = React.useState(false);
  const [isEditing, setIsEditting] = React.useState(false);
  const [currentTab, setCurrentTab] = React.useState(managementList[0]);
  const [courseDetail, setCourseDetail] = React.useState(null);
  const onChangeTab = async (item) => {
    if (isEditing) {
      setShowConfirmChangeTab(true);
    } else {
      setCurrentTab(item);
    }
  };
  const confirmChangeTab = (item) => {
    setCurrentTab(item);
    setShowConfirmChangeTab(false);
  };
  const rejectChangeTab = () => {
    setShowConfirmChangeTab(false);
  };
  const fetchCourseInfo = async () => {
    try {
      const res = await getCourseDetail(id);
      setCourseDetail(res);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchCourseInfo();
  }, []);

  return (
    <>
      <div className="wrapper pt-minus-nav min-h-minus-footer">
        <div className="flex gap-x-6">
          {/* Sidebar */}
          <div className="sidebar shadow-md p-4 w-1/5 flex flex-col gap-y-4 font-semibold rounded-md">
            {/* Course thumb */}
            <div className="w-full">
              <img
                className="object-contain h-full w-full rounded-lg"
                src={
                  courseDetail?.thumbUrl && courseDetail?.thumbUrl !== ""
                    ? courseDetail?.thumbUrl
                    : "/images/no_image.jpg"
                }
                alt="course_img"
              />
            </div>
            {/* Management list */}
            {managementList.map((item) => (
              <>
                <button
                  key={item.index}
                  className={`${
                    item.index === currentTab?.index
                      ? "bg-gradient text-white"
                      : ""
                  } py-4 px-2 rounded-md hover:bg-slate-200 cursor-pointer text-left`}
                  onClick={() => setCurrentTab(item)}
                >
                  {item.title}
                </button>
              </>
            ))}
          </div>
          {/* Content */}
          <div className="content bg-transparent flex-1">
            {managementList[currentTab?.index].component}
          </div>
        </div>
      </div>
      {/* <ConfirmPopup
        isOpen={showConfirmChangeTab}
        handleConfirm={() => confirmChangeTab(item)}
        handleReject={rejectChangeTab}
        yesBtnLabel="Đồng ý"
      >
        Đang có sự thay đổi ở
        <span className="font-semibold text-blue-500">{currentTab.title}</span>
        Bạn có chắc muốn chuyển sang trang khác ?
      </ConfirmPopup> */}
    </>
  );
};

export default CourseManagementDashboard;
