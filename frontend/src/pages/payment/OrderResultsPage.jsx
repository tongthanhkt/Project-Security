import React from "react";
import { handleGet } from "../../utils/fetch";
import { useSearchParams } from "react-router-dom";
import queryString from "query-string";
import { API } from "../../common/api";

const OrderSuccessPage = () => {
  const [resp, setResp] = React.useState(null);
  const [searchParams] = useSearchParams();

  function getAllSearchParams() {
    const params = {};
    console.log(
      "🚀 ~ file: OrderSuccess.jsx:12 ~ getAllSearchParams ~ params",
      params
    );

    for (let entry of searchParams.entries()) {
      params[entry[0]] = entry[1];
    }

    return queryString.stringify(params);
  }

  React.useEffect(() => {
    async function getStatus() {
      const params = getAllSearchParams();
      try {
        const respReturn = await handleGet(`${API.RECEIVE_ORDER}?${params}`);
        setResp(respReturn);
        // console.log(
        //   "🚀 ~ file: OrderSuccess.jsx:33 ~ getStatus ~ respReturn",
        //   respReturn
        // );
        // eslint-disable-next-line no-unused-vars
        const respIpn = await handleGet(`${API.UPDATE_ORDER}?${params}`);
        // console.log(
        //   "🚀 ~ file: OrderSuccess.jsx:37 ~ getStatus ~ respIpn",
        //   respIpn
        // );
      } catch (error) {
        console.log(
          "🚀 ~ file: OrderSuccess.jsx:43 ~ getStatus ~ error",
          error
        );
      }
    }
    getStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {resp?.code === "00" ? (
        <>
          <p>GD thành công</p>

          <div>
            Tổng tiền GD:{" "}
            <span style={{ color: "green" }}>
              {searchParams.get("vnp_Amount")}
            </span>
          </div>

          <div>
            Ngân hàng:{" "}
            <span style={{ color: "green" }}>
              {searchParams.get("vnp_BankCode")}
            </span>
          </div>

          <div>
            Nội dung GD:{" "}
            <span style={{ color: "green" }}>
              {searchParams.get("vnp_OrderInfo")}
            </span>
          </div>
        </>
      ) : (
        <p>GD thất bại</p>
      )}
      {/* <button>Thông tin chi tiết</button> */}
    </>
  );
};

export default OrderSuccessPage;
