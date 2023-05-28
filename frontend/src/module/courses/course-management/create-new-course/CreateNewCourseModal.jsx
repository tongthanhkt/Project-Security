import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { useForm } from "react-hook-form";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { CreateCourseFormContent } from "./CreateNewCourseContent";
import { createCourseSchema } from "../../../../common/form-schema";
import useUpload from "../../../../hooks/upload/useUpload";
import ModalMain from "../../../../components/modal/ModalMain";
import FormContent from "../../../../components/authen/FormContent";
import BasicButton from "../../../../components/button/BasicButton";
import ConfirmPopup from "../../../../components/modal/ConfirmPopup";
import {
  assignListTAForCourse,
  getCourseDetail,
  createNewCourse,
} from "../../../../utils/courseHelper";
import {
  CREATE_COURSE_FAILED,
  CREATE_COURSE_SUCCESS,
} from "../../../../utils/constant";

const FINAL_STEP = 2;

export const CreateNewCourseModal = ({
  handleClose = () => {},
  onCreateResult = (msg) => {},
}) => {
  const [step, setStep] = useState(1);
  const [isOpenCancelPopup, setIsOpenCancelPopup] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isDoneCreate, setisDoneCreate] = useState(false);
  const [createState, setCreateState] = useState();
  const [courseName, setCourseName] = useState("");
  const [file, setFile] = useState(null);
  const [listSelectedTA, setListSelectedTA] = useState([]);
  const {
    uploadPercent,
    isUploading,
    isDone,
    isFailed,
    handleInitUpload,
    handleUpload,
    handleRetry,
    currentResourceId,
  } = useUpload(file);
  const {
    handleSubmit,
    control,
    formState: { isDirty, errors },
    setValue,
    getValues,
  } = useForm({
    resolver: yupResolver(createCourseSchema),
  });
  const onSubmit = async (data) => {
    if (step !== FINAL_STEP) {
      handleNextStep();
      return;
    }
    setIsCreating(true);
    try {
      // Lấy resourceId
      var createData;
      if (file) {
        const resourceId = await handleInitUpload();
        createData = {
          name: data.name,
          description: data.description,
          requirement: data.requirement,
          thumb: resourceId,
        };
        handleUpload(resourceId);
      } else {
        createData = {
          name: data.name,
          description: data.description,
          requirement: data.requirement,
          thumb: "",
        };
      }
      const res = await createNewCourse(createData);
      const listTAIds = listSelectedTA.map((item) => item._id);
      if (listTAIds.length > 0) {
        const courseId = res.data._id;
        await assignListTAForCourse(courseId, listTAIds);
      }
      setCourseName(data.name);
      setIsCreating(false);
      setisDoneCreate(true);
      setCreateState(CREATE_COURSE_SUCCESS);
      onCreateResult(CREATE_COURSE_SUCCESS);
    } catch (error) {
      console.log(error);
      setCreateState(CREATE_COURSE_FAILED);
      onCreateResult(CREATE_COURSE_FAILED);
    }
  };
  const handleRejectCancelForm = () => {
    setIsOpenCancelPopup(false);
  };
  const handleConfirmCancelForm = () => {
    setIsOpenCancelPopup(false);
    handleClose();
  };
  const handleOnClickPreviousStep = () => {
    setStep(step - 1);
  };
  const handleNextStep = () => {
    setStep(step + 1);
  };
  const onCloseForm = () => {
    // Nếu đã chỉnh sửa và chưa tạo khoá học thành công thì hiện pop-up xác nhận huỷ
    if (isDirty && isDoneCreate === false) {
      setIsOpenCancelPopup(true);
    } else {
      handleClose();
    }
  };
  return (
    <>
      <ModalMain
        handleClose={onCloseForm}
        className={`${
          isDoneCreate
            ? "w-[40%] transition-all duration-500 delay-200"
            : "w-[70%]"
        } h-fit max-h-[90%] overflow-auto`}
      >
        {isDoneCreate ? (
          <div className="flex flex-col items-center">
            {createState === CREATE_COURSE_SUCCESS ? (
              <CheckCircleIcon
                sx={{ fontSize: "80px" }}
                color="success"
                className="h-56 w-56"
              ></CheckCircleIcon>
            ) : (
              <CancelIcon
                sx={{ fontSize: "80px" }}
                color="error"
                className="h-56 w-56"
              ></CancelIcon>
            )}
            {createState === CREATE_COURSE_SUCCESS ? (
              <h1 className="mt-6">
                Tạo khoá học{" "}
                <span className="font-bold text-blue-500"> {courseName}</span>{" "}
                thành công
              </h1>
            ) : (
              <>
                <h1 className="mt-6 font-semibold">Đã có lỗi xảy ra</h1>
                <h1 className="mt-4">
                  Tạo khoá học{" "}
                  <span className="font-bold text-blue-500"> {courseName}</span>{" "}
                  không thành công
                </h1>
              </>
            )}
          </div>
        ) : (
          <div>
            <h1 className="font-bold text-2xl text-center">Tạo khoá học mới</h1>
            <form className="mt-6" onSubmit={handleSubmit(onSubmit)}>
              <FormContent>
                <CreateCourseFormContent
                  file={file}
                  setFile={setFile}
                  step={step}
                  errors={errors}
                  control={control}
                  setValue={setValue}
                  getValues={getValues}
                  listSelectedTA={listSelectedTA}
                  setListSelectedTA={setListSelectedTA}
                ></CreateCourseFormContent>
                <div className="flex gap-4 mt-4 font-semibold items-center">
                  {step !== 1 && (
                    <div
                      className="p-2 cursor-pointer -ml-14 rounded-full hover:bg-slate-100"
                      onClick={handleOnClickPreviousStep}
                    >
                      <ArrowBackIosIcon fontSize="small"></ArrowBackIosIcon>
                    </div>
                  )}
                  <h1>
                    {step} / {FINAL_STEP}
                  </h1>
                  {/* {step !== FINAL_STEP && (
                      <div className="p-2 cursor-pointer rounded-full hover:bg-slate-100">
                        <ArrowForwardIosIcon fontSize="small"></ArrowForwardIosIcon>
                      </div>
                    )} */}
                </div>
                <div className="flex gap-4 justify-center mt-4">
                  <BasicButton
                    className="!bg-white  bg-none !text-black !w-32"
                    onClick={onCloseForm}
                  >
                    <strong>Hủy</strong>
                  </BasicButton>
                  <BasicButton
                    type="submit"
                    loading={isCreating}
                    className="!w-32"
                  >
                    <strong>{step !== FINAL_STEP ? "Tiếp tục" : "Tạo"}</strong>
                  </BasicButton>
                </div>
              </FormContent>
            </form>
          </div>
        )}
      </ModalMain>
      <ConfirmPopup
        isOpen={isOpenCancelPopup}
        handleReject={handleRejectCancelForm}
        handleConfirm={handleConfirmCancelForm}
        yesBtnLabel="Huỷ tạo"
        noBtnLabel="Trở lại"
      >
        Bạn có chắc muốn huỷ tạo khoá học ?
      </ConfirmPopup>
    </>
  );
};
