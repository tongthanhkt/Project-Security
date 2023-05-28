import { Pagination } from "../../../components/pagination/Pagination";
import { Comment } from "./Comment";

export const PaginatedCommentList = ({
  itemsPerpage,
  listComment,
  pageCount,
  handlePageClick,
  isLoading,
}) => {
  return (
    <>
      {listComment.map((item) => (
        <Comment
          comment={item}
          currentUserAvatar="https://i.pinimg.com/originals/2f/70/d3/2f70d3f60387739c111fd312e6dddae2.jpg"
          isTA={true}
          isOwner={true}
        ></Comment>
      ))}
      <div className="flex justify-end">
        <Pagination
          handlePageClick={handlePageClick}
          pageCount={pageCount}
        ></Pagination>
      </div>
    </>
  );
};
