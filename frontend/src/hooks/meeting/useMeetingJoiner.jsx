import React from "react";
import { API } from "../../common/api";
import { handlePost } from "../../utils/fetch";
import { useSearchParams } from "react-router-dom";
import RESP from "../../common/respCode";

const useMeetingJoiner = () => {
  const [isJoined, setIsJoined] = React.useState(false);
  const [isValid, setIsValid] = React.useState(true);
  const [roomName, setRoomName] = React.useState("");
  const [jwt, setJwt] = React.useState(null);
  const [searchParam] = useSearchParams();

  const id = searchParam.get("id");
  console.log(id);

  React.useEffect(() => {
    if (!id || id.trim().length === 0) {
      setIsValid(false);
      return;
    }
    async function getToken() {
      const resp = await handlePost(API.JOIN_MEETING, { meetingId: id });
      console.log(resp);
      if (!resp) {
        alert("can not post data");
        return;
      }
      if (resp.status !== RESP.SUCCESS) {
        alert(resp.message);
        return;
      }
      setJwt(resp.data.token);
      setRoomName(id);
      setIsValid(true);
      setIsJoined(true);
    }
    getToken();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    isJoined,
    isValid,
    roomName,
    jwt,
  };
};

export default useMeetingJoiner;
