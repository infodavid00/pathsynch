import express from "express";
import error from "../.config/etc/err.js";
import auth from "./auth.js";
import campaign from "./campaign.js";
import customer from "./customer.js";
import user from "./user.js";
import merchant from "./merchant.js";
import admin from "./admin.js";
import {
  _pipe_admin,
  _pipe_auth,
  _pipe_customer,
  _pipe_merchant,
  _pipe_user,
} from "../metrics/metrics_expose.js";
import etc from "./etc.js";
import config from "./config.js";

const router = express();

router.use("/auth", _pipe_auth, auth);
router.use("/etc", etc);
router.use("/campaign", campaign);
router.use("/cstm", _pipe_customer, customer);
router.use("/user", _pipe_user, user);
router.use("/mcnt", _pipe_merchant, merchant);
router.use("/admin", _pipe_admin, admin);
router.use("/config", config);

router.use(error);

export default router;
