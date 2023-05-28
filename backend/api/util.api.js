import express from "express";
import authenMw from "../middleware/authen.mw.js";
import UserSchema from "../schemas/userSchema.js";
import { ROLE } from "../utils/database.js";
import respCode from "../utils/respCode.js";
const router = express.Router();
router.get("/ta/", authenMw.stopWhenNotLogon, async (req, res) => {
  const search = req.query.search;
  const taList = await UserSchema.find({
    role: ROLE.TA,
    email: search,
  });
  const taInfoList = taList.map((ta) => {
    return {
      _id: ta._id,
      name: ta.name,
      email: ta.email,
      status: ta.status,
      addr: ta.addr,
    };
  });
  return res.json({
    status: respCode.SUCCESS,
    data: {
        taList: taInfoList
    }
  })
});
export default router;
