import express from "express";
import { ATforGeneral } from "../middlewares/signatures/signatures.js";
import {
  addfavourite,
  addfavouriteCampaigns,
  getfavourites,
  getfavouritescampaigns,
  removefavourite,
  removefavouritecampaigns,
} from "../controllers/users/favourites/favourites.js";
import { getfavouritesMW } from "../middlewares/users/favourites.js";
import {
  followuser,
  getfr_fg,
  unfollowuser,
} from "../controllers/users/follows/follows.js";
import { gfr_fgMW } from "../middlewares/users/follow.js";
import {
  getusertype,
  getsinglecampaign,
  getallcampaigns,
} from "../controllers/users/userget/userget.js";
import { deleteUser } from "../controllers/users/delete/deleteUser.js";

const user = express.Router();

user.put("/favourite/push/:accesstoken/:userid", ATforGeneral, addfavourite);
/* add favourite */
user.delete(
  "/favourite/pull/:accesstoken/:userid",
  ATforGeneral,
  removefavourite
);
/* remove favourites */
user.get(
  "/favourite/get/:accesstoken",
  getfavouritesMW,
  ATforGeneral,
  getfavourites
);
/* get favourite */

user.put(
  "/favourite/campaign/push/:accesstoken/:campaignId",
  ATforGeneral,
  addfavouriteCampaigns
);
/* add favourite campaign */
user.delete(
  "/favourite/campaign/pull/:accesstoken/:campaignId",
  ATforGeneral,
  removefavouritecampaigns
);
/* remove favourites campaign */
user.get(
  "/favourite/campaign/get/:accesstoken",
  getfavouritesMW,
  ATforGeneral,
  getfavouritescampaigns
);
/* get favourite campaign */

user.put("/follow/push/:accesstoken/:userid", ATforGeneral, followuser);
/* follow user */
user.delete("/follow/pull/:accesstoken/:userid", ATforGeneral, unfollowuser);
/* unfollow user */
user.get("/follow/get/:accesstoken/:type", gfr_fgMW, ATforGeneral, getfr_fg);
/* get following or followers */

user.get("/usertype/:accesstoken", ATforGeneral, getusertype);
/* get user type */

user.get("/one/campaign/:campaignid", getsinglecampaign);
/* get single campaign */

user.post("/entry/campaigns", getallcampaigns);
/* get all campaigns */

user.post("/deleteAllUserEntries/:accesstoken", ATforGeneral, deleteUser);
/* delete User */

export default user;
