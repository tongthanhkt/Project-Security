import React, { useEffect, useState } from "react";
import ReactPagination from "react-paginate";
import "../pagination/style.css";
export const Pagination = ({ handlePageClick, pageCount }) => {
  return (
    <ReactPagination
      className="pagination"
      pageClassName="cursor-pointer"
      pageLinkClassName="p-2"
      activeClassName="active"
      breakLabel="..."
      nextLabel="&raquo;"
      onPageChange={handlePageClick}
      pageRangeDisplayed={3}
      pageCount={pageCount}
      previousLabel="&laquo;"
      renderOnZeroPageCount={null}
    ></ReactPagination>
  );
};
