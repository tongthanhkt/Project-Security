import React from "react";
import Header from "./header/Header";
import { styled } from "@mui/system";
import Footer from "./footer/Footer";

const Container = styled("div")({
  // background: "url(/images/bg_banner.png)",
  // width: "100%",
  // height: "100%",
  // position: "relative",
  // backgroundRepeat: "no-repeat",
  // backgroundPosition: "center",
  // backgroundSize: "100% 100%",
  backgroundColor: "#fff",
});

const BasicLayout = ({ children }) => {
  return (
    <Container>
      <Header></Header>
      {children}
      <Footer></Footer>
    </Container>
  );
};

export default BasicLayout;
