import { createContext, useContext, useEffect, useRef, useState } from "react";

const PlayerContext = createContext();
function PlayerProvider(props) {
  const playerRef = useRef(null);
  const value = { playerRef };
  return (
    <PlayerContext.Provider value={value} {...props}></PlayerContext.Provider>
  );
}
function usePlayer() {
  const context = useContext(PlayerContext);
  if (typeof context === "undefined")
    throw new Error("usePlayer must be used within PlayerProvider");
  return context;
}
export { PlayerProvider, usePlayer };
