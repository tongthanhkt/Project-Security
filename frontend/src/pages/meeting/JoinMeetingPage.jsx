import React from "react";
import Editor from "../../components/Editor";
import useMeetingJoiner from "./../../hooks/meeting/useMeetingJoiner";
import MeetingJoiner from "./../../components/meeting/MeetingJoiner";

const JoinMeetingPage = () => {
  const { isJoined, isValid, jwt, roomName } = useMeetingJoiner();

  return !isJoined ? (
    !isValid ? (
      "Missing room id"
    ) : (
      "loading screen"
    )
  ) : (
    <div style={{ padding: "20px" }}>
      <h1>Join Meeting test</h1>
      {/* Meet jitsi */}
      <MeetingJoiner jwt={jwt} roomName={roomName} />
      {/* Editor */}
      <Editor />
    </div>
  );
};

export default JoinMeetingPage;
