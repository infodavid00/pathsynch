import process from "node:process";
import dotenv from "dotenv";

dotenv.config({ path: "../.env" });

export const _appname = "pathsynch";
export const _usertypeA = "merchant";
export const _usertypeB = "customer";
export const _issuertypeA = "google";
export const _issuertypeB = "apple";
export const _weburl = "https://pathsynch.com";
export const _apklink_apple =
  "https://applestore.com/pathsynch/9uw0hdw0jev0wjwsw.com";
export const _apklink_google =
  "https://playstore.com/pathsynch/9uw0hdw0jev0wjwsw.com";
export const _signupwebBaseURL =
  "https://pathsynch.com/auth/signup/checkpoint/";
export const _fbwebBaseURL = "https://pathsynch.com/auth/fb/checkpoint/";
