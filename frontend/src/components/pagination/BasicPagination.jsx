import * as React from "react";
import { Pagination } from "./Pagination";

export default function BasicPagination({
  pageCount,
  handlePageClick,
  children,
}) {
  return (
    <>
      {children}
      <div className="flex justify-end mt-6">
        <Pagination
          handlePageClick={handlePageClick}
          pageCount={pageCount}
        ></Pagination>
      </div>
    </>
  );
}
