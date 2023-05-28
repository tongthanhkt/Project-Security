import React from "react";
import Editor from "../../components/Editor";
import MeetingOwner from "../../components/meeting/MeetingOwner";

const MeetingPage = () => {
  return (
    <div className="pt-minus-nav wrapper">
      <h1>Meeting test</h1>
      {/* Meet jitsi */}
      <MeetingOwner />
      {/* Editor */}
      <Editor />
    </div>
  );
};

export default MeetingPage;
