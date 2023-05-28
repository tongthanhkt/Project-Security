import CloseIcon from "@mui/icons-material/Close";
import ReactDOM from "react-dom";

const ModalMain = ({
  children,
  handleClose,
  className = "",
  showCloseIcon = true,
}) => {
  if (typeof document === "undefined") return <div className="modal"></div>;
  return ReactDOM.createPortal(
    <div className="modal fixed inset-0 z-50 p-5">
      <div className="absolute inset-0 bg-black bg-opacity-50 overlay flex items-center justify-center">
        <div
          className={`modal-content relative z-10 p-10 bg-white rounded-md w-[40%] ${className}`}
        >
          {showCloseIcon && (
            <div
              className="p-2 rounded-full absolute top-4 right-4 cursor-pointer hover:bg-gray-100"
              onClick={() => {
                handleClose();
              }}
            >
              <CloseIcon />
            </div>
          )}
          {children}
        </div>
      </div>
    </div>,
    document.querySelector("body")
  );
};
export default ModalMain;
