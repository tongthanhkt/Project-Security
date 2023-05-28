import React from "react";
import PaymentAdapter from "./components/PaymentAdapter";

const product = {
  amount: 10000,
  orderDescription: `Đây là mô tả sp ${Date.now()}`,
};

const OrderPage = () => {
  return (
    <div className="p-4">
      <div>
        <label className="font-bold mr-2">Số tiền</label>
        <span name="amount">{product.amount}</span>
      </div>

      <div>
        <label className="font-bold mr-2">Nội dung thanh toán</label>
        <span name="amount">{product.orderDescription}</span>
      </div>

      <PaymentAdapter product={product} />
    </div>
  );
};

export default OrderPage;
