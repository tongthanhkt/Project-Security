import React, { useImperativeHandle, useRef, useState } from "react";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { MonacoBinding } from "y-monaco";
import MonacoEditor from "@monaco-editor/react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { WS_API } from "../../../common/api";

const Container = styled.div`
  display: flex;
  flex-direction: column;

  height: ${(props) => props.height};
  /* max-height: 90%; */

  .yRemoteSelection {
    background-color: ${(props) => props.userColor};
  }
  .yRemoteSelectionHead {
    position: absolute;
    height: 100%;
    box-sizing: border-box;
    border-left: ${(props) => props.userColor} solid 2px;
    border-top: ${(props) => props.userColor} solid 2px;
    border-bottom: ${(props) => props.userColor} solid 2px;
  }
  .yRemoteSelectionHead::after {
    position: absolute;
    content: " ";
    border: 3px solid ${(props) => props.userColor};
    border-radius: 4px;
    left: -4px;
    top: -5px;
  }
  .yRemoteSelectionHead:hover::after {
    content: ${(props) => `'${props.userName}'`};
    color: white;
    top: -18px;
    left: 0px;
    background-color: ${(props) => props.userColor};
    border-radius: 2px;
    height: 22px;
  }
`;

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

const MonacoEditorComponent = (
  {
    defaultValue,
    defaultLanguage,
    theme,
    height,
    LANG_ID_TO_MONACO,
    handleChange = (values) => {},
    readOnly = false,
  },
  ref
) => {
  const editorRef = useRef(null);
  useImperativeHandle(ref, () => ({
    getValue() {
      return editorRef.current.getValue();
    },
  }));
  // eslint-disable-next-line no-unused-vars
  const [codeRoomName, setCodeRoomName] = useState(null);
  const { user } = useSelector((state) => state?.auth);
  const [colabStyle, setColabStyle] = React.useState({});

  function handleEditorDidMount(editor, monaco) {
    editorRef.current = editor;
    // console.log(editor.getValue());
    console.log(editor);
    console.log(monaco);
    // console.log(editor.getModel());
  }

  // eslint-disable-next-line no-unused-vars
  const handleConnect = () => {
    const doc = new Y.Doc();
    const type = doc.getText(codeRoomName);

    console.log(doc);
    const wsProvider = new WebsocketProvider(
      `${getDomainWs()}${WS_API.COLAB_CODE}`,
      codeRoomName,
      doc
    );

    wsProvider.on("connection-close", (event) => {
      if (event.code === 4001) {
        console.log({ event }, "received unauthorized error from server");
        wsProvider.shouldConnect = false;
      }
    });

    wsProvider.on("status", (event) => {
      console.log(event.status); // logs "connected" or "disconnected"
    });

    wsProvider.awareness.setLocalStateField("user", {
      name: user?.data?.name,
      color: myColor,
    });

    wsProvider.awareness.on("change", () => {
      console.log(wsProvider.awareness.getStates());
    });

    // eslint-disable-next-line no-unused-vars
    const monacoBinding = new MonacoBinding(
      type,
      editorRef.current.getModel(),
      new Set([editorRef.current]),
      wsProvider.awareness
    );

    wsProvider.awareness.on(
      "update",
      ({ added, updated, removed }, transactions) => {
        // console.log(added, "\n", updated, "\n", removed, "\n", transactions);
        // const header = document.getElementById("headerPage");
        for (let [key, value] of wsProvider.awareness.getStates()) {
          // console.log(key + " = " + value.user.name);
          const node = document.getElementById(`collabCursor${key}`);
          // console.log("node", node);
          // console.log("redux name: ", user?.data?.name);
          if (value.user.name === user?.data?.name) continue;
          if (node !== null) continue;
          // console.log("Vượt if");
          const userKey = key;
          const userColor = value.user.color;
          const userName = value.user.name;

          setColabStyle({ userColor, userName, userKey });
        }
      }
    );

    // console.log(monacoBinding);
  };

  return (
    <>
      {/* Editor */}
      <Container {...colabStyle} height={height}>
        {/* <div className="multi-user">
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
      </div> */}

        {/* Editor */}
        <MonacoEditor
          language={LANG_ID_TO_MONACO[defaultLanguage]}
          onMount={handleEditorDidMount}
          theme={theme}
          value={defaultValue}
          defaultValue={defaultValue}
          defaultLanguage={LANG_ID_TO_MONACO[defaultLanguage]}
          onChange={handleChange}
          options={{
            scrollbar: {
              alwaysConsumeMouseWheel: false,
            },
            minimap: {
              enabled: false,
            },
            automaticLayout: true,
            readOnly: readOnly,
          }}
        />
      </Container>
    </>
  );
};

export default React.forwardRef(MonacoEditorComponent);
