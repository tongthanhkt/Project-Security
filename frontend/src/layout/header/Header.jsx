/* eslint-disable no-unused-vars */
import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import {
  Button,
  MenuItem,
  Icon,
  ListItemIcon,
  ListItemText,
  FormControl,
  Select,
} from "@mui/material";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux-toolkit/authSlice";
import { AccountBox, ExitToApp } from "@mui/icons-material";
import useMenu from "../../hooks/useMenu";
import { PAGE_PATH } from "../../routes/page-paths";
import { API } from "../../common/api";
import Logo from "../../components/logo/Logo";
import BasicSearch from "../../components/search/BasicSearch";
import BasicButton from "../../components/button/BasicButton";
import { nav_items } from "../../utils/constant";
import NavItems from "./NavItems";

const pages = [
  // { link: PAGE_PATH.MEETING, text: "Meeting" },
  // { link: PAGE_PATH.UPLOAD, text: "Upload demo" },
  // { link: PAGE_PATH.ORDER, text: "Order" },
  {
    link: `${PAGE_PATH.COURSE_LEARNING(
      "63fb671182962758df2dce77"
    )}?lessonId=63fcda48d50dd95556d40f3f`,
    text: "Học tiếp",
  },
  { link: PAGE_PATH.COURSE_MANAGEMENT, text: "Quản lý khóa Admin" },
];
const settings = [
  {
    link: PAGE_PATH.PROFILE,
    text: "Profile",
    icon: <AccountBox />,
  },
];

const Header = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state?.auth);

  const dispatch = useDispatch();
  const {
    anchorEl: anchorElUser,
    handleCloseMenu: handleCloseUserMenu,
    handleOpenMenu: handleOpenUserMenu,
  } = useMenu();

  useEffect(() => {
    window.addEventListener("scroll", function () {
      var navbar = document.querySelector(".navbar");
      navbar.classList.toggle("scrolled", window.scrollY > 0);
    });
  }, []);
  const handleAvatarClick = React.useCallback(
    () => navigate(PAGE_PATH.LOGIN),
    [navigate]
  );

  const handleSignOut = async (e) => {
    try {
      await axios.post(API.LOGOUT);

      dispatch(logout());
      handleCloseUserMenu();
      setTimeout(() => {
        navigate(PAGE_PATH.LOGIN);
      }, 1000);
    } catch (error) {
      console.log(
        "🚀 ~ file: Header.jsx ~ line 47 ~ handleSignOut ~ error",
        error
      );
    }
  };

  return (
    <header className="absolute top-0 left-0 right-0 w-auto z-50">
      <nav className="navbar bg-transparent mb-2.5 border-gray-200 py-3 rounded dark:bg-gray-900 fixed left-1/2 -translate-x-1/2 w-full ">
        <div className="wrapper">
          <div className=" flex items-center justify-between ">
            <Logo></Logo>
            <BasicSearch
              className="lg:w-[400px] md:w-[300px] sm:w-[250px]"
              title="Tìm kiếm khóa học, bài viết, video..."
            ></BasicSearch>
            <div
              className="items-center justify-between flex md:w-auto "
              id="navbar-search"
            >
              <NavItems pages={pages}></NavItems>

              {/* Dropdown dev page */}
              <TestDropdown />

              <>
                <button
                  data-collapse-toggle="navbar-search"
                  type="button"
                  className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                  aria-controls="navbar-search"
                  aria-expanded="false"
                >
                  <span className="sr-only">Open menu</span>
                  <svg
                    className="w-6 h-6"
                    aria-hidden="true"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </button>
                {!user || Object.keys(user).length === 0 ? (
                  <BasicButton
                    variant="none"
                    className="!text-white"
                    onClick={() => navigate(PAGE_PATH.LOGIN)}
                  >
                    Đăng nhập
                  </BasicButton>
                ) : (
                  <Tooltip title={`${user?.data ? "Open settings" : ""}`}>
                    <IconButton
                      onClick={
                        user?.data ? handleOpenUserMenu : handleAvatarClick
                      }
                      sx={{ p: 0 }}
                    >
                      {/* Default & google avatar */}
                      <Avatar
                        sx={
                          !user?.data?.picture
                            ? {
                                // Default profile pic
                                color: "#00A0FB",
                                background: "#b6ecff",
                                border: 2,
                                borderColor: "white",
                              }
                            : {
                                // Google profile pic
                                border: 2,
                                borderColor: "white",
                              }
                        }
                        alt="Remy Sharp"
                        src={user?.data?.picture}
                      />
                    </IconButton>
                  </Tooltip>
                )}
              </>
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {settings.map((setting) => (
                  <MenuItem
                    key={setting.link}
                    onClick={() => {
                      handleCloseUserMenu();
                      setTimeout(() => {
                        navigate(setting.link);
                      }, 500);
                    }}
                  >
                    <ListItemIcon>{setting.icon}</ListItemIcon>
                    <ListItemText>{setting.text}</ListItemText>
                  </MenuItem>
                ))}
                <MenuItem onClick={() => handleSignOut()}>
                  <ListItemIcon>
                    <ExitToApp />
                  </ListItemIcon>
                  <ListItemText>Log out</ListItemText>
                </MenuItem>
              </Menu>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

const TestDropdown = () => {
  const pageTest = [
    {
      name: "Admin panel",
      onClick: () =>
        navigate(
          PAGE_PATH.COURSE_MANAGEMENT_DASHBOARD("63fb671182962758df2dce77")
        ),
    },
    {
      name: "Profile",
      onClick: () => navigate("/profile"),
    },
    { name: "Realtime-page", onClick: () => navigate(PAGE_PATH.MEETING) },
    { name: "Order", onClick: () => navigate(PAGE_PATH.ORDER) },
  ];
  const navigate = useNavigate();
  const {
    anchorEl: anchorElUser,
    handleCloseMenu: handleCloseUserMenu,
    handleOpenMenu: handleOpenUserMenu,
  } = useMenu();

  return (
    <>
      <button
        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none 
        focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2.5 text-center 
        inline-flex items-center"
        type="button"
        onClick={handleOpenUserMenu}
      >
        Demo page
        <svg
          className="w-4 h-4 ml-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          ></path>
        </svg>
      </button>
      <Menu
        sx={{ mt: "45px" }}
        id="menu-appbar"
        anchorEl={anchorElUser}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={Boolean(anchorElUser)}
        onClose={handleCloseUserMenu}
      >
        {pageTest.map((item, index) => (
          <MenuItem
            key={item.name}
            onClick={() => {
              handleCloseUserMenu();
              setTimeout(() => {
                item.onClick();
              }, 500);
            }}
          >
            <ListItemText>{item.name}</ListItemText>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default Header;
