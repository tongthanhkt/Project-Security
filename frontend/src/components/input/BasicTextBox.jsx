import React from "react";
import { useController } from "react-hook-form";

const BasicTextBox = ({
  name = "",
  defaultValue = "",
  type = "text",
  label,
  control,
  errors,
  className,
  labelClass,
  ...props
}) => {
  const { field } = useController({
    control,
    name,
    defaultValue,
  });
  return (
    <div
      className={`${
        type === "hidden" ? "hidden" : "flex"
      } flex-col text-slate-400`}
    >
      <label className={`font-medium text-black ${labelClass}`}>{label}</label>
      {type === "textArea" ? (
        <textarea
          className={`focus:ring-0 border-slate-400 ${className}`}
          {...props}
          {...field}
        />
      ) : (
        <input
          type={type}
          className={`focus:ring-0 border-slate-400 ${className}`}
          {...props}
          {...field}
        />
      )}
      <p className="text-red-600 mt-2">{errors}</p>
    </div>
  );
};

export default BasicTextBox;
