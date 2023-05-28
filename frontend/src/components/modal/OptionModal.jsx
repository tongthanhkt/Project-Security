import { Dialog, Divider } from "@mui/material";
import BasicModal from "./BasicModal";
import ModalMain from "./ModalMain";

const OptionModal = ({
  listOptions,
  isShow,
  handleClose,
  handleOpen,
  onSelectOption = (value) => {},
  showTitle = true,
  title = "Title",
}) => {
  return (
    <BasicModal open={isShow} handleClose={handleClose} padding="">
      <div className="w-full ">
        {showTitle && <h1 className="py-10 px-20 font-medium">{title}</h1>}
        <div className="flex flex-col justify-center items-center w-full">
          {listOptions.map(
            (item, index) =>
              item && (
                <div
                  key={item?.value}
                  className="font-semibold cursor-pointer w-full text-center"
                  onClick={() => onSelectOption(item?.value)}
                >
                  <Divider />
                  <div className={`${item?.textStyle} px-20 p-4`}>
                    {item?.label}
                  </div>
                  {index === listOptions.length - 1 && <Divider />}
                </div>
              )
          )}
        </div>
      </div>
    </BasicModal>
  );
};
export default OptionModal;
