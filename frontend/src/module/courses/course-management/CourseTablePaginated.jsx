import { Skeleton } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useEffect } from "react";
import { Pagination } from "../../../components/pagination/Pagination";
import Table from "../../../components/table/Table";
import IconButton from "../../../components/button/IconButton";
import { useNavigate } from "react-router-dom";

const ITEMS_PER_PAGE = 7;

export const CourseTablePaginated = ({
  itemsPerPage,
  items,
  pageCount,
  handlePageClick,
  isLoading,
}) => {
  useEffect(() => {
    console.log("items: ", items);
  }, []);
  return (
    <>
      <CourseTable currentItems={items} isLoading={isLoading} />
      <div className="flex justify-end mt-6">
        <Pagination
          handlePageClick={handlePageClick}
          pageCount={pageCount}
        ></Pagination>
      </div>
    </>
  );
};

export const CourseTable = ({ currentItems, isLoading }) => {
  const navigate = useNavigate();
  const handleCopyId = (id) => {
    navigator.clipboard.writeText(id);
  };
  return (
    <Table>
      <thead>
        <tr>
          <th className="border border-slate-300 p-4">ID</th>
          <th className="border border-slate-300 p-4">Khoá học</th>
          <th className="border border-slate-300 p-4">Mô tả khoá học</th>
          <th className="max-w-[200px] border border-slate-300 p-4">
            Số lượng học sinh
          </th>
          <th className="border border-slate-300 p-4"></th>
        </tr>
      </thead>
      <tbody>
        {isLoading
          ? Array(ITEMS_PER_PAGE)
              .fill(0)
              .map((item, index) => (
                <tr key={index} className="hover:bg-slate-100">
                  <td className="border border-slate-200 p-2">
                    <Skeleton variant="text"></Skeleton>
                  </td>
                  <td className="border min-w-[200px] max-w-[200px] border-slate-200 p-2 hover:underline">
                    <Skeleton variant="text"></Skeleton>
                  </td>
                  <td className="border min-w-[400px] max-w-[400px] border-slate-200 p-2 truncate">
                    <Skeleton variant="text"></Skeleton>
                  </td>
                  <td className="border border-slate-200 p-2">
                    <Skeleton variant="text"></Skeleton>
                  </td>
                  <td className="border border-slate-200 p-2">
                    <div className="flex gap-2 justify-center">
                      <Skeleton
                        variant="rectangular"
                        width={40}
                        height={40}
                      ></Skeleton>
                      <Skeleton
                        variant="rectangular"
                        width={40}
                        height={40}
                      ></Skeleton>
                    </div>
                  </td>
                </tr>
              ))
          : currentItems.map((item) => (
              <tr key={item._id} className="hover:bg-slate-100">
                <td className="min-w-[100px] max-w-[150px] border border-slate-200 p-2">
                  <div className="flex gap-4">
                    <ContentCopyIcon
                      className="cursor-pointer"
                      onClick={() => handleCopyId(item._id)}
                    ></ContentCopyIcon>
                    ...
                    {item._id.slice(item._id.length - 5, item._id.length)}
                  </div>
                </td>
                <td className="border min-w-[300px] max-w-[300px] border-slate-200 p-2">
                  <div className="flex gap-2 items-center">
                    <img
                      className="w-20 h-20 object-contain"
                      src={
                        item.thumbUrl !== null && item.thumbUrl !== undefined
                          ? item.thumbUrl
                          : "/images/no_image.jpg"
                      }
                      alt="courseThumbnail"
                    ></img>
                    <a
                      className="hover:underline"
                      href={`/course-detail/${item._id}`}
                    >
                      {item.name}
                    </a>
                  </div>
                </td>
                <td
                  className="border min-w-[400px] max-w-[400px] border-slate-200 p-2 truncate"
                  dangerouslySetInnerHTML={{
                    __html:
                      item.description.length > 50
                        ? item.description.slice(0, 50).concat("...")
                        : item.description,
                  }}
                ></td>
                <td className="max-w-[100px] border border-slate-200 p-2">
                  {item.nStudents}
                </td>
                <td className="border border-slate-200 p-2">
                  <div className="flex gap-2 justify-center">
                    <IconButton
                      className="!bg-green-500 hover:!bg-green-700"
                      onClick={() => {
                        navigate(`/course-management/${item._id}`);
                      }}
                    >
                      <EditIcon style={{ color: "white" }}></EditIcon>
                    </IconButton>
                    <IconButton>
                      <VisibilityOffIcon></VisibilityOffIcon>
                    </IconButton>
                  </div>
                </td>
              </tr>
            ))}
      </tbody>
    </Table>
  );
};
