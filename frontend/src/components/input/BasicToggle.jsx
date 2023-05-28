import React from "react";
import { useController } from "react-hook-form";

const BasicToggle = ({
  name = "",
  defaultValue = false,
  label,
  control,
  errors,
  labelClass,
  ...props
}) => {
  const { field } = useController({
    control,
    name,
    defaultValue,
  });

  return (
    <label className="cursor-pointer inline-flex items-center mb-2">
      <div className="relative flex items-center ">
        <input
          type="checkbox"
          className="sr-only peer"
          defaultChecked={defaultValue}
          {...props}
          {...field}
        />
        <div
          className={`w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 
            peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full 
            peer-checked:after:border-white after:content-[''] 
            after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 
            after:border after:rounded-full after:h-5 after:w-5 after:transition-all 
            peer-checked:bg-blue-600`}
        ></div>
      </div>
      <span className={`ml-2 text-sm ${labelClass}`}>{label}</span>
      <p className="text-red-600 mt-2">{errors}</p>
    </label>
  );
};

export default BasicToggle;
