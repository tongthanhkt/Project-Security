import React from "react";
import { API } from "../../common/api";
import { endConferenceExtendTime } from "../../common/jitsi-config";
import { handlePost } from "../../utils/fetch";
import usePopup from "../usePopup";

async function createInstantMeeting(endTime) {
  const resp = await handlePost(API.CREATE_MEETING, {
    startTs: 0,
    endTs: endTime,
    // endTs: Date.now() + 15 * 60 * 1000,
  });
  return !resp || !resp.data || !resp.data.id || !resp.data.token
    ? null
    : {
        id: resp.data.id,
        token: resp.data.token,
        endTs: resp.data.endTs,
        startTs: resp.data.startTs,
      };
}

const useMeetingOwner = () => {
  const [roomName, setRoomName] = React.useState("");
  const [onCall, setOnCall] = React.useState(false);
  const [jwt, setJwt] = React.useState(null);
  const [duration, setDuration] = React.useState(0);
  const {
    open: openExtendModal,
    handleOpenPopup: handleOpenExtendModal,
    handleClosePopup: handleCloseExtendModal,
  } = usePopup();

  async function createMeeting(endTime) {
    const resp = await createInstantMeeting(endTime);
    console.log(resp);
    if (resp) {
      setOnCall(true);
      setJwt(resp.token);
      setRoomName(resp.id);
      setDuration(resp.endTs - resp.startTs);
    } else {
      alert("No credential valid");
    }
  }

  async function onExtend() {
    handleCloseExtendModal();
    alert("Extend for 1 minute");

    // Extend timeout
    const resp = await handlePost(API.EXTEND_MEETING, {
      meetingId: roomName,
      extendTs: endConferenceExtendTime,
    });

    if (resp.status === 0) {
      setDuration(resp.data.newEndTs - Date.now());
    } else {
      alert("Extend not valid");
    }
  }

  return {
    onCall,
    jwt,
    setJwt,
    createMeeting,
    setOnCall,
    roomName,
    duration,
    openExtendModal,
    onExtend,
    handleCloseExtendModal,
    handleOpenExtendModal,
  };
};

export default useMeetingOwner;
