import { TextField } from "@mui/material";
import React from "react";
import { useController } from "react-hook-form";

const TextBox = ({
  className = "",
  name = "",
  variant = "outlined",
  defaultValue = "",
  size = "small",
  control,
  ...props
}) => {
  const { field } = useController({
    control,
    name,
    defaultValue,
  });
  return (
    <TextField
      className={className}
      variant={variant}
      size={size}
      sx={{
        width: "100%",
        "& .MuiInputLabel-asterisk, & .MuiFormHelperText-root": {
          color: "red",
        },
      }}
      id={name}
      {...props}
      {...field}
    />
  );
};

export default TextBox;
