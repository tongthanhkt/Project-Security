import React from "react";
import { useNavigate, useParams } from "react-router-dom";

const BasicFilter = ({ filters = [], path = "/" }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  return (
    <div className=" inline-flex gap-4 rounded-md shadow-sm mb-8" role="group">
      {filters?.map((filter) => (
        <button
          key={filter.id}
          type="button"
          className="px-4 py-2 text-md font-medium outline-none text-gray-900 bg-white  hover:border-none rounded-md hover:bg-[linear-gradient(90deg,_rgba(4,118,244,1)_0%,_rgba(4,191,253,1)_100%)] hover:text-white focus:z-10  focus:text-white focus:bg-[linear-gradient(90deg,_rgba(4,118,244,1)_0%,_rgba(4,191,253,1)_100%)] focus:border-none shadow-[0px_0px_10px_rgb(18_2_47_/_15%);]"
          autoFocus={id === filter.code}
          onClick={() => navigate(`${path}/${filter.code}`)}
        >
          {filter.name}
        </button>
      ))}
    </div>
  );
};

export default BasicFilter;
