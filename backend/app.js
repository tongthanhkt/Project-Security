/* eslint-disable import/extensions */
/* eslint-disable no-console */
import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import fs from "fs";
import expressWebsockets from "express-ws";
import { createServer } from "http";
import https from "https";
// import { Server } from "socket.io";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { collectDefaultMetrics } from "prom-client";
import router from "./route/router.route.js";
import env from "./utils/env.js";
import userModel from "./model/user.model.js";
import avatarModel from "./model/avatar.model.js";

const dirNamePath = dirname(fileURLToPath(import.meta.url));

const app = express();
const httpServer = createServer(app);
const expressWs = expressWebsockets(app, httpServer);
app.use(morgan("dev"));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(`${dirNamePath}/build`));

let port = process.env.PORT || 3001;
let httpsServer = null;

console.log(
  "IS_ONRENDER =",
  env.IS_ONRENDER,
  "!IS_ONRENDER =",
  !env.IS_ONRENDER
);
if (!env.IS_DEV) {
  collectDefaultMetrics();
}

if (!env.IS_DEV && !env.IS_ONRENDER) {
  port = 80;
  httpsServer = https.createServer(
    {
      key: fs.readFileSync("cert/host.key", "utf8"),
      cert: fs.readFileSync("cert/host.cert", "utf8"),
    },
    app
  );
}

const ws = null;
// const ws = new Server(httpServer, {
//   cors: {
//     origin: env.DOMAIN_DEV,
//     methods: ["GET", "POST"],
//     transports: ["websocket", "polling"],
//     credentials: true,
//   },
// });
httpServer.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

if (httpsServer) {
  httpsServer.listen(443, () => {
    console.log("Running on port 443");
  });
  expressWebsockets(app, httpsServer);
}

router(httpServer, httpsServer, app, ws, dirNamePath);
