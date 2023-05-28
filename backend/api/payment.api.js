import express from "express";
import VnpayModel from "../model/payment/vnpay.model.js";
import PaypalModel from "../model/payment/paypal.model.js";

const router = express.Router();

router.post("/create_payment_url", function (req, res, next) {
  const paymentInfo = VnpayModel.getPaymentInfo(req);

  const vnp_Params = VnpayModel.setPaymentParams(paymentInfo);

  const vnpUrl = VnpayModel.createPaymentUrl(vnp_Params);

  return res.json(vnpUrl);
});

router.get("/return_payment_results", function (req, res, next) {
  // VNPAY
  const { secureHash, vnp_Params } = VnpayModel.getRetrnParams(req);
  const signed = VnpayModel.encodeParams(vnp_Params);

  if (secureHash === signed) {
    return res.json({ code: vnp_Params["vnp_ResponseCode"] });
  } else {
    return res.json({ code: "97" });
  }

  // Paypal
  // const paypal_params = PaypalModel.createPaymentParams(req);
  // const paypalUrl = PaypalModel.returnPaymentUrl(paypal_params);

  // if (paypalUrl) {
  //   return res.json({ code: "00", url: paypalUrl });
  // } else {
  //   return res.json({ code: "97" });
  // }
});

router.get("/payment_update", function (req, res, next) {
  // VNPAY
  const { secureHash, vnp_Params } = VnpayModel.getRetrnParams(req);

  const signed = VnpayModel.encodeParams(vnp_Params);

  console.log("Cập nhật thông tin vào db");

  if (secureHash === signed) {
    var orderId = vnp_Params["vnp_TxnRef"];
    var rspCode = vnp_Params["vnp_ResponseCode"];
    //Kiem tra du lieu co hop le khong, cap nhat trang thai don hang va gui ket qua cho VNPAY theo dinh dang duoi
    res.status(200).json({ RspCode: "00", Message: "success" });
  } else {
    res.status(200).json({ RspCode: "97", Message: "Fail checksum" });
  }

  // Paypal
  // console.log("Update db");
});

export default router;
