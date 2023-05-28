import { AccountBox, ArrowBackIos, ExitToApp } from "@mui/icons-material";
import {
  Avatar,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Tooltip,
} from "@mui/material";
import axios from "axios";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { API } from "../../common/api";
import useMenu from "../../hooks/useMenu";
import { logout } from "../../redux-toolkit/authSlice";
import { PAGE_PATH } from "../../routes/page-paths";

const settings = [
  {
    link: PAGE_PATH.PROFILE,
    text: "Hồ sơ",
    icon: <AccountBox />,
  },
];

const CourseManagementHeader = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state?.auth);

  const dispatch = useDispatch();
  const {
    anchorEl: anchorElUser,
    handleCloseMenu: handleCloseUserMenu,
    handleOpenMenu: handleOpenUserMenu,
  } = useMenu();

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
        "🚀 ~ file: CourseManagementHeader.jsx:31 ~ handleSignOut ~ error:",
        error
      );
    }
  };

  React.useEffect(() => {
    window.addEventListener("scroll", function () {
      var navbar = document.querySelector(".navbar");
      navbar.classList.toggle("scrolled", window.scrollY > 0);
    });
  }, []);

  return (
    <header className="absolute top-0 left-0 right-0 w-auto z-50">
      <nav
        className="navbar bg-transparent mb-2.5 border-gray-200 py-3 rounded dark:bg-gray-900 fixed 
      left-1/2 -translate-x-1/2 w-full "
      >
        <div className="wrapper">
          <div className=" flex items-center justify-between ">
            <div className="font-semibold hover:underline decoration-2 underline-offset-8 cursor-pointer">
              <ArrowBackIos />
              <span onClick={() => navigate(PAGE_PATH.COURSE_MANAGEMENT)}>
                Quay lại màn hình quản lý
              </span>
            </div>
            {/* Profile */}
            <div className="user-profile">
              <Tooltip title={`${user?.data ? "Open settings" : ""}`}>
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
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

export default CourseManagementHeader;
