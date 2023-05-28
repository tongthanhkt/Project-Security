import React from "react";
import { useController } from "react-hook-form";

const BasicCheckbox = ({
  name = "",
  defaultValue = false,
  label,
  control,
  errors,
  labelClassName,
  ...props
}) => {
  const { field } = useController({
    control,
    name,
    defaultValue,
  });
  return (
    <div className="flex flex-col">
      <label
        className={`font-medium text-slate-600 flex items-center gap-x-2 ${labelClassName}`}
      >
        <input
          type="checkbox"
          defaultChecked={defaultValue}
          {...props}
          {...field}
          className="focus:ring-0 focus:ring-offset-0 rounded"
        />
        <span>{label}</span>
      </label>
      <p className="text-red-600 mt-2">{errors}</p>
    </div>
  );
};

export default BasicCheckbox;
