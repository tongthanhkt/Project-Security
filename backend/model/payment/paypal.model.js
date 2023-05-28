import * as querystring from "qs";

export default {
  createPaymentParams(req) {
    const order_params = req.query;

    var paypal_params = {};

    paypal_params["id"] = order_params["id"];
    paypal_params["description"] = order_params["orderInfo"];
    paypal_params["amount"] = order_params["amount"];

    return paypal_params;
  },

  returnPaymentUrl(paypal_params) {
    const paypalUrl = `${
      process.env.DOMAIN_DEV
    }/order-results?${querystring.stringify(paypal_params, { encode: false })}`;

    return paypalUrl;
  },
};
