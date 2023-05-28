import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import ArticleIcon from "@mui/icons-material/Article";
export const CourseChapter = ({
  topic,
  lessons = [],
  isOpen = false,
  onClick = () => {},
}) => {
  return (
    <div className="flex flex-col">
      <div
        className="px-5 py-3 bg-slate-200 border-slate-400 rounded-md flex justify-between cursor-pointer select-none"
        onClick={onClick}
      >
        <div className="font-semibold flex">
          {isOpen ? (
            <RemoveIcon fontSize="small" color="primary"></RemoveIcon>
          ) : (
            <AddIcon fontSize="small" color="primary"></AddIcon>
          )}
          <h3 className="pl-2">{topic.name}</h3>
        </div>
        <h4>{lessons.length} bài học</h4>
      </div>
      {isOpen && (
        <div>
          {lessons.length > 0 ? (
            lessons.map((item) => (
              <div key={item._id} className="px-5 py-3 flex justify-between">
                <div className="flex">
                  {item.isVideo ? (
                    <PlayCircleIcon
                      fontSize="small"
                      color="primary"
                    ></PlayCircleIcon>
                  ) : (
                    <ArticleIcon fontSize="small" color="primary"></ArticleIcon>
                  )}
                  <h4 className="pl-2">{item.name}</h4>
                </div>
                <h4>{item.duration}</h4>
              </div>
            ))
          ) : (
            <h2 className="px-5 py-3">Chưa có bài học</h2>
          )}
        </div>
      )}
    </div>
  );
};
