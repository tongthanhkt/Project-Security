/* eslint-disable no-unused-vars */
import React, { useRef, useState } from "react";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { HocuspocusProvider } from "@hocuspocus/provider";
// import * as monaco from "monaco-editor";
import { MonacoBinding } from "y-monaco";
import MonacoEditor from "@monaco-editor/react";
import "./Editor.css";
import { WS_API } from "../common/api";
import { useSelector } from "react-redux";

const getDomainWs = () => {
  let wsDomain = process.env.REACT_APP_BACKEND_DOMAIN;
  if (window.location.hostname.includes("localhost")) {
    wsDomain = process.env.REACT_APP_BACKEND_DOMAIN_DEV;
  } else if (window.location.hostname.includes("onrender")) {
    wsDomain = process.env.REACT_APP_ONRENDER_DOMAIN;
  }
  if (wsDomain.includes("https")) {
    return wsDomain.replace("https", "wss");
  }
  return wsDomain.replace("http", "ws");
};

export const usercolors = [
  "#30bced",
  "#6eeb83",
  "#ffbc42",
  "#ecd444",
  "#ee6352",
  "#9ac2c9",
  "#8acb88",
  "#1be7ff",
];
const myColor = usercolors[Math.floor(Math.random() * usercolors.length)];

const Editor = () => {
  const editorRef = useRef(null);
  const [codeRoomName, setCodeRoomName] = useState(null);
  const { user } = useSelector((state) => state?.auth);

  function handleEditorDidMount(editor, monaco) {
    editorRef.current = editor;
    console.log(editor.getValue());
    console.log(editor);
    console.log(monaco);
    console.log(editor.getModel());
  }

  const handleConnect = () => {
    const doc = new Y.Doc();
    const type = doc.getText(codeRoomName);

    const wsProvider = new HocuspocusProvider({
      url: `${getDomainWs()}${WS_API.COLAB_CODE}`,
      name: codeRoomName,
      document: doc,
    });

    wsProvider.on("onMessage", () => {
      console.log("coming");
    });

    wsProvider.on("close", ({ event }) => {
      if (event.code === 4001) {
        console.log({ event }, "received unauthorized error from server");
        wsProvider.shouldConnect = false;
      }
    });

    wsProvider.on("status", (event) => {
      // console.log(event.status); // logs "connected" or "disconnected"
    });

    wsProvider.setAwarenessField("user", {
      name: user?.data?.name,
      color: myColor,
    });

    wsProvider.on("awarenessChange", ({ states }) => {
      console.log(states);
    });

    const monacoBinding = new MonacoBinding(
      type,
      editorRef.current.getModel(),
      new Set([editorRef.current]),
      wsProvider.awareness
    );

    wsProvider.on(
      "awarenessUpdate",
      ({ added, updated, removed }, transactions) => {
        // console.log(added, "\n", updated, "\n", removed, "\n", transactions);
        // const header = document.getElementById("headerPage");
        if (!wsProvider.shouldConnect) {
          return;
        }
        for (let [key, value] of wsProvider.awareness.getStates()) {
          // console.log(key + " = " + value.user.name);
          console.log("keys =", wsProvider.awareness.getStates());
          const node = document.getElementById(`collabCursor${key}`);
          // console.log("node", node);
          // console.log("redux name: ", user?.data?.name);
          // Not allow 1 user have n devices (n > 1)
          // if (value.user.name === user?.data?.name) continue;
          if (node !== null) continue;
          // console.log("Vượt if");
          const userKey = key;
          const userColor = value.user.color;
          const userName = value.user.name;
          const styleCollab = `<style type="text/css" id="collabCursor${userKey}">
  .yRemoteSelection {
      background-color: ${userColor}
  }
  .yRemoteSelectionHead {
      position: absolute;
      border-left: ${userColor} solid 2px;
      border-top: ${userColor} solid 2px;
      border-bottom: ${userColor} solid 2px;
      height: 100%;
      box-sizing: border-box;
  }
  .yRemoteSelectionHead::after {
      position: absolute;
      content: ' ';
      border: 3px solid ${userColor};
      border-radius: 4px;
      left: -4px;
      top: -5px;
  }
  .yRemoteSelectionHead:hover::after{
    content: '${userName}';
    color: white;
    top: -18px;
    left: 0px;
    background-color: ${userColor};
    border-radius: 2px;
    height: 22px;
  }

</style>`;
          // const nodeStyleCollab = new DOMParser().parseFromString(
          //   styleCollab,
          //   "text/html"
          // ).head.firstChild;
          document.head.insertAdjacentHTML("beforeend", styleCollab);
        }
        // console.log(param1);
        // console.log(param2);
      }
    );

    // console.log(monacoBinding);
  };
  return (
    <>
      <input
        type="text"
        name="name"
        onChange={(event) => {
          setCodeRoomName(event.target.value);
        }}
      />
      <button
        onClick={() => {
          handleConnect();
        }}
      >
        Connect
      </button>
      <MonacoEditor
        height="90vh"
        defaultLanguage="javascript"
        defaultValue=""
        onMount={handleEditorDidMount}
      />
    </>
  );
};

export default Editor;
