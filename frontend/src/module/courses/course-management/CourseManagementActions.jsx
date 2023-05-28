import BasicButton from "../../../components/button/BasicButton";
import BasicSearch from "../../../components/search/BasicSearch";
import AddIcon from "@mui/icons-material/Add";

export const CourseManagementActions = ({
  handleSearchCourse = (value) => {},
  handleOpenCreateNewCourse = () => {},
}) => {
  return (
    <div className="flex justify-between">
      <BasicSearch
        className="lg:w-[400px] md:w-[300px] sm:w-[250px]"
        title="Tìm kiếm khóa học"
        onChange={handleSearchCourse}
      ></BasicSearch>
      <BasicButton
        icon={<AddIcon></AddIcon>}
        onClick={() => handleOpenCreateNewCourse()}
      >
        <strong>Thêm khoá học</strong>
      </BasicButton>
    </div>
  );
};
