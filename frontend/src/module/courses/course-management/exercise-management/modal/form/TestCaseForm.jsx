import {
  Add,
  Attachment,
  Cancel,
  CheckCircle,
  Delete,
} from "@mui/icons-material";
import React from "react";
import { useController, useFieldArray } from "react-hook-form";
import { OUTPUT_TYPE } from "../../../../../../common/constants";
import BasicDropdown from "../../../../../../components/input/BasicDropdown";
import BasicTextBox from "./../../../../../../components/input/BasicTextBox";
import IconButton from "./../../../../../../components/button/IconButton";
import { toast } from "react-toastify";
import BasicToggField from "../../../../../../components/input/BasicToggField";
import { readText } from "../../../../../../utils/fileHelper";
import { Tooltip } from "@mui/material";

const maxHeight = "max-h-[65vh]";

const TestCaseForm = ({
  control,
  errors,
  fieldArrName = "exampleArr",
  getValues,
  resetField,
  trigger,
  defFieldArrVal,
  setValue,
}) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: fieldArrName,
  });
  const [index, setIndex] = React.useState(0);

  return (
    <div className={`flex bg-white mb-6 ${maxHeight}`}>
      {/* Sidebar */}
      <SideBar
        errors={errors}
        fields={fields}
        index={index}
        setIndex={setIndex}
        fieldArrName={fieldArrName}
        trigger={trigger}
        append={append}
        defFieldArrVal={defFieldArrVal}
        remove={remove}
      />

      {/* Divider */}
      <div className="w-[1px] bg-slate-200 mx-4"></div>

      {/* Content */}
      <div className={`h-full flex-1 overflow-y-auto p-4 ${maxHeight}`}>
        <RunResultItem
          control={control}
          errors={errors}
          fieldArrName={fieldArrName}
          index={index}
          getValues={getValues}
          resetField={resetField}
          fields={fields}
          trigger={trigger}
          setValue={setValue}
        />
      </div>
    </div>
  );
};

const SideBar = ({
  fields,
  errors,
  index,
  setIndex,
  fieldArrName,
  trigger,
  append,
  defFieldArrVal,
  remove,
}) => {
  const selected = "!bg-slate-200 font-medium";

  function renderIcon(hasError) {
    if (hasError) {
      return <Cancel fontSize="medium" className="text-red-500" />;
    } else {
      return <CheckCircle fontSize="medium" className="text-green-500" />;
    }
  }

  function handleDeleteTestCase(fieldIndex) {
    if (fields.length - 1 > 0) {
      remove(fieldIndex);
      setIndex(0);
    } else {
      toast.warn("Phải có ít nhất 1 test case", { autoClose: 2000 });
    }
  }

  function handleAppendTestCase(defFieldArrVal) {
    append(defFieldArrVal);
    setIndex(fields.length);
  }

  React.useEffect(() => {
    trigger(fieldArrName);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ul
      className={`test-case-side w-1/5 h-full p-2 !px-3 flex flex-col gap-y-3 overflow-y-auto ${maxHeight}`}
    >
      {fields.map((item, fieldIndex) => {
        var fieldHasErr = false;
        if (errors[fieldArrName]) {
          fieldHasErr = !!errors[fieldArrName][fieldIndex];
        }
        return (
          <li key={item.id} className={`relative group p-0`}>
            <button
              type="button"
              onClick={() => setIndex(fieldIndex)}
              className={`w-full bg-white p-3 rounded-md hover:bg-slate-200 ${
                fieldIndex === index ? selected : ""
              }`}
            >
              <div className="flex items-center gap-x-1">
                {renderIcon(fieldHasErr)}
                {`Test case ${fieldIndex + 1}`}
              </div>
            </button>
            <IconButton
              type="button"
              className={`absolute -translate-y-1/2 right-2 top-1/2 
            !p-1 !rounded-full w-[20px] h-[20px] border-none !bg-red-500 hover:!bg-red-600
            invisible group-hover:visible`}
              onClick={() => handleDeleteTestCase(fieldIndex)}
            >
              <Delete fontSize="inherit" className="text-white" />
            </IconButton>
          </li>
        );
      })}

      {/* Add new test case */}
      <button
        className={`p-2 w-full flex items-center gap-x-1 rounded-md border text-slate-400`}
        onClick={() => handleAppendTestCase(defFieldArrVal)}
      >
        <Add
          fontSize="small"
          className="border rounded-full border-slate-400"
        />
        <p className="font-medium text-sm">Thêm test case</p>
      </button>
    </ul>
  );
};

const RunResultItem = ({
  control,
  errors,
  fieldArrName,
  index: selectedIndex,
  getValues,
  resetField,
  fields,
  trigger,
  setValue,
}) => {
  const textBoxClass = `bg-slate-200 border-0 rounded-md whitespace-pre-line text-slate-600 
  focus:text-black focus:font-medium`;
  const labelClass = "text-slate-400 text-sm font-normal";

  const outType = getValues(`${fieldArrName}[${selectedIndex}].outType`);
  const useStdin = getValues(`${fieldArrName}[${selectedIndex}].useStdin`);
  const useCmd = getValues(`${fieldArrName}[${selectedIndex}].useCmd`);
  const useInputFile = getValues(
    `${fieldArrName}[${selectedIndex}].useInputFile`
  );
  const toggLabelClass = "font-medium";

  // Handle output type change
  React.useEffect(() => {
    if (outType === OUTPUT_TYPE.CONSOLE) {
      resetField(`${fieldArrName}[${selectedIndex}].outputFileName`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [outType]);

  // Re-validate when toggle field
  React.useEffect(() => {
    trigger(`${fieldArrName}[${selectedIndex}]`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [outType, useStdin, useCmd, useInputFile]);

  return (
    <>
      {fields.map((item, fieldIndex) => (
        <div
          key={item.id}
          className={`test-case-results flex-1 flex flex-col gap-y-4  ${
            fieldIndex !== selectedIndex ? "hidden" : ""
          }`}
        >
          {/***** Input *****/}
          <BasicToggField
            control={control}
            toggFieldName={`${fieldArrName}[${fieldIndex}].useStdin`}
            toggLabel="Stdin"
            toggErrMsg={
              errors[fieldArrName]
                ? errors[fieldArrName][fieldIndex]?.useStdin?.message
                : null
            }
            getValues={getValues}
            fieldToReset={[`${fieldArrName}[${fieldIndex}].stdin`]}
            resetField={resetField}
            labelClass={toggLabelClass}
            defaultValue={getValues(`${fieldArrName}[${fieldIndex}].useStdin`)}
          >
            <BasicTextBox
              control={control}
              name={`${fieldArrName}[${fieldIndex}].stdin`}
              placeholder="Enter input, ex: 2 3"
              className={textBoxClass}
              labelClass={labelClass}
              errors={
                errors[fieldArrName]
                  ? errors[fieldArrName][fieldIndex]?.stdin?.message
                  : null
              }
              defaultValue={`${fieldArrName}[${fieldIndex}].stdin`}
            />
          </BasicToggField>

          {/* cmd arg field */}
          <BasicToggField
            control={control}
            toggFieldName={`${fieldArrName}[${fieldIndex}].useCmd`}
            toggLabel="Command line arguments"
            toggErrMsg={
              errors[fieldArrName]
                ? errors[fieldArrName][fieldIndex]?.useCmd?.message
                : null
            }
            getValues={getValues}
            fieldToReset={[`${fieldArrName}[${fieldIndex}].cmd_line_arg`]}
            resetField={resetField}
            labelClass={toggLabelClass}
            defaultValue={getValues(`${fieldArrName}[${fieldIndex}].useCmd`)}
          >
            <BasicTextBox
              control={control}
              name={`${fieldArrName}[${fieldIndex}].cmd_line_arg`}
              placeholder="Enter cmd args, ex: 2 3"
              className={textBoxClass}
              labelClass={labelClass}
              errors={
                errors[fieldArrName]
                  ? errors[fieldArrName][fieldIndex]?.cmd_line_arg?.message
                  : null
              }
              defaultValue={getValues(
                `${fieldArrName}[${fieldIndex}].cmd_line_arg`
              )}
            />
          </BasicToggField>

          {/* File input field */}
          <BasicToggField
            control={control}
            toggFieldName={`${fieldArrName}[${fieldIndex}].useInputFile`}
            toggLabel="File input"
            toggErrMsg={
              errors[fieldArrName]
                ? errors[fieldArrName][fieldIndex]?.useInputFile?.message
                : null
            }
            getValues={getValues}
            fieldToReset={[
              `${fieldArrName}[${fieldIndex}].inputFileName`,
              `${fieldArrName}[${fieldIndex}].inputFile`,
            ]}
            resetField={resetField}
            labelClass={toggLabelClass}
            defaultValue={getValues(
              `${fieldArrName}[${fieldIndex}].useInputFile`
            )}
          >
            <div>
              <div className={`${labelClass} flex items-center gap-x-2`}>
                <span>File input</span>
                {/* Conditional file extract */}
                <FileInput
                  setVal={setValue}
                  placehholder="Chọn file input"
                  fieldToSetName={`${fieldArrName}[${fieldIndex}].inputFileName`}
                  fieldToSetContent={`${fieldArrName}[${fieldIndex}].inputFile`}
                  control={control}
                  name={`${fieldArrName}[${fieldIndex}].inAttach`}
                  getValues={getValues}
                />
              </div>
              <BasicTextBox
                control={control}
                name={`${fieldArrName}[${fieldIndex}].inputFileName`}
                placeholder="Enter file name, ex: input.txt"
                className={textBoxClass}
                errors={
                  errors[fieldArrName]
                    ? errors[fieldArrName][fieldIndex]?.inputFileName?.message
                    : null
                }
                defaultValue={getValues(
                  `${fieldArrName}[${fieldIndex}].inputFileName`
                )}
              />
              <BasicTextBox
                control={control}
                name={`${fieldArrName}[${fieldIndex}].inputFile`}
                placeholder="Enter file content, ex: 2 3"
                type="textArea"
                className={textBoxClass}
                rows={3}
                errors={
                  errors[fieldArrName]
                    ? errors[fieldArrName][fieldIndex]?.inputFile?.message
                    : null
                }
                defaultValue={getValues(
                  `${fieldArrName}[${fieldIndex}].inputFile`
                )}
              />
            </div>
          </BasicToggField>

          {/***** Output *****/}

          {/* Choose ouput type */}
          <BasicDropdown
            control={control}
            name={`${fieldArrName}[${fieldIndex}].outType`}
            error={
              errors[fieldArrName]
                ? errors[fieldArrName][fieldIndex]?.outType?.message
                : null
            }
            defaultValue={getValues(`${fieldArrName}[${fieldIndex}].outType`)}
            options={[
              { value: OUTPUT_TYPE.CONSOLE, text: "Console" },
              { value: OUTPUT_TYPE.FILE, text: "Output file" },
            ]}
            label="Output type"
            labelClass={labelClass}
            className={"bg-slate-200"}
          ></BasicDropdown>

          <div>
            {/* Ouput file name field */}
            <div className={`${labelClass} flex items-center gap-x-2`}>
              <span>
                {outType === OUTPUT_TYPE.FILE ? "File output" : "Output"}
              </span>
              {/* Conditional file extract */}
              {outType === OUTPUT_TYPE.FILE ? (
                <FileInput
                  setVal={setValue}
                  placehholder="Chọn file output"
                  fieldToSetName={`${fieldArrName}[${fieldIndex}].outputFileName`}
                  fieldToSetContent={`${fieldArrName}[${fieldIndex}].out`}
                  control={control}
                  name={`${fieldArrName}[${fieldIndex}].outAttach`}
                  getValues={getValues}
                />
              ) : null}
            </div>
            {outType === OUTPUT_TYPE.FILE ? (
              <BasicTextBox
                control={control}
                name={`${fieldArrName}[${fieldIndex}].outputFileName`}
                placeholder="Enter file name, ex: output.txt"
                className={textBoxClass}
                labelClass={labelClass}
                errors={
                  errors[fieldArrName]
                    ? errors[fieldArrName][fieldIndex]?.outputFileName?.message
                    : null
                }
                defaultValue={getValues(
                  `${fieldArrName}[${fieldIndex}].outputFileName`
                )}
              />
            ) : null}

            {/* Ouput field */}
            <BasicTextBox
              control={control}
              name={`${fieldArrName}[${fieldIndex}].out`}
              placeholder="Enter file content, ex: 2 3"
              type="textArea"
              rows={3}
              className={textBoxClass}
              labelClass={labelClass}
              errors={
                errors[fieldArrName]
                  ? errors[fieldArrName][fieldIndex]?.out?.message
                  : null
              }
              defaultValue={getValues(`${fieldArrName}[${fieldIndex}].out`)}
            />
          </div>
        </div>
      ))}
    </>
  );
};

const FileInput = ({
  placehholder,
  setVal,
  fieldToSetName,
  fieldToSetContent,
  control,
  name,
  defaultValue = "",
  getValues,
  ...props
}) => {
  const fileRef = React.useRef(null);
  const { field } = useController({
    control,
    name,
    defaultValue,
  });

  async function handleSetVal(e) {
    const file = e.target.files[0];

    if (file) {
      setVal(name, file.name, { shouldValidate: true });

      // Set field content
      setVal(fieldToSetName, file.name, { shouldValidate: true });
      setVal(fieldToSetContent, await readText(file), { shouldValidate: true });
    }
  }

  React.useEffect(() => {
    if (!getValues(name)) {
      fileRef.current.value = null;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getValues(name)]);

  return (
    <>
      <IconButton
        handleOnClick={() => fileRef.current.click()}
        className="!bg-transparent !p-0 border-none"
      >
        <Tooltip title="Extract from file" placement="right" arrow>
          <Attachment className="cursor-pointer text-blue-600 hover:text-blue-500" />
        </Tooltip>
      </IconButton>
      {/* Actual input field */}
      <input hidden type="text" {...field} {...props} />
      <input hidden type="file" ref={fileRef} onChange={handleSetVal} />
    </>
  );
};

export default TestCaseForm;
