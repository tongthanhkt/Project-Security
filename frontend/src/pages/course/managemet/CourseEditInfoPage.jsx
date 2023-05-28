import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { createCourseSchema } from "../../../common/form-schema";
import FormContent from "../../../components/authen/FormContent";
import BasicButton from "../../../components/button/BasicButton";
import useUpload from "../../../hooks/upload/useUpload";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import TextBox from "../../../components/input/TextBox";
import { BasicEditor } from "../../../components/input/BasicEditor";
import { getCourseDetail, updateCourseInfo } from "../../../utils/courseHelper";
import { useParams } from "react-router-dom";
import PopupMsg from "../../../components/modal/PopupMsg";
import usePopup from "../../../hooks/usePopup";
import IconButton from "../../../components/button/IconButton";
import Loading from "./../../../components/loading/Loading";
import { removeResourcePerma } from "../../../utils/resourceHelper";
import { SUBMIT_STATUS } from "../../../common/constants";

export const CourseEditInfoPage = ({ onUpdateSuccess = () => {} }) => {
  const { id } = useParams();
  const [isReady, setIsReady] = useState(false);
  const [courseDetail, setCourseDetail] = useState(null);
  const [updateStatus, setUpdateStatus] = useState();
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const fileRef = useRef(null);
  const {
    open: isSubmitted,
    handleOpenPopup: handleOpenSubmittedPopup,
    handleClosePopup: handleCloseSubmittedPopup,
  } = usePopup();
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
    reset,
    watch,
  } = useForm({
    resolver: yupResolver(createCourseSchema),
  });
  const handleSetFormValueFromEditor = (html, fieldName) => {
    if (!isReady) return;
    if (
      html.replace(/<(.|\n)*?>/g, "").trim().length === 0 &&
      !html.includes("<img")
    ) {
      // Empty editor
      setValue(fieldName, "", { shouldDirty: true });
    } else {
      // Not empty editor
      setValue(fieldName, html, { shouldDirty: true });
    }
  };
  const onSubmit = async (data) => {
    setUpdateStatus(SUBMIT_STATUS.LOADING);
    handleOpenSubmittedPopup();
    try {
      // Lấy resourceId
      var updateData;
      const oldThumbId = courseDetail.thumb;
      if (file) {
        await removeResourcePerma(oldThumbId);
        const resourceId = await handleInitUpload();
        updateData = {
          name: data.name,
          description: data.description,
          requirement: data.requirement,
          thumb: resourceId,
        };
        handleUpload(resourceId);
      } else {
        updateData = {
          name: data.name,
          description: data.description,
          requirement: data.requirement,
          thumb: oldThumbId,
        };
      }
      const res = await updateCourseInfo(id, updateData);
      if (res.status === 200) {
        setUpdateStatus(SUBMIT_STATUS.SUCCESS);
        onUpdateSuccess();
      } else {
        setUpdateStatus(SUBMIT_STATUS.ERROR);
      }
      reset({}, { keepValues: true });
    } catch (error) {
      console.log(error);
    }
  };
  const fetchCourseInfo = async () => {
    try {
      const res = await getCourseDetail(id);
      setCourseDetail(res);
      let defaultValues = {};
      defaultValues.name = res.name;
      defaultValues.description = res.description;
      defaultValues.requirement = res.requirement;
      defaultValues.thumbnail = "";
      reset({ ...defaultValues });
      setIsReady(true);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchCourseInfo();
  }, []);
  useEffect(() => {
    // Kiểm tra người dùng có nhập trùng giá trị cũ hay không để disable nút cập nhật
    const subscription = watch((data) => {
      if (
        data.name === courseDetail?.name &&
        data.description === courseDetail?.description &&
        data.requirement === courseDetail?.requirement &&
        !data.thumbnail
      ) {
        reset({}, { keepValues: true });
      }
    });
    return () => {
      subscription.unsubscribe();
    };
  }, [watch, courseDetail, reset]);
  useEffect(() => {
    if (!file) {
      return;
    }
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);
  const renderSubmittedText = () => {
    switch (updateStatus) {
      case SUBMIT_STATUS.ERROR:
        return "Đã có lỗi xảy ra. Vui lòng thử lại";
      case SUBMIT_STATUS.SUCCESS:
        return "Cập nhật thông tin khoá học thành công";
      case SUBMIT_STATUS.LOADING:
        return "Đang xử lý";
      default:
        return "";
    }
  };
  return isReady ? (
    <>
      <form className="" onSubmit={handleSubmit(onSubmit)}>
        <FormContent>
          <div className="flex items-start w-full">
            {/*Thumbnail khóa học*/}
            <h1 className="font-bold w-44 mr-8">Thumbnail (Ảnh đại diện)</h1>
            <input
              type="file"
              ref={fileRef}
              className="hidden"
              onChange={(e) => {
                setValue("thumbnail", e.target?.files?.[0].name, {
                  shouldDirty: true,
                });
                setFile(e.target?.files?.[0]);
              }}
              accept="image/*"
            />
            <div className="flex flex-col w-full">
              <TextBox
                disabled
                placeholder={`${file ? file.name : "Chọn hình ảnh"}`}
                helperText="(Chỉ chấp nhận những file image)"
                name="thumbnail"
                className={`${file ? "truncate" : ""}`}
                control={control}
              />
              {file ? (
                <img
                  className="mt-4 w-44 h-32 object-contain"
                  src={preview}
                  alt="thumbnail"
                ></img>
              ) : (
                <div
                  className={`${
                    courseDetail?.thumbUrl
                      ? "mt-4 w-44 h-32 object-contain"
                      : "mt-4 p-4 rounded-lg border-dashed border-2 border-slate-300 w-fit"
                  }`}
                >
                  <img
                    className="w-44 h-32 object-contain"
                    src={`${
                      courseDetail?.thumbUrl
                        ? courseDetail?.thumbUrl
                        : "/images/resource/empty_lessons.png"
                    }`}
                    alt="thumbnail"
                  ></img>
                </div>
              )}
            </div>
            <BasicButton
              className="!ml-4 max-h-[40px]"
              onClick={() => fileRef.current.click()}
            >
              <FileUploadIcon></FileUploadIcon>
            </BasicButton>
          </div>
          {/*Tên khoá học*/}
          <div className="flex gap-4 w-full">
            <h1 className="font-bold w-44">
              Tên khoá học
              <span className="font-bold text-red-500"> *</span>
            </h1>
            <div className="flex flex-col w-full h-fit">
              <TextBox
                // label="Tên khoá học"
                // className="bg-gray-100"
                // disabled={true}
                placeholder="Nhập tên của khoá học"
                name="name"
                control={control}
              />
              {errors.name && (
                <h2 className="text-red-500 text-sm">{errors.name.message}</h2>
              )}
            </div>
          </div>
          {/*Mô tả khoá học*/}
          <div className="flex gap-4 w-full">
            <h1 className="font-bold w-44">
              Mô tả khoá học
              <span className="font-bold text-red-500"> *</span>
            </h1>
            <div className="flex flex-col w-full h-fit">
              <BasicEditor
                name="description"
                // disabled={true}
                value={getValues("description")}
                control={control}
                onChange={(html) =>
                  handleSetFormValueFromEditor(html, "description")
                }
                placeholder="Nhập mô tả khoá học..."
              ></BasicEditor>
              {errors.description && (
                <h2 className="text-red-500 text-sm">
                  {errors.description.message}
                </h2>
              )}
            </div>
          </div>
          {/*Yêu cầu khoá học*/}
          <div className="flex gap-4 w-full">
            <h1 className="font-bold w-44">
              Yêu cầu của khoá học
              <span className="font-bold text-red-500"> *</span>
            </h1>
            <div className="flex flex-col w-full h-fit">
              <BasicEditor
                // editorClassName="!h-44"
                name="requirement"
                // disabled={true}
                control={control}
                value={getValues("requirement")}
                onChange={(html) =>
                  handleSetFormValueFromEditor(html, "requirement")
                }
                placeholder="Nhập yêu cầu của khoá học..."
              ></BasicEditor>
              {errors.requirement && (
                <h2 className="text-red-500 text-sm">
                  {errors.requirement.message}
                </h2>
              )}
            </div>
            {/* <IconButton className="h-fit">
          <EditIcon></EditIcon>
        </IconButton> */}
          </div>
          <h1>{isDirty}</h1>
          <BasicButton
            type="submit"
            className="!ml-40"
            disabled={!isDirty}
            loading={updateStatus === SUBMIT_STATUS.LOADING}
          >
            <strong>Cập nhật {isDirty.toString}</strong>
          </BasicButton>
        </FormContent>
      </form>
      <PopupMsg
        isOpen={isSubmitted}
        handleClosePopup={handleCloseSubmittedPopup}
        status={updateStatus}
        hasOk={updateStatus !== SUBMIT_STATUS.LOADING}
        disableBackDropClick={updateStatus === SUBMIT_STATUS.LOADING}
      >
        {renderSubmittedText()}
      </PopupMsg>
    </>
  ) : (
    <Loading />
  );
};
