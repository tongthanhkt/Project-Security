import React from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { handleGet } from "./../../../utils/fetch";
import { API } from "./../../../common/api";

const PaypalCheckoutBtn = ({ product }) => {
  function createOrder(data, actions) {
    return actions.order.create({
      purchase_units: [
        {
          description: product.orderDescription,
          amount: {
            value: product.amount,
          },
        },
      ],
    });
  }

  async function onApprove(data, actions) {
    const details = await actions.order.capture();
    var order = {
      id: details.id,
      amount: details.purchase_units[0].payments.captures[0].amount.value,
    };

    try {
      const resp = await handleGet(
        `${API.RECEIVE_ORDER}?id=${order.id}&amount=${order.amount}`
      );

      if (resp.code === "00") {
        window.location.replace(resp.url);
      } else {
        alert(resp.code);
      }
    } catch (error) {
      console.log(
        "🚀 ~ file: PaypalCheckoutBtn.jsx:26 ~ onApprove ~ error",
        error
      );
    }
  }

  function checkBought(data, actions) {
    const alreadyBought = false;

    if (alreadyBought) {
      alert("Already bought");
      return actions.reject();
    } else {
      return actions.resolve();
    }
  }

  return (
    <PayPalScriptProvider
      options={{
        "client-id": process.env.REACT_APP_PAYPAL_CLIENT_ID,
        currency: "USD",
      }}
    >
      <PayPalButtons
        style={{
          layout: "vertical",
          color: "gold",
          shape: "rect",
          label: "checkout",
        }}
        createOrder={createOrder}
        onApprove={onApprove}
        onClick={checkBought}
      />
    </PayPalScriptProvider>
  );
};

export default PaypalCheckoutBtn;
