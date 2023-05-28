import {
  CalendarTodayOutlined,
  CloudOutlined,
  Delete,
  Edit,
  MoreVert,
} from "@mui/icons-material";
import {
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Stack,
  Typography,
} from "@mui/material";
import React from "react";
import { useMutation, useQueryClient } from "react-query";
import useMenu from "../../../../../hooks/useMenu";
import usePopup from "../../../../../hooks/usePopup";
import { reactQueryKey } from "../../../../../utils/fetch";
import {
  removeResourceInLesson,
  removeResourcePerma,
} from "./../../../../../utils/resourceHelper";
import FileType from "./../../../../../components/icon/FileType";
import { formatBytes } from "../../../../../utils/fileHelper";
import { tsToDate } from "../../../../../utils/timeHelper";
import ConfirmPopup from "../../../../../components/modal/ConfirmPopup";

const ResourceItem = ({ data, lessonId }) => {
  const { anchorEl, handleCloseMenu, handleOpenMenu, isOpen } = useMenu();
  const queryClient = useQueryClient();
  const resourceId = data._id;
  const [confirmFunc, setConfirmFunc] = React.useState(() => {});

  const settings = [
    {
      text: "Chỉnh sửa",
      icon: <Edit />,
      onClick: () => console.log(resourceId),
      reqConfirm: false,
    },
    {
      text: "Xóa khỏi lớp",
      icon: <Delete />,
      onClick: () => mutationDel.mutate({ resourceId, lessonId }),
      reqConfirm: true,
    },
    {
      text: "Xóa vĩnh viễn",
      icon: <Delete />,
      onClick: () => mutationDelPerma.mutate(resourceId),
      reqConfirm: true,
    },
  ];

  const {
    open: openConfirm,
    handleOpenPopup: handleOpenConfirm,
    handleClosePopup: handleCloseConfirm,
  } = usePopup();

  const mutationDel = useMutation(
    ({ resourceId, lessonId }) => removeResourceInLesson(resourceId, lessonId),
    {
      onError: (error) => {
        console.log(error);
      },
      onSuccess: (data) => {
        console.log(
          "🚀 ~ file: ResourceItem.jsx:59 ~ ResourceItem ~ data:",
          data
        );
        // Invalidate to refetch
        queryClient.invalidateQueries(reactQueryKey.LESSON_RESOURCE(lessonId));
        if (data.status === 0) {
          console.log("Remove from class");
        } else {
          alert(data.message);
        }
      },
    }
  );

  const mutationDelPerma = useMutation(
    (resourceId) => removeResourcePerma(resourceId),
    {
      onError: (error) => {
        console.log(error);
      },
      onSuccess: (data) => {
        console.log(
          "🚀 ~ file: ResourceItem.jsx:59 ~ ResourceItem ~ data:",
          data
        );
        // Invalidate to refetch
        queryClient.invalidateQueries(reactQueryKey.LESSON_RESOURCE());
        if (data.status === 0) {
          console.log("Delete permanent");
        } else {
          alert(data.message);
        }
      },
    }
  );

  const confirming =
    mutationDel.isLoading ||
    mutationDelPerma.isLoading ||
    Boolean(queryClient.isFetching());

  // React.useEffect(() => {
  //   if (!confirming) {
  //     console.log("Close confirm");
  //     handleCloseConfirm();
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [confirming]);

  return (
    <div
      className={`flex hover:bg-slate-200 rounded-md ${
        isOpen ? "bg-slate-200" : ""
      }`}
    >
      {/* Thumbnail */}
      <div className="border w-1/5 h-32 rounded-l-md flex items-center justify-center bg-slate-400">
        <FileType type={data?.type} className="!text-6xl text-slate-200" />
      </div>
      {/* Resource info */}
      <div className="border h-32 p-2 flex-1 rounded-r-md flex justify-between relative group">
        <div>
          {/* Resource name */}
          <div className="line-clamp-1 font-semibold text-slate-600 text-lg">
            {data?.name}
          </div>
          {/* Resource detail */}
          <div className="resource-info mt-3 flex gap-x-2 text-slate-500 text-xs">
            <ResourceDetail
              icon={<CalendarTodayOutlined fontSize="small" />}
              value={tsToDate(data?.createdAt)}
            />
            <ResourceDetail
              icon={<CloudOutlined fontSize="small" />}
              value={formatBytes(data?.size)}
            />
          </div>
        </div>
        {/* More option */}
        <IconButton
          className={`self-center cursor-pointer group-hover:visible ${
            isOpen ? "visible" : "invisible"
          }`}
          onClick={handleOpenMenu}
        >
          <MoreVert className="" />
        </IconButton>
        <Menu anchorEl={anchorEl} open={isOpen} onClose={handleCloseMenu}>
          {settings.map((item) => (
            <MenuItem
              key={item.text}
              onClick={() => {
                if (item.reqConfirm) {
                  handleOpenConfirm();
                  setConfirmFunc(() => item.onClick);
                } else {
                  item.onClick();
                }
                handleCloseMenu();
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText>{item.text}</ListItemText>
            </MenuItem>
          ))}
        </Menu>
        {/* Confirm modal */}
        <ConfirmPopup
          isOpen={openConfirm}
          handleReject={handleCloseConfirm}
          handleConfirm={confirmFunc}
          isConfirming={confirming}
        >
          <Stack sx={{ textAlign: "center" }}>
            <Typography>Bạn có chắc là muốn xóa ?</Typography>
          </Stack>
        </ConfirmPopup>
      </div>
    </div>
  );
};

const ResourceDetail = ({ icon, value }) => {
  return (
    <span className="flex items-center gap-x-1">
      {icon} {value}
    </span>
  );
};

export default ResourceItem;
