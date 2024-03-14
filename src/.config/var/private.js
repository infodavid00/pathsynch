import process from "node:process";
import dotenv from "dotenv";

dotenv.config({ path: "../.env" });

export const _accesstokensecrete = process.env.ACCESSTOKENSECRETE;
export const _refreshtokensecrete = process.env.REFRESHTOKENSECRETE;
export const _adminpassword = process.env.ADMINPASSWORD;
