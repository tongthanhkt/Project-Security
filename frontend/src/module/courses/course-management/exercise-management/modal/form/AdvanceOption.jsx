import React from "react";
import {
  EXERCISE_CONTRAINTS,
  EXERCISE_MAX_CONSTRAINT,
} from "../../../../../../common/constants";
import BasicCheckbox from "../../../../../../components/input/BasicCheckbox";
import BasicTextBox from "../../../../../../components/input/BasicTextBox";
import SectionDivider from "./SectionDivider";

const AdvanceOption = ({
  control,
  errors,
  getFieldState,
  setIsStepValid,
  getValues,
  resetField,
}) => {
  const textBoxClass =
    "rounded-md outline-none focus:border-black focus:text-black";

  const wallState = getFieldState("wall_time_limit");
  const memoryState = getFieldState("memory_limit");
  const fileSizeState = getFieldState("max_file_size");
  // const curFormState = getFieldState("enable_network");
  // const curFormState = getFieldState("testCaseHaveExample");

  // Check if current fields all valid
  React.useEffect(() => {
    if (!wallState.invalid && !memoryState.invalid && !fileSizeState.invalid) {
      setIsStepValid(true);
    } else {
      setIsStepValid(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wallState, memoryState, fileSizeState]);

  // Reset value of template when untick
  React.useEffect(() => {
    if (!getValues("include_template")) {
      resetField("template_val");
      resetField("lang_id");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getValues("include_template")]);

  return (
    <div className="coding-options">
      <SectionDivider sectName="Advance options" />
      <BasicTextBox
        control={control}
        label="Time limit (seconds)"
        name="wall_time_limit"
        errors={errors.wall_time_limit ? errors.wall_time_limit.message : null}
        type="number"
        className={textBoxClass}
        placeholder="Nhập thời gian tối đa có thể chạy code"
        defaultValue={getValues("wall_time_limit")}
        min={1}
      />
      <BasicTextBox
        control={control}
        label="Ram limit (KB)"
        name="memory_limit"
        errors={errors.memory_limit ? errors.memory_limit.message : null}
        type="number"
        className={textBoxClass}
        placeholder="Nhập dung lượng tối đa có thể chạy code"
        defaultValue={getValues("memory_limit")}
        min={EXERCISE_CONTRAINTS.memory_limit}
        max={EXERCISE_MAX_CONSTRAINT.memory_limit}
      />
      <BasicTextBox
        control={control}
        label="File size limit (KB)"
        name="max_file_size"
        errors={errors.max_file_size ? errors.max_file_size.message : null}
        type="number"
        className={textBoxClass}
        placeholder="Nhập dung lượng tối đa code có thể ghi ra"
        defaultValue={getValues("max_file_size")}
        min={EXERCISE_CONTRAINTS.max_file_size}
        max={EXERCISE_MAX_CONSTRAINT.max_file_size}
      />
      <BasicCheckbox
        control={control}
        label="Exercise access network"
        name="enable_network"
        defaultValue={getValues("enable_network")}
        errors={errors.enable_network ? errors.enable_network.message : null}
      />
      <BasicCheckbox
        control={control}
        label="Test cases include examples"
        name="testCaseHaveExample"
        defaultValue={getValues("testCaseHaveExample")}
        errors={
          errors.testCaseHaveExample ? errors.testCaseHaveExample.message : null
        }
      />
      <BasicCheckbox
        control={control}
        label="Include template"
        name="include_template"
        defaultValue={getValues("include_template")}
        errors={
          errors.testCaseHaveExample ? errors.testCaseHaveExample.message : null
        }
      />
    </div>
  );
};

export default AdvanceOption;
