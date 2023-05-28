import React from "react";
import { API } from "../../../common/api";
import { handlePost } from "../../../utils/fetch";

var newWindow;

const openNewWindow = (url) => {
  newWindow = window.open(
    url,
    "_blank",
    "toolbar=yes,scrollbars=yes,resizable=yes,width=600,height=600"
  );
};

const closeNewWindow = () => {
  newWindow.close();
};

const VnpayCheckout = ({ product }) => {
  const createOrder = async () => {
    const data = { ...product };
    console.log("🚀 ~ file: PaymentAdapter.jsx:24 ~ createOrder ~ data:", data);
    const resp = await handlePost(API.CREATE_ORDER, data);
    console.log("🚀 ~ file: PaymentAdapter.jsx:26 ~ createOrder ~ resp:", resp);

    openNewWindow(resp);
  };

  return (
    <div className="border-2 p-2 border-black mb-2">
      <h1 className="text-2xl font-bold mb-2 text-red-500">
        Component của VNPAY
      </h1>

      <button className="bg-gray-300 p-2 mr-2" onClick={createOrder}>
        Thanh toán VNPAY
      </button>

      <button
        type="button"
        onClick={closeNewWindow}
        className="bg-gray-300 p-2"
      >
        Close popup window
      </button>
    </div>
  );
};

export default VnpayCheckout;
