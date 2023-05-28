/* eslint-disable no-unused-vars */
import React, { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { protectedRoutes, publicRoutes } from "./routes/page-routes";
import { useSelector } from "react-redux";
import { BarWave } from "react-cssfx-loading";
import Loading from "./components/loading/Loading";
import { createTheme } from "@mui/material";

const DELAY_TIME = 500;

const Protected = lazy(() =>
  Promise.all([
    import("./components/Protected.jsx"),
    new Promise((resolve) => setTimeout(resolve, DELAY_TIME)),
  ]).then(([module]) => module)
);

function App() {
  const { user } = useSelector((state) => state.auth);

  function listProtectedRoutes(routes) {
    return routes.map((route) => {
      const Layout = route.layout;
      const Page = route.component;
      const Path = typeof route.path === "function" ? route.path() : route.path;
      return (
        <Route
          key={Path}
          path={Path}
          element={
            // No layout page
            route.noLayout ? (
              <Protected
                isLoggedIn={user?.data}
                isStopWhenLogon={route.stopWhenLogin}
              >
                <Page />
              </Protected>
            ) : (
              // With layout page
              <Layout>
                <Protected
                  isLoggedIn={user?.data}
                  isStopWhenLogon={route.stopWhenLogin}
                >
                  <Page />
                </Protected>
              </Layout>
            )
          }
        />
      );
    });
  }

  function listPublicRoutes(routes) {
    return routes.map((route) => {
      const Layout = route.layout;
      const Page = route.component;
      return (
        <Route
          key={route.path}
          path={route.path}
          element={
            <Layout>
              <Page />
            </Layout>
          }
        />
      );
    });
  }

  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        {/*================================= stop when NOT logon ====================================*/}
        {/* Resource thêm điều kiện kiểm tra role của user là admin hay ko ở đây */}
        {listProtectedRoutes(protectedRoutes)}

        {/*================================= No lock ====================================*/}
        {listPublicRoutes(publicRoutes)}
      </Routes>
    </Suspense>
  );
}

export default App;
