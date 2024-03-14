import express from "express";
import createcampaignMW from "../middlewares/campaigns/create.js";
import { createcampaign } from "../controllers/campaigns/create.js";
import { ATforC, ATforM } from "../middlewares/signatures/signatures.js";
import { purchasecampaign } from "../controllers/campaigns/purchase.js";
import { promotecampaign } from "../controllers/campaigns/promote.js";
import purchase_state from "../controllers/hooks/purchase_state.js";

const campaign = express.Router();

campaign.post("/new/:accesstoken", createcampaignMW, ATforM, createcampaign);
/* create a campaign */
campaign.post(
  "/promote/:accesstoken/:promotionId/:campaignId",
  ATforM,
  promotecampaign
);
/* promote a campaign */

campaign.post("/purchase/:accesstoken/:id", ATforC, purchasecampaign);
/* purchase a campaign */

campaign.get("/hooks/purchase/state/:transactionId", purchase_state);
/* purchase state hook */

export default campaign;
