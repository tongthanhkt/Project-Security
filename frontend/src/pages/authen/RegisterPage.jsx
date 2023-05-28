import React from "react";
import { Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import TextBox from "../../components/input/TextBox";
import { Link } from "react-router-dom";
import usePopup from "../../hooks/usePopup";
import { API } from "../../common/api";
import BasicForm from "../../components/authen/BasicForm";
import PopupMsg from "../../components/modal/PopupMsg";
import { PAGE_PATH } from "../../routes/page-paths";
import FormHeader from "../../components/authen/FormHeader";
import FormContent from "../../components/authen/FormContent";
import BasicButton from "../../components/button/BasicButton";
import { registerSchema } from "../../common/form-schema";
import useStatus from "../../hooks/useStatus";
import { handlePost } from "../../utils/fetch";

function RegisterPage() {
  const { open, handleClosePopup, handleOpenPopup } = usePopup();

  // Form
  const { status, handleStatus } = useStatus();
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(registerSchema),
  });
  const onSubmit = async (data) => {
    console.log("🚀 ~ file: RegisterPage.jsx:31 ~ onSubmit ~ data", data);
    const resp = await handlePost(API.REGISTER, data);
    console.log("🚀 ~ file: RegisterPage.jsx:33 ~ onSubmit ~ resp", resp);
    handleStatus(resp);
    handleOpenPopup();
  };

  return (
    <BasicForm maxWidth="65%">
      <PopupMsg
        status={status.type}
        isOpen={open}
        handleClosePopup={handleClosePopup}
        navigateTo={PAGE_PATH.LOGIN}
      >
        <Typography variant="h6" textAlign="center">
          {status.msg}
        </Typography>
      </PopupMsg>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormHeader
          title="Đăng ký tài khoản Kodemy"
          caption="Vui lòng điểm thông tin để tạo tài khoản"
        ></FormHeader>

        <FormContent>
          {/* Full Name */}
          <TextBox
            label="Full name"
            placeholder="Enter your full name"
            helperText={errors.name ? errors.name.message : null}
            name="name"
            control={control}
          />

          {/* Email */}
          <TextBox
            label="Email"
            type="email"
            placeholder="Enter your email"
            name="email"
            control={control}
            helperText={errors.email ? errors.email.message : null}
          />

          {/* Address */}
          <TextBox
            label="Address"
            placeholder="Enter your address"
            name="addr"
            control={control}
            helperText={errors.addr ? errors.addr.message : null}
          />

          {/* Password */}
          <TextBox
            label="Password"
            type="password"
            placeholder="Enter your password"
            name="password"
            control={control}
            helperText={errors.password ? errors.password.message : null}
          />
          <TextBox
            label="Confirm Password"
            type="password"
            placeholder="Re-enter your password"
            name="Cpwd"
            control={control}
            helperText={errors.Cpwd ? errors.Cpwd.message : null}
          />

          {/* Sign up button */}
          <BasicButton type="submit">Đăng ký</BasicButton>
          <Typography sx={{ fontSize: "14px" }}>
            Bạn đã có tài khoản?{" "}
            <Typography
              component={Link}
              variant="inherit"
              to={PAGE_PATH.LOGIN}
              color="primary"
            >
              Đăng nhập
            </Typography>
          </Typography>
        </FormContent>
      </form>
    </BasicForm>
  );
}

export default RegisterPage;
