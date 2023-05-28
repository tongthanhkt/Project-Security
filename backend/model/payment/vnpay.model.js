import dateFormat from "dateformat";
import * as querystring from "qs";
import crypto from "crypto";

function sortObject(obj) {
  var sorted = {};
  var str = [];
  var key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key));
    }
  }
  str.sort();
  for (key = 0; key < str.length; key++) {
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
  }
  return sorted;
}

export default {
  getPaymentInfo(req) {
    var ipAddr =
      req.headers["x-forwarded-for"] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.connection.socket.remoteAddress;

    var tmnCode = process.env.VNP_TMNCODE;
    var returnUrl = process.env.VNP_RETURN_URL;

    var date = new Date();
    var createDate = date.toLocaleString("sv-SW").replace(/\s|-|:/g, "");
    var orderId = dateFormat(date, "HHmmss");
    var amount = req.body.amount;

    var orderInfo = req.body.orderDescription;
    var locale = "vn";
    var currCode = "VND";

    return {
      ipAddr,
      tmnCode,
      returnUrl,
      createDate,
      orderId,
      amount,
      orderInfo,
      locale,
      currCode,
    };
  },

  setPaymentParams(data) {
    var vnp_Params = {};
    vnp_Params["vnp_Version"] = "2.1.0";
    vnp_Params["vnp_Command"] = "pay";
    vnp_Params["vnp_TmnCode"] = data.tmnCode;
    vnp_Params["vnp_Locale"] = data.locale;
    vnp_Params["vnp_CurrCode"] = data.currCode;
    vnp_Params["vnp_TxnRef"] = data.orderId;
    vnp_Params["vnp_OrderInfo"] = data.orderInfo;
    vnp_Params["vnp_Amount"] = data.amount * 100;
    vnp_Params["vnp_ReturnUrl"] = data.returnUrl;
    vnp_Params["vnp_IpAddr"] = data.ipAddr;
    vnp_Params["vnp_CreateDate"] = data.createDate;

    vnp_Params = sortObject(vnp_Params);

    return vnp_Params;
  },

  encodeParams(vnp_Params) {
    var signData = querystring.stringify(vnp_Params, { encode: false });
    var hmac = crypto.createHmac("sha512", process.env.VNP_HASH_SECRET);
    var signed = hmac.update(new Buffer(signData, "utf-8")).digest("hex");

    return signed;
  },

  createPaymentUrl(vnp_Params) {
    var signed = this.encodeParams(vnp_Params);
    vnp_Params["vnp_SecureHash"] = signed;
    const vnpUrl = `${process.env.VNP_URL}?${querystring.stringify(vnp_Params, {
      encode: false,
    })}`;

    return vnpUrl;
  },

  getRetrnParams(req) {
    var vnp_Params = req.query;

    var secureHash = vnp_Params["vnp_SecureHash"];

    delete vnp_Params["vnp_SecureHash"];
    delete vnp_Params["vnp_SecureHashType"];

    vnp_Params = sortObject(vnp_Params);

    return { secureHash, vnp_Params };
  },
};
