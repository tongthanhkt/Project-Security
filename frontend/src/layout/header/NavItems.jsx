import React from "react";
import "./styles/styles.css";

const NavItems = ({ pages }) => {
  return (
    <div className="hidden md:flex  px-4 py-6 mt-4 border border-gray-100 rounded-lg  md:flex-row  md:mt-0 md:text-sm md:font-medium md:border-0  dark:border-gray-700 gap-8 mr-4 ">
      {pages.map((item) => (
        <a
          key={item.link}
          href={item.link}
          className={`block py-2 pl-3 pr-4 nav-item rounded md:p-0  !ml-0`}
          aria-current="page"
        >
          {item.text}
        </a>
      ))}
    </div>
  );
};

export default NavItems;
