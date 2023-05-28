const IconButton = ({
  children,
  handleOnClick = () => {},
  className = "",
  disabled = false,
  ...props
}) => {
  return (
    <div
      className={`p-2 flex items-center justify-center
      border border-slate-300 rounded-md cursor-pointer bg-white hover:bg-slate-200  ${className} ${
        disabled ? "pointer-events-none" : ""
      }`}
      onClick={handleOnClick}
      {...props}
    >
      {children}
    </div>
  );
};
export default IconButton;
