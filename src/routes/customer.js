import express from "express";
import { ATforC } from "../middlewares/signatures/signatures.js";
import {
  getpersonalization,
  updatepersonalizion,
} from "../controllers/customer/personalization/personalization.js";
import {
  getcustomerinfo,
  getpathpoints,
  getreferalLink,
} from "../controllers/customer/customerget/customerget.js";
import {
  editprofile,
  locationAccess,
  topupPathPointsAfterFollowing_Social,
} from "../controllers/customer/customerset/customerset.js";

const customer = express.Router();

customer.put("/personalization/:accesstoken", ATforC, updatepersonalizion);
/* update personalization */
customer.get("/personalization/:accesstoken", ATforC, getpersonalization);
/* get personalization */

customer.get("/dpath/:accesstoken", ATforC, getpathpoints);
/* get $path points */
customer.get("/referal/:accesstoken", ATforC, getreferalLink);
/* get referal link */

customer.post("/userinfo/:accesstoken", ATforC, getcustomerinfo);
/* get customer info */

customer.put("/profileupdate/:accesstoken", ATforC, editprofile);
/* edit profile */

customer.put("/locationAccess/:accesstoken", ATforC, locationAccess);
/* location access */

customer.put(
  "/topupAfterFollowingps/:accesstoken/:type",
  ATforC,
  topupPathPointsAfterFollowing_Social
);
/* top up points after following ps */

export default customer;
