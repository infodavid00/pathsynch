import express from "express";
import decodeJwt from "../controllers/config/decodeJwt.js";

const config = express.Router();

config.get("/jwt/decode/:token", decodeJwt);
/* decode jwt */

export default config;
