import BasicButton from "../../../../../components/button/BasicButton";
import TextBox from "../../../../../components/input/TextBox";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import { BasicEditor } from "../../../../../components/input/BasicEditor";
import React, { useEffect, useState } from "react";

export const GeneralInfoContent = ({
  file,
  setFile,
  setValue,
  getValues,
  control,
  errors,
}) => {
  const fileRef = React.useRef(null);
  const [preview, setPreview] = useState(null);
  const handleCancel = () => {
    setFile(null);
    fileRef.current.value = null;
  };
  const handleSetFormValueFromEditor = (html, fieldName) => {
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
  useEffect(() => {
    if (!file) {
      return;
    }
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);
  return (
    <>
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
              className="mt-4 w-44 h-32 object-cover"
              src={preview}
              alt="thumbnail"
            ></img>
          ) : (
            <div className="mt-4 p-4 rounded-lg border-dashed border-2 border-slate-300 w-fit">
              <img
                className="w-44 h-32 object-fill"
                src="/images/resource/empty_lessons.png"
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
        {/* <h4 className="flex text-sm w-full ml-4 text-slate-500">
                (Chỉ chấp nhận những file .png, .jpg, .jpeg )
              </h4> */}
      </div>
      {/* <div className="flex justify-start w-full ml-">
              {file ? (
                <img
                  className="w-32 h-32 object-cover"
                  src={preview}
                  alt="thumbnail"
                ></img>
              ) : (
                <img
                  className="w-44 h-32 object-fill"
                  src="/images/resource/empty_lessons.png"
                  alt="thumbnail"
                ></img>
              )}
            </div> */}
      {/*Tên khoá học*/}
      <div className="flex gap-4 w-full">
        <h1 className="font-bold w-44">
          Tên khoá học
          <span className="font-bold text-red-500"> *</span>
        </h1>
        <div className="flex flex-col w-full h-fit">
          <TextBox
            // label="Tên khoá học"
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
            // className="!h-24"
            name="description"
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
      </div>
    </>
  );
};
