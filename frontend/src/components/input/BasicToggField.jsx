import { Collapse } from "@mui/material";
import React from "react";
import BasicToggle from "./BasicToggle";

const BasicToggField = ({
  control,
  toggFieldName,
  toggLabel,
  toggErrMsg,
  children,
  getValues,
  resetField,
  fieldToReset,
  defaultValue = false,
  labelClass,
}) => {
  const toggVal = getValues(toggFieldName);

  React.useEffect(() => {
    if (!toggVal) {
      fieldToReset.forEach((item) => {
        resetField(item);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toggVal]);

  return (
    <div>
      <BasicToggle
        control={control}
        name={toggFieldName}
        label={toggLabel}
        errors={toggErrMsg}
        defaultValue={defaultValue}
        labelClass={labelClass}
      />
      <Collapse in={toggVal} unmountOnExit timeout="auto">
        {children}
      </Collapse>
    </div>
  );
};

export default BasicToggField;
