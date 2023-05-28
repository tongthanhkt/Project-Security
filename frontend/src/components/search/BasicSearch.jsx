import React, { useRef, useState } from "react";
import lodash from "lodash";
import ReactDOM from "react-dom";
import useClickOutside from "../../hooks/useClickOutSide";

const BasicSearch = ({
  ref = null,
  title,
  className = "",
  dropdownWrapperClassName = "",
  showResultDropdown = false,
  dropdownData = [],
  onChange = (value) => {},
  noItemText = "Không có kết quả",
  delay = 500,
  defaultValue = "",
  fullWidth = false,
  itemBuilder = (item) => <div></div>,
}) => {
  const [coords, setCoords] = useState({});
  const { show, setShow, nodeRef } = useClickOutside();
  const handleOnChangeKeyword = lodash.debounce((e) => {
    onChange(e.target.value);
    setCoords(nodeRef.current?.getBoundingClientRect());
    setShow(e.target.value !== "");
  }, delay);
  const onClickSearchInput = (e) => {
    if (e.target.value) {
      setCoords(nodeRef.current?.getBoundingClientRect());
      setShow(true);
    }
  };
  return (
    <div className="relative">
      <div
        ref={nodeRef}
        className={`${!fullWidth ? "flex" : "flex-1"} ml-auto sm:ml-0`}
      >
        <div className="relative h-fit hidden sm:block">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg
              className="w-5 h-5 text-gray-500"
              aria-hidden="true"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clipRule="evenodd"
              ></path>
            </svg>
            <span className="sr-only">Search icon</span>
          </div>
          <input
            ref={ref}
            type="text"
            id="search-navbar"
            className={`block w-full max-h-12  p-3 pl-10 text-sm leading-6 font-semibold text-gray-900 border border-gray-300 rounded-md bg-gray-100 focus:bg-white focus:ring-blue-100 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ${className}`}
            placeholder={title}
            defaultValue={defaultValue}
            onChange={handleOnChangeKeyword}
            onClick={onClickSearchInput}
          />
        </div>
        <button
          type="button"
          data-collapse-toggle="navbar-search"
          aria-controls="navbar-search"
          aria-expanded="false"
          className="sm:hidden text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-2.5 mr-1"
        >
          <svg
            className="w-5 h-5"
            aria-hidden="true"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
              clipRule="evenodd"
            ></path>
          </svg>
          <span className="sr-only">Search</span>
        </button>
      </div>
      {showResultDropdown && show && (
        <DropdownList
          coords={coords}
          dropdownData={dropdownData}
          noItemText={noItemText}
          itemBuilder={itemBuilder}
          wrapperClassName={dropdownWrapperClassName}
        ></DropdownList>
      )}
    </div>
  );
};
const DropdownList = ({
  coords,
  dropdownData,
  noItemText = "",
  itemBuilder = (item) => <div></div>,
  wrapperClassName = "",
}) => {
  if (typeof document === "undefined") return null;
  return (
    <div
      className={`absolute bg-white -500 z-50 rounded-md border border-gray-300 ${wrapperClassName}`}
      style={{
        // left: coords.left,
        top: coords.height + 4,
        width: coords.width,
      }}
    >
      {dropdownData.length !== 0 ? (
        dropdownData.map((item) => itemBuilder(item))
      ) : (
        <div className="p-2">
          <h1 className="text-slate-400">{noItemText}</h1>
        </div>
      )}
    </div>
  );
};

export default BasicSearch;
