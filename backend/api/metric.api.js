import express from "express";
import { register } from "prom-client";

const router = express.Router();

const LOCALHOST_IP = "127.0.0.1";

router.get("/metrics", async (req, res, next) => {
  try {
    console.log(req.socket.remoteAddress);
    if (req.socket.remoteAddress.toString().includes(LOCALHOST_IP)) {
      res.set("Content-Type", register.contentType);
      res.end(await register.metrics());
      return;
    }
    next("route");
  } catch (err) {
    res.status(500).end(err);
  }
});

export default router;
