import Response from "../../../utils/response.js";
import {
  queryupdatedetails,
  queryupdatemenu_logo,
  reactiveCampaignModel,
  updateSocialorwebsite,
} from "../../../models/merchant/set.js";
import {
  querygetcampaignTOreactivate,
  querygetdpcampaignInfo,
  querygetmerchantOnboarding,
} from "../../../models/merchant/get.js";
import Campaign from "../../../schema/campaign/create.js";
import {
  meditcupdatecampaign,
  queryCampaign,
  queryUserSide,
  queryeditcampaigngetinfo,
} from "../../../models/campaigns/set.js";
import {
  deleteCampaignFromCampaign,
  deleteCampaignFromTrash,
  getCampaignTrashInfo,
  getcampaigncompleteInfo,
  getcampaigncompleteInfoFromTrash,
  inserttoCampaignFromTrashMerchant,
  inserttotrashMerchant,
} from "../../../models/campaigns/get.js";
import dates from "../../../utils/dates.js";
import {
  calculateFutureDate,
  compareDate,
  returnDategap,
} from "../../../utils/comparedate.js";
import stripe from "stripe";
import {
  _stripe_connect_accLink_refresh_url,
  _stripe_connect_accLink_return_url,
  _stripe_secrete_key,
} from "../../../.config/var/connection.js";

const response = (message) => new Response(message);

export async function updatedetails(rq, rs, pass) {
  const { id, details } = await rq.body;
  try {
    if (details) {
      await queryupdatedetails(id, details);
      let message = "ok";
      rs.status(200).json(response(message).success());
    } else {
      let message = "details must be present.";
      rs.status(400).json(response(message).warn());
    }
  } catch (err) {
    pass(err);
  }
}
// update details

export async function updatemenu_logo(rq, rs, pass) {
  const { id, menu, logo } = await rq.body;
  try {
    await queryupdatemenu_logo(id, menu || null, logo || null);
    let message = "ok";
    rs.status(200).json(response(message).success());
  } catch (err) {
    pass(err);
  }
}
// update menu or logo

export async function updatemedia_website(rq, rs, pass) {
  const { id, social, website } = await rq.body;
  try {
    await updateSocialorwebsite(id, social || {}, website || null);
    let message = "ok";
    rs.status(200).json(response(message).success());
  } catch (err) {
    pass(err);
  }
}
// update medias or websites

export async function duplicateCampaign(rq, rs, pass) {
  const { campaignId } = await rq.params;
  const { id: merchantId } = await rq.body;

  try {
    const data = await querygetdpcampaignInfo(campaignId);

    if (data !== null) {
      if (data._admin === merchantId) {
        let newstartDate = data.meta.startDate.split("/");
        let replacedMMnewstartDate = newstartDate[1];
        newstartDate[1] = newstartDate[0];
        newstartDate[0] = replacedMMnewstartDate;
        let newendDate = data.meta.endDate.split("/");
        let replacedMMnewendDate = newendDate[1];
        newendDate[1] = newendDate[0];
        newendDate[0] = replacedMMnewendDate;

        let body = {
          id: merchantId,
          noOfcampaigns: data.noOfcampaigns,
          options: data.meta.options,
          title: data.meta.title,
          value: data.meta.value,
          startDate: newstartDate.join("/"),
          endDate: newendDate.join("/"),
          discount: data.meta.discount,
          description: data.meta.description,
          cover: data.meta.cover,
          CampaignsPurchasablePerCustomer:
            data.settings.CampaignsPurchasablePerCustomer,
          repurchaseCampaignAfter: data.settings.repurchaseCampaignAfter,
        };
        const copied = new Campaign(body).create();

        let campaignId = copied._id;
        await queryUserSide(merchantId, campaignId);
        await queryCampaign(copied);
        rs.status(200).json(
          response("ok").success({ id: copied._id, publicid: copied.pubId })
        );
      } else {
        let message = "cannot verify ownership.";
        rs.status(403).json(response(message).warn());
      }
    } else {
      let message = "campaign not found";
      rs.status(404).json(response(message).warn());
    }
  } catch (err) {
    pass(err);
  }
}
//duplicate campaign

/* editable = title, description, cover, enddate, startdate */
export async function editcampaign(rq, rs, pass) {
  const body = await rq.body;
  const { id: merchantId } = body;
  const { campaignId } = await rq.params;

  try {
    if (
      "title" in body ||
      "description" in body ||
      "cover" in body ||
      "endDate" in body ||
      "startDate" in body
    ) {
      const campaigndetails = await queryeditcampaigngetinfo(campaignId);

      if (campaigndetails !== null) {
        if (campaigndetails._admin === merchantId) {
          await meditcupdatecampaign(campaigndetails._id, body);
          rs.status(200).json(response("ok").success());
        } else {
          let message = "permission denied by admin.";
          rs.status(403).json(response(message).warn());
        }
      } else {
        let message = "campaign not found";
        rs.status(404).json(response(message).warn());
      }
    } else {
      let message =
        "title, description, cover, endDate or startDate must be included";
      rs.status(400).json(response(message).warn());
    }
  } catch (err) {
    pass(err);
  }
}
// edit campaign

export async function movetotrashMerchant(rq, rs, pass) {
  const { id: merchantId } = await rq.body;
  const { campaignId } = await rq.params;

  try {
    const campaigndetails = await queryeditcampaigngetinfo(campaignId);

    if (campaigndetails !== null) {
      if (campaigndetails._admin === merchantId) {
        let replicadoc = {
          trashedDate: dates(new Date()),
          ...(await getcampaigncompleteInfo(campaigndetails._id)),
        };
        /* get the whole data and copy to the replica variable */
        await inserttotrashMerchant(replicadoc); // insert to trash
        await deleteCampaignFromCampaign(campaigndetails._id); // delete from entries [only from campaigns collection]
        rs.status(200).json(response(true).success());
      } else {
        let message = "permission denied by admin.";
        rs.status(403).json(response(message).warn());
      }
    } else {
      let message = "campaign not found";
      rs.status(404).json(response(message).warn());
    }
  } catch (err) {
    pass(err);
  }
}
// move to trash merchant

export async function restorefromtrashMerchant(rq, rs, pass) {
  const { id: merchantId } = await rq.body;
  const { campaignId } = await rq.params;

  try {
    const campaigntrashInfo = await getCampaignTrashInfo(campaignId);
    if (campaigntrashInfo !== null) {
      if (campaigntrashInfo._admin === merchantId) {
        let replicadoc = await getcampaigncompleteInfoFromTrash(
          campaigntrashInfo._id
        );
        delete replicadoc?.trashedDate;
        /* get the whole data and copy to the replica variable */
        await inserttoCampaignFromTrashMerchant(replicadoc); // insert to campaign
        await deleteCampaignFromTrash(campaigntrashInfo._id); // delete from trash
        rs.status(200).json(response(true).success());
      } else {
        let message = "permission denied by admin.";
        rs.status(403).json(response(message).warn());
      }
    } else {
      let message = "campaign not found";
      rs.status(404).json(response(message).warn());
    }
  } catch (err) {
    pass(err);
  }
}
// restore from trash merchant

export async function reactivateCampaign(rq, rs, pass) {
  const { id: merchantId } = await rq.body;
  const { campaignId } = await rq.params;

  try {
    const retrievedCampaign = await querygetcampaignTOreactivate(campaignId);
    // get the campaign
    if (retrievedCampaign !== null) {
      if (retrievedCampaign._admin === merchantId) {
        // make sure you have admin priviledges
        let hasExpired =
          compareDate(retrievedCampaign.meta.endDate, dates(new Date()))[1] ===
          2; // check if expired

        if (hasExpired) {
          let amountOfDaysCampaignLastedFor = returnDategap(
            retrievedCampaign.meta.startDate,
            retrievedCampaign.meta.endDate
          );
          // if expired calaculate how many days the campaign lasted for

          let renewalObj = {
            startDate: dates(new Date()),
            endDate: calculateFutureDate(amountOfDaysCampaignLastedFor),
          };
          //  and restart the camapaign today and end after the amount of days it run for.

          await reactiveCampaignModel(retrievedCampaign._id, renewalObj); // update db
          rs.status(200).json(response("ok").success()); // end request
        } else {
          let message = "campaign still ongoing.";
          rs.status(403).json(response(message).warn());
        }
      } else {
        let message = "permission denied by admin.";
        rs.status(403).json(response(message).warn());
      }
    } else {
      let message = "campaign not found.";
      rs.status(404).json(response(message).warn());
    }
  } catch (err) {
    pass(err);
  }
}
// reactive campaign

export async function verifyOnboarding(rq, rs, pass) {
  const { id } = await rq.body;
  try {
    // get onboarding  info
    const getonboardingInfo = await querygetmerchantOnboarding(id);

    if (getonboardingInfo !== null) {
      // check the isCompletedOnboarding status
      if (getonboardingInfo.isCompletedOnboarding === false) {
        const Stripe = new stripe(_stripe_secrete_key);
        const accountLink = await Stripe.accountLinks.create({
          account: getonboardingInfo._connectedId,
          refresh_url: _stripe_connect_accLink_refresh_url, // if something happens like aborted or expired
          return_url: _stripe_connect_accLink_return_url, // if completed or exited properly
          type: "account_onboarding",
        });
        rs.status(200).json(response("ok").success({ accountLink }));
      } else {
        let message = "Connect onboarding already completed";
        rs.status(403).json(response(message).warn());
      }
    } else {
      let message = "User not found";
      rs.status(404).json(response(message).warn());
    }
  } catch (err) {
    pass(err);
  }
}
// verify onboarding
