import React from "react";
import LoadingButton from "@mui/lab/LoadingButton";
import { colors } from "../../utils/constant";

const BasicButton = ({
  children,
  variant = "contained",
  color = "primary",
  icon,
  onClick,
  sx,
  disabled = false,
  className = "",
  noGradient = false,
  ...props
}) => {
  return (
    <LoadingButton
      variant={variant}
      color={color}
      startIcon={icon}
      onClick={onClick}
      sx={[...(Array.isArray(sx) ? sx : [sx])]}
      className={`!normal-case font-semibold text-white text-base ${
        disabled || noGradient
          ? ""
          : "bg-[linear-gradient(90deg,_rgba(4,118,244,1)_0%,_rgba(4,191,253,1)_100%)]"
      }  ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </LoadingButton>
  );
};

export default BasicButton;
