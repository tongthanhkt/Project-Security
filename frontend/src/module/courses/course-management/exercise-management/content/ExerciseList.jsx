import {
  CodeOutlined,
  Delete,
  Edit,
  ExpandCircleDown,
  MoreVert,
  QuestionMarkOutlined,
} from "@mui/icons-material";
import React from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import {
  getLessonExercises,
  removeExerciseFromLesson,
} from "../../../../../utils/exerciseHelper";
import { reactQueryKey } from "../../../../../utils/fetch";
import { EXERCISE_TYPE } from "./../../../../../common/constants";
import BasicSearch from "./../../../../../components/search/BasicSearch";
import BasicButton from "./../../../../../components/button/BasicButton";
import {
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Skeleton,
} from "@mui/material";
import usePopup from "../../../../../hooks/usePopup";
import MultiChoice from "../modal/MultiChoice";
import BasicModal from "./../../../../../components/modal/BasicModal";
import ConfirmPopup from "./../../../../../components/modal/ConfirmPopup";
import useMenu from "./../../../../../hooks/useMenu";
import RESP from "../../../../../common/respCode";
import CodingExerciseModal from "../modal/CodingExerciseModal";
import { htmlToPlainText } from "../../../../../utils/fileHelper";
import Empty from "../../../../../components/empty/Empty";
import { useSearchParams } from "react-router-dom";

const ExerciseList = ({ lessonId, topicId }) => {
  // Fetch data
  const {
    data: exercises,
    isLoading,
    error,
  } = useQuery(reactQueryKey.LESSON_EXERCISES(lessonId), () =>
    getLessonExercises(lessonId)
  );

  // Add new exercise
  const {
    open: openAddQuiz,
    handleClosePopup: handleCloseAddQuiz,
    handleOpenPopup: handleOpenAddQuiz,
  } = usePopup();
  const {
    open: openAddCoding,
    handleClosePopup: handleCloseAddCoding,
    handleOpenPopup: handleOpenAddCoding,
  } = usePopup();
  const { anchorEl, isOpen, handleOpenMenu, handleCloseMenu } = useMenu();
  const settings = [
    {
      text: "Lập trình",
      icon: <CodeOutlined />,
      onClick: () => handleOpenAddCoding(),
    },
    {
      text: "Trắc nghiệm",
      icon: <QuestionMarkOutlined />,
      onClick: () => handleOpenAddQuiz(),
    },
  ];

  if (error) return "An error has occurred: " + error.message;

  return (
    <>
      <div className="flex flex-col gap-y-4">
        <div className="flex justify-between">
          <BasicSearch title="Tìm kiếm bài tập" />
          <BasicButton
            onClick={handleOpenMenu}
            className="!font-semibold"
            endIcon={<ExpandCircleDown />}
          >
            Thêm bài tập
          </BasicButton>
          <Menu anchorEl={anchorEl} open={isOpen} onClose={handleCloseMenu}>
            {settings.map((item, index) => (
              <div key={item.text}>
                <MenuItem
                  onClick={() => {
                    item.onClick();
                    handleCloseMenu();
                  }}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText>{item.text}</ListItemText>
                </MenuItem>
                {index < settings.length - 1 ? <hr /> : null}
              </div>
            ))}
          </Menu>
        </div>
        {isLoading ? (
          <ExerciseLoading />
        ) : exercises?.data?.length === 0 ? (
          <Empty
            message="Không có bài tập"
            imgSrc="/images/resource/empty_resources.png"
          />
        ) : (
          <>
            {exercises?.data?.map((item) => (
              <ExerciseItem
                key={item._id}
                data={item}
                lessonId={lessonId}
                topicId={topicId}
              />
            ))}
          </>
        )}
      </div>
      <div className="modal-exercise">
        <BasicModal open={openAddQuiz} handleClose={handleCloseAddQuiz}>
          <MultiChoice
            lessonId={lessonId}
            closeModal={handleCloseAddQuiz}
            topicId={topicId}
          />
        </BasicModal>
        <BasicModal
          open={openAddCoding}
          handleClose={handleCloseAddCoding}
          fullWidth={true}
          padding="20px"
        >
          <CodingExerciseModal
            lessonId={lessonId}
            closeModal={handleCloseAddCoding}
            topicId={topicId}
          />
        </BasicModal>
      </div>
    </>
  );
};

const ExerciseItem = ({ data, lessonId, topicId }) => {
  // eslint-disable-next-line no-unused-vars
  const [searchParams, setSearchParams] = useSearchParams();
  const settings = [
    {
      text: "Chỉnh sửa",
      icon: <Edit />,
      onClick: () => setSearchParams({ lessonId, exerciseId: data._id }),
      reqConfirm: false,
    },
    {
      text: "Xóa",
      icon: <Delete />,
      onClick: () => mutationDel.mutate({ lessonId, exerciseId: data._id }),
      reqConfirm: true,
    },
  ];
  var icon = null;
  var exType;
  switch (data.type) {
    case EXERCISE_TYPE.MULTI_CHOICE:
      icon = <QuestionMarkOutlined fontSize="large" />;
      exType = "Trắc nghiệm";
      break;
    case EXERCISE_TYPE.CODING:
      icon = <CodeOutlined fontSize="large" />;
      exType = "Lập trình";
      break;

    default:
      break;
  }

  // Menu
  const { anchorEl, isOpen, handleOpenMenu, handleCloseMenu } = useMenu();
  const {
    open: openConfirmDel,
    handleClosePopup: handleCloseConfirm,
    handleOpenPopup: handleOpenConfirm,
  } = usePopup();
  const [confirmFunc, setConfirmFunc] = React.useState(() => {});

  function handleMenuClick(reqConfirm, executeFunc) {
    if (reqConfirm) {
      handleOpenConfirm();
      setConfirmFunc(() => executeFunc);
    } else {
      executeFunc();
    }
    handleCloseMenu();
  }

  // Edit, delete
  const queryClient = useQueryClient();
  const mutationDel = useMutation(
    ({ exerciseId, lessonId }) =>
      removeExerciseFromLesson(lessonId, exerciseId),
    {
      onError: (error) => {
        console.log(error);
      },
      onSuccess: (data) => {
        console.log(
          "🚀 ~ file: ExerciseList.jsx:136 ~ ExerciseItem ~ data:",
          data
        );
        // Invalidate to refetch
        queryClient.invalidateQueries(reactQueryKey.LESSON_EXERCISES(lessonId));
        queryClient.invalidateQueries(reactQueryKey.TOPIC_LESSON(topicId));
        if (data.status === RESP.SUCCESS) {
          console.log("Remove exercise success");
        } else {
          alert(data.message);
        }
      },
    }
  );
  const confirming = mutationDel.isLoading || Boolean(queryClient.isFetching());

  return (
    <>
      <div className="border w-full p-2 flex gap-x-2 rounded-md items-center">
        {icon}

        <ExerciseCol className="w-2/5" label="Bài tập" value={data.question} />
        <ExerciseCol className="w-1/5" label="Loại bài tập" value={exType} />
        <ExerciseCol
          className="ml-auto"
          label="Số câu trả lời"
          value={data?.answers?.length || data?.examples?.length}
        />
        <button
          onClick={handleOpenMenu}
          className="hover:bg-slate-200 rounded-full p-1"
        >
          <MoreVert />
        </button>
        <Menu anchorEl={anchorEl} open={isOpen} onClose={handleCloseMenu}>
          {settings.map((item) => (
            <MenuItem
              key={item.text}
              onClick={() => handleMenuClick(item.reqConfirm, item.onClick)}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText>{item.text}</ListItemText>
            </MenuItem>
          ))}
        </Menu>
      </div>
      <div className="modal-exercise">
        <ConfirmPopup
          isOpen={openConfirmDel}
          handleClose={handleCloseConfirm}
          handleReject={handleCloseConfirm}
          handleConfirm={confirmFunc}
          isConfirming={confirming}
        >
          <p className="text-black">Bạn có chắc là muốn xóa</p>
        </ConfirmPopup>
      </div>
    </>
  );
};

const ExerciseCol = ({ className, label, value }) => {
  // const plainText = htmlToPlainText(value);

  return (
    <div className={`${className}`}>
      <label className="text-sm text-slate-400">{label}</label>
      <div className="line-clamp-2">{htmlToPlainText(value)}</div>
    </div>
  );
};

const ExerciseLoading = () => {
  return (
    <>
      <div className="flex justify-between">
        <Skeleton variant="rounded" height={40} width="30%" />
        <Skeleton variant="rounded" height={40} width="20%" />
      </div>
      <Skeleton variant="rounded" height={40} />
      <Skeleton variant="rounded" height={40} />
    </>
  );
};

export default ExerciseList;
