import express from "express";
import { getpromotions } from "../controllers/admin/promotions/promotions.js";
import { createCouponMW } from "../middlewares/admin/coupon.js";
import { ATforAdmin } from "../middlewares/signatures/signatures.js";
import {
  createCoupon,
  tooglecouponstatus,
} from "../controllers/admin/coupon/set.js";
import {
  getcampaignsusingcoupon,
  getcoupon,
  getcoupondetails,
  getcoupons,
} from "../controllers/admin/coupon/get.js";
import {
  getTransactionsDetails,
  getTransations,
} from "../controllers/admin/transactions/transactions.js";
import {
  getsupport,
  responseToSupport,
} from "../controllers/admin/support/support.js";
import {
  getcampaignDetailsAdmin,
  getcampaignsAdmin,
} from "../controllers/admin/campaign/campaign.js";
import {
  getMerchantsCampaignAdmin,
  getmerchantsData,
} from "../controllers/admin/buisness/buisness.js";

const admin = express.Router();

admin.get("/promotions/:accesstoken/:date", ATforAdmin, getpromotions);
/* get promotions */

admin.post("/coupon/:accesstoken", ATforAdmin, createCouponMW, createCoupon);
/* create coupon */
admin.put("/ctoogle/:code/:accesstoken", ATforAdmin, tooglecouponstatus);
/* toogle coupon status [on / off] */

admin.get("/coupon/:accesstoken", ATforAdmin, getcoupons);
/* get coupons */
admin.get("/coupon/:code/:accesstoken", ATforAdmin, getcoupon);
/* get coupon */
admin.get(
  "/cucoupon/:coupon/:accesstoken",
  ATforAdmin,
  getcampaignsusingcoupon
);
/* get campaigns using coupon */
admin.get("/cdetails/:date/:accesstoken", ATforAdmin, getcoupondetails);
/* get coupon metrics details */

admin.get("/transactions/:date/:accesstoken", ATforAdmin, getTransations);
/* get transactions */
admin.get(
  "/transactions/details/:ddmmyy/:accesstoken",
  ATforAdmin,
  getTransactionsDetails
);
/* get transactions details */

admin.get("/support/:accesstoken", ATforAdmin, getsupport);
/* get support */

admin.get("/campaigns/:accesstoken", ATforAdmin, getcampaignsAdmin);
/* get campaings */
admin.get(
  "/campaigns/:ddmmyy/:accesstoken",
  ATforAdmin,
  getcampaignDetailsAdmin
);
/* get campaing details */

admin.get(
  "/mcampaignsdetails/:ddmmyy/:pubId/:accesstoken",
  ATforAdmin,
  getmerchantsData
);
/* get merchant campaign details */
admin.get(
  "/mcampaigns/:pubId/:accesstoken",
  ATforAdmin,
  getMerchantsCampaignAdmin
);
/* get merchant campaigns */

admin.post("/support/respond/:accesstoken", ATforAdmin, responseToSupport);
/* respond to support message */

export default admin;
