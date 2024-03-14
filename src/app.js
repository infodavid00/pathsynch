import express from "express";
import "dotenv/config";
import cors from "cors";
import cookieParser from "cookie-parser";
import router from "./routes/router.js";
import { _port } from "./.config/var/connection.js";
import { _pipe_entry, _metrics_ } from "./metrics/metrics_expose.js";
import { WEB_HOOK_PAYMENT, WEB_HOOK_ONBOARDING } from "./lib/webhook.js";

const app = express();
const port = _port || 10000;
const msg = console.log(`server started on port ${port}`);

app.use(cors());
app.use(cookieParser());

app.use("/v2", express.json(), _pipe_entry, router);
app.post(
  "/webhook/payment",
  express.raw({ type: "application/json" }),
  WEB_HOOK_PAYMENT
);
app.post(
  "/webhook/onboarding",
  express.raw({ type: "application/json" }),
  WEB_HOOK_ONBOARDING
);

app.listen(port, msg);
