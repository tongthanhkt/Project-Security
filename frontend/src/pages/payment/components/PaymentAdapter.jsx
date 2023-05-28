import React from "react";
import PaypalCheckoutBtn from "./PaypalCheckoutBtn";
import VnpayCheckout from "./VnpayCheckout";

const PaymentAdapter = ({ product }) => {
  return (
    <>
      <VnpayCheckout product={product} />
      <PaypalCheckoutBtn product={product} />
    </>
  );
};

export default PaymentAdapter;
