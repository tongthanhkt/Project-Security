const domain = process.env.REACT_APP_JITSI_DOMAIN;
const config = {
  startWithAudioMuted: true,
  disableModeratorIndicator: true,
  startScreenSharing: true,
  enableEmailInStats: false,
  // toolbarButtons: [
  //   "microphone",
  //   "camera",
  //   "fullscreen",
  //   "hangup",
  //   "desktop",
  //   "invite",
  //   "chat",
  //   "mute-everyone",
  // ],
};
const interfaceConfig = {
  DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
};

// Width and height
const defHeight = "70vh";
const defWidth = "60vw";
const resizedHeight = "20vh";
const resizedWidth = "20vw";

// Time
const endConferenceReminderTime = 5 * 60 * 1000; // n minutes before end to show extend modal
const endConferenceExtendTime = 5 * 60 * 1000; // extend for n minutes

export {
  domain,
  config,
  interfaceConfig,
  defHeight,
  defWidth,
  resizedHeight,
  resizedWidth,
  endConferenceReminderTime,
  endConferenceExtendTime,
};
