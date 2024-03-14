import express from "express";
import { ATforM } from "../middlewares/signatures/signatures.js";
import {
  getbuisnesstype,
  updatebuisnesstype,
} from "../controllers/merchant/buisnesstype/buisnesstyp.js";
import {
  duplicateCampaign,
  editcampaign,
  movetotrashMerchant,
  reactivateCampaign,
  restorefromtrashMerchant,
  updatedetails,
  updatemedia_website,
  updatemenu_logo,
  verifyOnboarding,
} from "../controllers/merchant/merchantset/updates.js";
import {
  getTrash,
  getallmerchants,
  getcampaignsMerchant,
  getdetails,
  getmedia_website,
  getmenu_logo,
  getmerchantinfo,
  getonemerchant,
  getpromotionsMerchant,
} from "../controllers/merchant/merchantget/merchantget.js";
import { getmerchantcampaign } from "../controllers/users/userget/userget.js";

const merchant = express.Router();

merchant.put("/buisnesstype/:accesstoken", ATforM, updatebuisnesstype);
/* update buisnesstype */
merchant.get("/buisnesstype/:accesstoken", ATforM, getbuisnesstype);
/* get buisnesstype */

merchant.put("/details/:accesstoken", ATforM, updatedetails);
/* update details */
merchant.put("/menuORlogo/:accesstoken", ATforM, updatemenu_logo);
/* update menu or logo */
merchant.put("/socialORweb/:accesstoken", ATforM, updatemedia_website);
/* update social or web */

merchant.get("/details/:accesstoken", ATforM, getdetails);
/* get details */
merchant.get("/menuORlogo/:accesstoken", ATforM, getmenu_logo);
/* get menu or logo */
merchant.get("/socialORweb/:accesstoken", ATforM, getmedia_website);
/* get social or web */

merchant.post("/userinfo/:accesstoken", ATforM, getmerchantinfo);
/* get merchant info */

merchant.post("/gam/", getallmerchants);
/* get all merchants */
merchant.post("/gom/:merchantid", getonemerchant);
/* get one merchants */
merchant.post("/gmc/:merchantid", getmerchantcampaign);
/* get merchant campaigns */

merchant.get("/M/campaigns/:accesstoken/:query", ATforM, getcampaignsMerchant);
/* get campaigns [merchant] */
merchant.get(
  "/M/promotions/:accesstoken/:query",
  ATforM,
  getpromotionsMerchant
);
/* get promotions [merchant] */

merchant.post("/replicate/:accesstoken/:campaignId", ATforM, duplicateCampaign);
/* duplicate campaigns [merchant] */
merchant.post("/campaignE/:accesstoken/:campaignId", ATforM, editcampaign);
/* edit campaign [merchant] */

merchant.post(
  "/trash/mv/:accesstoken/:campaignId",
  ATforM,
  movetotrashMerchant
);
/* move to trash [merchant] */
merchant.post(
  "/trash/rt/:accesstoken/:campaignId",
  ATforM,
  restorefromtrashMerchant
);
/* restore from trash [merchant] */
merchant.get("/trash/gt/:accesstoken", ATforM, getTrash);
/* get from trash [merchant] */

merchant.post("/activate/:accesstoken/:campaignId", ATforM, reactivateCampaign);
/* reactive campaign [merchant] */

merchant.get("/verify/onboarding/:accesstoken", ATforM, verifyOnboarding);
/* verify onboarding */

export default merchant;
