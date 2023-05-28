import BasicButton from "../../../components/button/BasicButton";
import ImportContactsIcon from "@mui/icons-material/ImportContacts";
import AccessTimeFilledIcon from "@mui/icons-material/AccessTimeFilled";
import PeopleIcon from "@mui/icons-material/People";
import { handlePost } from "../../../utils/fetch";
import { toast } from "react-toastify";
import { API } from "../../../common/api";

export const CourseGenerralInfo = ({ courseDetail, topicsAndLessions, id }) => {
  const handleOnEnrollCourse = async () => {
    const res = await handlePost(API.REGISTRY_COURSES, {
      course_id: id,
    });
    if (res?.status === 0) {
      toast.success("Đăng ký thành công");
    } else {
      toast.error("Bạn đã đăng ký khóa học rồi");
    }
  };
  const listTA = courseDetail?.tutorsInfo;
  return (
    <div className="basis-1/2 justify-center flex flex-col items-center">
      <img
        className="object-fill h-48 w-96 rounded-lg border-slate-200 border-1"
        src={
          courseDetail?.thumbUrl
            ? courseDetail?.thumbUrl
            : "/images/no_image.jpg"
        }
        alt="course"
      />
      <h1 className="text-3xl mt-4 text-blue-500">Miễn phí</h1>
      <BasicButton className="!mt-4" onClick={handleOnEnrollCourse}>
        <strong>Đăng ký học</strong>
      </BasicButton>
      <div>
        <div className="flex gap-4 mt-6">
          <ImportContactsIcon></ImportContactsIcon>
          <h2>
            Tổng số{" "}
            <strong>
              {topicsAndLessions?.reduce(
                (sum, item) => sum + item?.lession?.length,
                0
              )}
            </strong>{" "}
            bài học
          </h2>
        </div>
        <div className="flex gap-4 mt-4">
          <AccessTimeFilledIcon></AccessTimeFilledIcon>
          <h2>
            Thời lượng <strong>08 giờ 43 phút</strong>
          </h2>
        </div>
        <TAList listTA={listTA}></TAList>
      </div>
    </div>
  );
};

const TAList = ({ listTA = [] }) => {
  return (
    <div>
      <div className="flex gap-4 mt-4">
        <PeopleIcon></PeopleIcon> <h2>Danh sách giảng viên phụ trách</h2>
      </div>
      <div className="pt-2 pl-4 font-semibold">
        {listTA.map((item) => (
          <div key={item._id} className="flex gap-4 hover:text-blue-800">
            <p>•</p>
            <a href="/">
              <h4>{item.name}</h4>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};
