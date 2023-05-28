import React from "react";
import MeetingFrame from "./MeetingFrame";
import { useNavigate } from "react-router-dom";
import { PAGE_PATH } from "../../routes/page-paths";

const MeetingJoiner = ({ jwt, roomName }) => {
  const navigate = useNavigate();
  console.log(jwt);

  function onEndCall() {
    navigate(PAGE_PATH.HOME);
  }

  return (
    <div
      className="card"
      style={{ cursor: "pointer", position: "relative", zIndex: 1 }}
    >
      {!jwt ? (
        alert("No credential valid")
      ) : (
        <MeetingFrame
          jwt={jwt}
          roomName={roomName}
          onEndCall={onEndCall}
          showInviteLink={false}
          canExtend={false}
        />
      )}
    </div>
  );
};

export default MeetingJoiner;
