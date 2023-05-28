import { parse } from "cookie";
import { Server } from "@hocuspocus/server";
import { Redis } from "@hocuspocus/extension-redis";
import env from "../../utils/env.js";
import authenMw from "../../middleware/authen.mw.js";
import authenModel from "../../model/authen.model.js";

const server = Server.configure({
  extensions: [
    new Redis({
      host: env.REDIS_PUB_SUB_HOST,
      port: env.REDIS_PUB_SUB_PORT,
    }),
  ],
});

export function initColabCodeWssV2(codeColabPath, app) {
  app.ws(
    `${codeColabPath}/:meetingId`,
    authenMw.wsStopWhenNotLogon,
    // Off authen for testing purposes
    // authenMw.wsCanJoinRoom,
    (websocket, request) => {
      const context = {
        user: {
          id: authenModel.getUidFromReqWs(request),
        },
      };

      server.handleConnection(
        websocket,
        request,
        request.params.meetingId,
        context
      );
    }
  );
}
