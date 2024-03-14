/*  
 CAMPAIGNS [FLOW]
 (p1) when the user submits the campaign, it first checkes if the user has created
 a campaign before or not, if so it continue to process(p2)
 else checks if the merchant has completedOnboarding if so continue requets (p4)
 else terminates process

 (p2) it collect the id of the campaign and insert to the authors documents (users
 collection), before moving to process(p3)

 (p3) it inserts the campaign to the campaign collection and end the request

 (p4) update social, details, website, menu, logo.
*/

import Response from "../../utils/response.js";
import Campaign from "../../schema/campaign/create.js";
import {
  isFirstcampaign,
  queryCheck_ifuserhascompletedonboarding,
} from "../../models/campaigns/get.js";
import {
  queryCampaign,
  queryUserSide,
  updateMerchantsinceFirstCampaign,
} from "../../models/campaigns/set.js";
// import Bank from "../../schema/campaign/bank.js";

const response = (message) => new Response(message);

export async function createcampaign(rq, rs, pass) {
  const { id } = await rq.body;
  try {
    const schema = new Campaign(await rq.body).create();
    const isfirstcampaign = await isFirstcampaign(id);
    /* (p1) check if user has created a campaign before a campaign or not */

    if (!isfirstcampaign) {
      /* continue to process (p2) since this is not the first campaign */
      let campaignId = schema._id;
      await queryUserSide(id, campaignId);
      /* complete process (p3) and end request */
      await queryCampaign(schema);
      rs.status(200).json(response("ok").success({ pubId: schema.pubId }));
    } else {
      // check if user has completed onboarding
      const userhascompletedonboard =
        await queryCheck_ifuserhascompletedonboarding(id);

      if (userhascompletedonboard !== null) {
        if (userhascompletedonboard.isCompletedOnboarding === true) {
          // merchant has completed onboarding
          /* insert data to databse, the two must be successfull before proceeding */
          let campaignId = schema._id;
          let body = await rq.body;
          await updateMerchantsinceFirstCampaign(
            body.id,
            campaignId,
            body.social || {},
            body.details || null,
            body.website || null,
            body.menu || null,
            body.logo ?? null
          ); // update merchant side (p4)

          // we do not need to add (p2) as all its functionality are built in (p4)

          /* complete process (p3) and end request */
          await queryCampaign(schema);

          rs.status(200).json(response("ok").success({ pubId: schema.pubId }));
        } else {
          /* merchant hasent completed onboarding. */
          let message =
            "ERR : CAMPAIGN TAGGED AS FIRST CAMPAIGN : merchant hasen't completed onboarding.";
          rs.status(403).json(response(message).warn());
        }
      } else {
        let message = "user not found";
        rs.status(404).json(response(message).warn());
      }
    }
  } catch (err) {
    pass(err);
  }
}
// create campaign

/*
 if first campaign, and onboarding already done, the request is still completed, but
 the request will be terminated if first campaign and onboarding hasent completed.
 so if ps priotizes Accuracy then there should never lead the enduser to complete
 the onboarding until after getting error when creating a campaign (onboarding error).

 the onboarding link should never be sent to email etc but should be completed immediately
 its attained as its confidential.
*/
