import { JitsiMeeting } from "@jitsi/react-sdk";
import React from "react";
import Draggable from "react-draggable";
import {
  config,
  domain,
  endConferenceReminderTime,
  interfaceConfig,
} from "../../common/jitsi-config";
import useResize from "./../../hooks/meeting/useResize";
import BasicButton from "./../button/BasicButton";
import { PAGE_PATH } from "../../routes/page-paths";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { Box, Skeleton, Stack, Typography } from "@mui/material";
import ConfirmPopup from "./../modal/ConfirmPopup";

const MeetingFrame = ({
  jwt,
  roomName,
  onEndCall,
  showInviteLink = true,
  duration,
  openExtendModal,
  onExtend,
  handleOpenExtendModal,
  handleCloseExtendModal,
  canExtend = true,
}) => {
  const nodeRef = React.useRef(null);
  const [isLoading, setIsloading] = React.useState(true);
  const [jitsiApi, setJitsiApi] = React.useState(null);
  const endTimerId = React.useRef();
  const extendTimeoutId = React.useRef();

  const { curHeight, curWidth, handleResize, resetSize } = useResize();

  function handleEnd() {
    console.log("ready-to-close");
    resetSize();
    onEndCall();
  }

  // Handle event
  React.useEffect(() => {
    // Custom event listeners to the Jitsi Meet External API
    if (jitsiApi) {
      console.log("run event");
      jitsiApi.addListener("videoAvailabilityChanged", () => {
        console.log("Video available");
        setIsloading(false);
      });

      return () => {
        clearTimeout(endTimerId.current);
        jitsiApi.removeListener("videoAvailabilityChanged", () => {});
        handleEnd();
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jitsiApi]);

  // Handle end timer
  React.useEffect(() => {
    if (jitsiApi && duration) {
      clearTimeout(endTimerId.current);
      endTimerId.current = setTimeout(() => {
        console.log("end by timer");
        jitsiApi.executeCommand("endConference");
        handleEnd();
      }, duration);

      return () => {
        clearTimeout(endTimerId.current);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jitsiApi, duration]);

  // Handle open extend meeting modal
  React.useEffect(() => {
    if (duration !== 0 && canExtend) {
      const extendTimeout = duration - endConferenceReminderTime;
      if (extendTimeout <= 0) {
        handleOpenExtendModal();
      } else {
        console.log("Extend timeout set");
        clearTimeout(extendTimeoutId.current);
        extendTimeoutId.current = setTimeout(() => {
          handleOpenExtendModal();
        }, extendTimeout);
        return () => {
          clearTimeout(extendTimeoutId.current);
        };
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [duration]);

  return (
    <>
      <Draggable nodeRef={nodeRef}>
        <div
          ref={nodeRef}
          style={{
            position: "absolute",
            left: 0,
            top: "50%",
            padding: "10px",
            border: "1px solid grey",
            cursor: "pointer",
          }}
        >
          {/* Meeting frame */}
          <Box
            sx={{
              height: curHeight,
              width: curWidth,
            }}
          >
            {isLoading ? (
              <Skeleton
                sx={{ bgcolor: "grey.400" }}
                variant="rectangular"
                width="100%"
                height="100%"
                animation="wave"
              />
            ) : null}
            <JitsiMeeting
              domain={domain}
              jwt={jwt}
              roomName={roomName}
              configOverwrite={config}
              interfaceConfigOverwrite={interfaceConfig}
              getIFrameRef={(iframeRef) => {
                console.log("iframeRef", iframeRef);
                iframeRef.style.height = "100%";
                iframeRef.style.width = "100%";
              }}
              onReadyToClose={handleEnd}
              onApiReady={(externalApi) => setJitsiApi(externalApi)}
            />
          </Box>
          {/* Button group */}
          <Box
            sx={{ display: "flex", gap: 1, mt: 1, justifyContent: "center" }}
          >
            <BasicButton onClick={handleResize}>Resize</BasicButton>
            {showInviteLink ? (
              <CopyToClipboard
                text={`${PAGE_PATH.BASE}${PAGE_PATH.ROOM}?id=${roomName}`}
              >
                <BasicButton color={"success"}>Copy invite link</BasicButton>
              </CopyToClipboard>
            ) : null}
          </Box>
        </div>
      </Draggable>
      <div className="meeting-modal">
        {canExtend ? (
          <ConfirmPopup
            isOpen={openExtendModal}
            handleReject={handleCloseExtendModal}
            handleConfirm={onExtend}
          >
            <Stack sx={{ textAlign: "center" }}>
              <Typography>
                Your meeting will end in{" "}
                <Box component="span" sx={{ fontWeight: "bold" }}>
                  5 minutes
                </Box>
              </Typography>
              <Typography>Do you want to extend it ?</Typography>
            </Stack>
          </ConfirmPopup>
        ) : null}
      </div>
    </>
  );
};

export default MeetingFrame;
