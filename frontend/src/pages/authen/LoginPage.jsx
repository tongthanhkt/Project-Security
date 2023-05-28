import { Typography } from "@mui/material";
import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import TextBox from "../../components/input/TextBox";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../../redux-toolkit/authSlice";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import FormHeader from "./../../components/authen/FormHeader";
import FormContent from "./../../components/authen/FormContent";
import BasicForm from "./../../components/authen/BasicForm";
import { PAGE_PATH } from "../../routes/page-paths";
import usePopup from "../../hooks/usePopup";
import useStatus from "./../../hooks/useStatus";
import { handlePost } from "./../../utils/fetch";
import PopupMsg from "../../components/modal/PopupMsg";
import PopupForm from "./../../components/modal/PopupForm";
import BasicButton from "../../components/button/BasicButton";
import { API } from "../../common/api";
import { loginSchema } from "../../common/form-schema";
import DevideLine from "../../components/line/DevideLine";
import axios from "axios";

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Loading login
  // Google login
  const [isLogining, setIsLogining] = React.useState(false);
  const handleCredentialResponse = async (response) => {
    setIsLogining(true);
    console.log("Encoded JWT ID token: " + response.credential);
    const postResp = await handlePost(API.LOGIN_GOOGLE, {
      credential: response.credential,
    });
    console.log(
      "🚀 ~ file: LoginPage.jsx:41 ~ handleCredentialResponse ~ post_resp",
      postResp
    );
    handleOpenForgotPass();
    handleLoginStatus(postResp);
    if (postResp.status === 0) {
      dispatch(login(postResp.info));
      console.log("dispatch", postResp.info);
      navigate(PAGE_PATH.HOME);
    }
    handleOpenLoginPopup();
    setIsLogining(false);
  };

  // Form
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
  });

  // Normal login
  const { status: loginStatus, handleStatus: handleLoginStatus } = useStatus();
  const {
    open: openLoginPopup,
    handleClosePopup: handleCloseLoginPopup,
    handleOpenPopup: handleOpenLoginPopup,
  } = usePopup();
  const onSubmit = async (data) => {
    console.log("🚀 ~ file: LoginPage.jsx:68 ~ onSubmit ~ data", data);
    setIsLogining(true);
    const resp = await handlePost(API.LOGIN, data);

    handleLoginStatus(resp);

    // Store data
    if (resp.status === 0) {
      console.log(data.email)
      await axios.post("http://localhost:3000/api/v1/fulfillment/get-otp",
       {email: data.email},
      );
      handleOpenForgotPass();
      //dispatch(login(resp.data));
    }
    handleOpenLoginPopup();
    setIsLogining(false);
  };

  // Handle forgot pass
  const {
    open: openForgotPass,
    handleClosePopup: handleCloseForgotPass,
    handleOpenPopup: handleOpenForgotPass,
  } = usePopup();

  return (
    <BasicForm maxWidth="60%">
      {/* Modal */}
      <div className="login-modal">
        {/* Login msg */}
        <PopupMsg
          status={loginStatus.type}
          isOpen={openLoginPopup}
          handleClosePopup={handleCloseLoginPopup}
          navigateTo={PAGE_PATH.HOME}
          hideOnSuccess={true}
        >
          <Typography variant="h6" textAlign="center">
          Fail
          </Typography>
        </PopupMsg>
        {/* Forgot password modal */}
        <PopupForm
          isOpen={openForgotPass}
          handleClose={handleCloseForgotPass}
          api={API.FORGOT_PASSWORD}
          header="OTP code already send to your email. Please enter it here"
          label="OTP"
          fieldName="otp"
          buttonLabel="Send"
          successMsg="Validate Successfullyy !!"
        />
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormHeader
          title="Đăng nhập vào Kodemy"
          caption="Nothing is impssible"
        ></FormHeader>
        <FormContent>
          {/* email */}
          <TextBox
            label="Email"
            type="email"
            placeholder="Enter your email"
            helperText={errors.email ? errors.email.message : null}
            name="email"
            control={control}
          />
          {/* password */}
          <TextBox
            label="Password"
            type="password"
            placeholder="Enter your password"
            helperText={errors.password ? errors.password.message : null}
            name="password"
            control={control}
          />
          {/* Forgot password */}
          <Typography
            color="primary"
            variant="caption"
            sx={{ alignSelf: "start", cursor: "pointer", marginLeft: "auto" }}
            onClick={handleOpenForgotPass}
          >
            Quên mật khẩu ?
          </Typography>
          {/* Login button */}
          <BasicButton
            type="submit"
            className="w-full !bg-blue-500 !text-white !rounded-md "
            variant="text"
            loading={isLogining}
          >
            Đăng nhập
          </BasicButton>
          <DevideLine></DevideLine>
          {/* Continue as google */}
          {isLogining ? null : (
            <GoogleLogin
              text="none"
              size="large"
              theme="outlined"
              onSuccess={(credentialResponse) => {
                console.log(credentialResponse);
                handleCredentialResponse(credentialResponse);
              }}
              onError={() => {
                console.log("Login Failed");
              }}
            />
          )}
          <Typography sx={{ fontSize: "14px" }}>
            Bạn chưa có tài khoản ?{" "}
            <Typography
              variant="inherit"
              component={Link}
              to={PAGE_PATH.REGISTER}
              color="primary"
            >
              Đăng ký
            </Typography>
          </Typography>
        </FormContent>
      </form>
    </BasicForm>
  );
};

export default LoginPage;
