import * as Y from "yjs";
import { WebSocketServer } from "ws";
import { createYjsServer } from "yjs-server";
import { Server } from "@hocuspocus/server";
import { Redis } from "@hocuspocus/extension-redis";
import authenModel from "../../model/authen.model.js";
import { WS_RESP } from "../../utils/respCode.js";
import meetingModel from "../../model/meeting.model.js";
import env from "../../utils/env.js";

const server = Server.configure({
  extensions: [
    new Redis({
      host: env.REDIS_PUB_SUB_HOST,
      port: env.REDIS_PUB_SUB_PORT,
    }),
  ],
});

function toCookieObj(request) {
  var cookies = {};
  request.headers &&
    request.headers.cookie.split(";").forEach(function (cookie) {
      var parts = cookie.match(/(.*?)=(.*)$/);
      cookies[parts[1].trim()] = (parts[2] || "").trim();
    });
  return cookies;
}

async function canJoinRoom(room, accessToken) {
  const uid = authenModel.getUidFromToken(accessToken);
  if (!uid) {
    return false;
  }

  const meeting = await meetingModel.findById(room);
  if (
    !meeting ||
    (meeting.members !== null && meeting.members.indexOf(ownerId) === -1)
  ) {
    return false;
  }
  return true;
}

async function isAuthorized(socket, request, codeColabPath) {
  const room = request.url.replace(codeColabPath + "/", "");
  console.log(`room = ${room}`);
  const cookies = toCookieObj(request);
  if (
    !cookies.access_tok ||
    authenModel.verifyAccessToken(cookies.access_tok).code ===
      authenModel.INVALID_TOKEN
  ) {
    console.log("colabCode.ws.js: Invalid access token");
    throw new Error("Invalid access token");
  }

  if (false) {
    if (!(await canJoinRoom(room, cookies.access_tok))) {
      console.log("colabCode.ws.js: No room found");
      throw new Error("No room found");
    }
  }

  return true;
}

export function initColabCodeWss(codeColabPath, httpServer, httpsServer) {
  const wssCode = new WebSocketServer({ noServer: true });
  const yjss = createYjsServer({
    createDoc: () => new Y.Doc(),
  });

  httpServer.on("upgrade", (request, socket, head) => {
    wssCode.handleUpgrade(request, socket, head, (websocket) => {
      wssCode.emit("connection", websocket, request);
    });
  });

  if (httpsServer) {
    httpsServer.on("upgrade", (request, socket, head) => {
      wssCode.handleUpgrade(request, socket, head, (websocket) => {
        wssCode.emit("connection", websocket, request);
      });
    });
  }

  wssCode.on("connection", async (socket, request) => {
    const whenAuthorized = isAuthorized(socket, request, codeColabPath).catch(
      () => {
        // manually close the socket using a custom error code
        socket.close(WS_RESP.STOP_CONNECT);
        console.log(
          "colabCode.ws.js: closed socket because of invalid credentials"
        );
        // signal that the YjsServer should drop the connection
        return false;
      }
    );
    yjss.handleConnection(socket, request, whenAuthorized);
  });
}
