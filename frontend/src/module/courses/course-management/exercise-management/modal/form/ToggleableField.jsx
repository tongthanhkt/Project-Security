import React from "react";
import BasicCheckbox from "../../../../../../components/input/BasicCheckbox";

const ToggleableField = ({
  control,
  errors,
  label,
  checkBoxName,
  getValues,
  resetField,
  fieldToReset = [],
  children,
}) => {
  React.useEffect(() => {
    if (!getValues(checkBoxName)) {
      fieldToReset.forEach((item) => {
        resetField(item);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getValues(checkBoxName)]);

  return (
    <div>
      <BasicCheckbox
        control={control}
        name={checkBoxName}
        label={label}
        errors={errors}
      />
      {children}
    </div>
  );
};

export default ToggleableField;
