import React from "react";
import { Navigate } from "react-router-dom";
import { PAGE_PATH } from "../routes/page-paths";

const Protected = ({ isLoggedIn, isStopWhenLogon, children }) => {
  if (!isLoggedIn && !isStopWhenLogon) {
    return <Navigate to={PAGE_PATH.LOGIN} replace />;
  }
  if (isLoggedIn && isStopWhenLogon) {
    return <Navigate to={PAGE_PATH.HOME} replace />;
  }
  return children;
};

export default Protected;
