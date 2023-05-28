import React from "react";
import useMeetingOwner from "../../hooks/meeting/useMeetingOwner";
import MeetingFrame from "./MeetingFrame";
import BasicButton from "./../button/BasicButton";

const MeetingOwner = () => {
  const endTimeInput = React.useRef();

  const {
    onCall,
    jwt,
    createMeeting,
    roomName,
    setOnCall,
    duration,
    openExtendModal,
    onExtend,
    handleCloseExtendModal,
    handleOpenExtendModal,
  } = useMeetingOwner();

  function onEndCall() {
    setOnCall(false);
  }

  return (
    <div className="card" style={{ position: "relative", zIndex: 1 }}>
      {!onCall ? (
        <>
          {/* Create meeting */}
          <label>End time</label>
          <input
            ref={endTimeInput}
            type="datetime-local"
            placeholder="End date"
            defaultValue={new Date().toLocaleString("sv-SW")}
          />
          <BasicButton
            sx={{ mb: 1 }}
            onClick={() => {
              createMeeting(new Date(endTimeInput.current.value).getTime());
            }}
          >
            Create meeting
          </BasicButton>
        </>
      ) : !jwt ? (
        alert("No credential valid")
      ) : (
        <MeetingFrame
          jwt={jwt}
          roomName={roomName}
          onEndCall={onEndCall}
          duration={duration}
          openExtendModal={openExtendModal}
          onExtend={onExtend}
          handleCloseExtendModal={handleCloseExtendModal}
          handleOpenExtendModal={handleOpenExtendModal}
        />
      )}
    </div>
  );
};

export default MeetingOwner;
