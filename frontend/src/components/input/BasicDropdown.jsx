import { FormControl, MenuItem, Select } from "@mui/material";
import React from "react";
import { useController } from "react-hook-form";

const BasicDropdown = ({
  control,
  error,
  name,
  defaultValue,
  options = [],
  label,
  labelClass,
  ...props
}) => {
  const { field } = useController({
    control,
    name,
    defaultValue,
  });
  return (
    <FormControl size="small">
      {/* <InputLabel id="demo-select-small">Loại file output</InputLabel> */}
      <label className={`font-medium text-black ${labelClass}`}>{label}</label>
      <Select
        labelId="demo-select-small"
        id="demo-select-small"
        defaultValue={defaultValue}
        // label="Age"
        {...field}
        {...props}
      >
        {options.map((item, index) => (
          <MenuItem key={index} value={item.value}>
            {item.text}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default BasicDropdown;
