import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import SubdirectoryArrowRightIcon from "@mui/icons-material/SubdirectoryArrowRight";
import FlagIcon from "@mui/icons-material/Flag";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import React, { useState } from "react";
import { Avatar } from "../../../components/Avatar";
import BasicButton from "../../../components/button/BasicButton";
import { BasicEditor } from "../../../components/input/BasicEditor";
import useHover from "../../../hooks/useHover";
import useMenu from "../../../hooks/useMenu";
import ConfirmPopup from "../../../components/modal/ConfirmPopup";
import usePopup from "../../../hooks/usePopup";

const MAX_LENGTH = 100;
const SUBCOMMENT_PER_COMMENT = 3;
const REPORT_COMMENT = 0;
const EDIT_COMMENT = 1;
const DELETE_COMMENT = 2;

const listMoreMenuItemForOthers = [
  {
    text: "Báo cáo bình luận spam",
    icon: <FlagIcon></FlagIcon>,
    value: 0,
  },
];
const listMoreMenuItemForOwner = [
  {
    text: "Chỉnh sửa",
    icon: <EditIcon></EditIcon>,
    value: 1,
  },
  {
    text: "Xoá bình luận",
    icon: <DeleteIcon></DeleteIcon>,
    value: 2,
  },
];
export const Comment = ({
  comment,
  isSubComment = false,
  currentUserAvatar = "",
  isTA = false,
  isOwner = false,
}) => {
  const data = [
    {
      arvatarUrl:
        "https://hollywoodzam.com/wp-content/uploads/2021/05/Takao-Akizuki-3.jpg",
      userName: "Trương Anh Ngọc",
      content: "Tin chuẩn nhé em",
      timestammp: "12:30",
      hasAnswer: true,
    },
    {
      arvatarUrl:
        "https://hollywoodzam.com/wp-content/uploads/2021/05/Takao-Akizuki-3.jpg",
      userName: "Trương Anh Ngọc",
      content: `Many of you keep repeating the sentence "Is it true, brother?", wanting to know "Is it true?" then compare, read other news sources, read newspapers. If I read a news and still feel like "Ah, I can't believe it", I have to look elsewhere instead of asking the same question over and over again like a cow, "Is it true?" I'm going to laugh haha ​​and then I'll write my miscellaneous things above. So instead of that, you guys should do this for yourself, go look, read in other newspapers, read on other fanpages, know English to understand foreign news sources instead of just going. asked "Is the news correct?", everyone who came in asked: "Is it true?" I either deleted it, or blocked it all. I don't like this, if you don't believe in anything, even if you don't believe me, you can unfollow me, don't follow my fanpage, but never ask a question "Is it true? ?", not cool at all, guys! One is to block, the other is to delete, there is no such thing as repeating the same sentence as "Is it true, brother?".`,
      timestammp: "12:30",
      hasAnswer: false,
    },
    {
      arvatarUrl:
        "https://hollywoodzam.com/wp-content/uploads/2021/05/Takao-Akizuki-3.jpg",
      userName: "Trương Anh Ngọc",
      content: `Muitos de vocês ficam repetindo a frase "É verdade, irmão?", Querendo saber "É verdade, irmão?" depois compare, leia outras fontes, leia jornais. Se eu leio uma notícia e ainda sinto como "Ah, eu não posso acreditar", então eu tenho que procurar em outro lugar em vez de fazer a mesma pergunta repetidas vezes como uma vaca, "É verdade?" Eu vou para rir haha ​​​​e depois vou escrever minhas coisas diversas acima. Então ao invés disso, por favor, faça isso por você mesmo, vá procurar, leia em outros jornais, leia em outras fanpages, saiba inglês para entender fontes estrangeiras ao invés de apenas ir. perguntou "A notícia está correta?", todos que entraram perguntaram: "É verdade?" Eu apaguei ou bloqueei tudo. Não gosto disso, se você não acredita em nada, mesmo que não acredite em mim, pode deixar de me seguir, não seguir minha fanpage, mas nunca faça uma pergunta do tipo "É verdade? ?" , nada legal, pessoal! Uma é bloquear, a outra deletar, não tem como ficar repetindo a mesma frase indefinidamente como "É verdade, irmão?`,
      timestammp: "12:30",
      hasAnswer: false,
    },
  ];
  const [hoverRef, isHovered] = useHover();
  const [listSubComment, setListSubComment] = useState(data);
  const [showAnswerEditor, setShowAnswerEditor] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [editorValue, setEditorValue] = useState("");
  const [isDirtyEditor, setIsDirtyEditor] = useState(false);
  const {
    open: openConfirmDelete,
    handleOpenPopup: handleOpenConfirmDelete,
    handleClosePopup: handleCloseConfirmDelete,
  } = usePopup();
  const {
    anchorEl: anchorElMore,
    handleCloseMenu: handleClosePopupMenu,
    handleOpenMenu: onShowMoreActions,
  } = useMenu();
  const onMoreMenuSelect = (value) => {
    switch (value) {
      case REPORT_COMMENT:
        return;
      case EDIT_COMMENT:
        return;
      case DELETE_COMMENT:
        handleOpenConfirmDelete();
        return;
      default:
        return;
    }
  };
  const onExpandComment = () => {
    setIsExpanded(!isExpanded);
  };
  const onShowAnswerEditor = () => {
    setShowAnswerEditor(!showAnswerEditor);
  };
  const onCommentEditorChange = (html) => {
    if (
      html.replace(/<(.|\n)*?>/g, "").trim().length === 0 &&
      !html.includes("<img")
    ) {
      // Empty editor
      setIsDirtyEditor(false);
    } else {
      // Not empty editor
      setEditorValue(html);
      setIsDirtyEditor(true);
    }
  };
  const onSubmitAnswerComment = () => {
    console.log(editorValue);
  };
  const onLoadMoreAnswers = () => {};
  const onDeleteComment = async () => {};
  return (
    <div>
      <div ref={hoverRef} className="flex gap-4 ">
        <Avatar src={comment?.arvatarUrl} alt="avatar"></Avatar>
        <div>
          <div
            className={`py-2 px-4 bg-slate-100 min-w-[400px] ${
              isExpanded ? "" : "max-h-[200px]"
            } rounded-lg w-fit`}
          >
            <div className="flex gap-4">
              <h2 className="font-bold text-md">{comment?.userName}</h2>
              {isTA && (
                <div className="py-1 px-2 h-fit font-semibold text-xs bg-blue-400 text-white rounded-lg">
                  Trợ giảng
                </div>
              )}
            </div>
            <div>
              <p className={`mt-2 ${isExpanded ? "" : "line-clamp-3"}`}>
                {comment?.content}{" "}
              </p>
              {comment?.content?.length > MAX_LENGTH && (
                <div
                  className="font-semibold cursor-pointer mt-2 text-right w-fit ml-auto"
                  onClick={onExpandComment}
                >
                  {isExpanded ? "Ẩn bớt" : "Đọc thêm"}
                </div>
              )}
            </div>
          </div>
          <div className="mt-2 flex gap-2 text-sm">
            <h3 className="text-blue-500 cursor-pointer hover:underline">
              Thích
            </h3>
            ·
            <h3
              className="text-blue-500 cursor-pointer hover:underline"
              onClick={onShowAnswerEditor}
            >
              Trả lời
            </h3>
            ·<h3>9 ngày trước</h3>
            <div className="rounded-full hover:bg-slate-100 transition-all">
              <MoreHorizIcon
                className="cursor-pointer"
                fontSize="small"
                onClick={onShowMoreActions}
              ></MoreHorizIcon>
            </div>
          </div>
          {showAnswerEditor && (
            <>
              <div className="mt-4 flex gap-4">
                <Avatar
                  className="w-7 h-7"
                  src={currentUserAvatar}
                  alt="avatar"
                ></Avatar>{" "}
                <div>
                  <BasicEditor
                    value={editorValue}
                    onChange={onCommentEditorChange}
                  ></BasicEditor>
                  <div className="mt-4 flex justify-end gap-4">
                    <BasicButton
                      onClick={onShowAnswerEditor}
                      className="!bg-none !bg-slate-100"
                    >
                      <strong className="text-gray-500">Hủy</strong>
                    </BasicButton>
                    <BasicButton
                      onClick={onSubmitAnswerComment}
                      disabled={!isDirtyEditor}
                    >
                      <strong>Trả lời</strong>
                    </BasicButton>
                  </div>
                </div>
              </div>
            </>
          )}
          {!isSubComment && comment?.hasAnswer && (
            <ListSubComment
              listSubComment={listSubComment}
              onLoadMoreAnswers={onLoadMoreAnswers}
            ></ListSubComment>
          )}
        </div>
      </div>
      <Menu
        anchorEl={anchorElMore}
        id="account-menu"
        open={Boolean(anchorElMore)}
        onClose={handleClosePopupMenu}
        keepMounted
        // onClick={handleClosePopupMenu}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            pt: 1,
            pb: 1,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "&:before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              left: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "left", vertical: "top" }}
        anchorOrigin={{ horizontal: "left", vertical: "bottom" }}
      >
        {isOwner
          ? listMoreMenuItemForOwner.map((item) => (
              <MenuItem
                onClick={() => {
                  handleClosePopupMenu();
                  onMoreMenuSelect(item.value);
                }}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                {item.text}
              </MenuItem>
            ))
          : listMoreMenuItemForOthers.map((item) => (
              <MenuItem
                onClick={() => {
                  handleClosePopupMenu();
                  onMoreMenuSelect(item.value);
                }}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                {item.text}
              </MenuItem>
            ))}
      </Menu>
      <ConfirmPopup
        isOpen={openConfirmDelete}
        handleConfirm={() => {
          onDeleteComment();
          handleCloseConfirmDelete();
        }}
        handleReject={() => {
          handleCloseConfirmDelete();
        }}
      >
        Bạn có chắc chắn muốn xoá bình luận này
      </ConfirmPopup>
    </div>
  );
};
const ListSubComment = ({ listSubComment, onLoadMoreAnswers }) => {
  const [showAnswers, setShowAnswers] = useState(false);
  const onShowAnswers = () => {
    setShowAnswers(!showAnswers);
  };
  return (
    <>
      <div
        className="p-2 pr-4 mt-2 font-semibold text-blue-500 flex gap-2 cursor-pointer rounded-full w-fit hover:bg-blue-100 transition-all duration-500"
        onClick={onShowAnswers}
      >
        {showAnswers ? (
          <>
            <ArrowDropUpIcon className="transform rotate-180"></ArrowDropUpIcon>
            <h1>Thu gọn</h1>
          </>
        ) : (
          <>
            <ArrowDropDownIcon className="transform rotate-180"></ArrowDropDownIcon>
            <h1>Xem phản hồi</h1>
          </>
        )}
      </div>
      {showAnswers ? (
        <div className="mt-4 flex flex-col gap-4 transition-all duration-300">
          {listSubComment.map((item) => (
            <Comment
              comment={item}
              isSubComment={true}
              currentUserAvatar="https://i.pinimg.com/originals/2f/70/d3/2f70d3f60387739c111fd312e6dddae2.jpg"
            ></Comment>
          ))}
          <div
            className="p-2 pr-4 mt-2 font-semibold text-blue-500 flex gap-2 cursor-pointer rounded-full w-fit hover:bg-blue-100 transition-all duration-500"
            onClick={onLoadMoreAnswers}
          >
            <SubdirectoryArrowRightIcon></SubdirectoryArrowRightIcon>
            <h1>Hiện thêm phản hồi</h1>
          </div>
        </div>
      ) : (
        <div className="w-fit transition-all duration-300"></div>
      )}
    </>
  );
};
