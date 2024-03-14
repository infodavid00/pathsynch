import Response from "../../../utils/response.js";
import { Accesstoken } from "../../../.config/etc/tokens.js";
import validator from "validator";
import {
  querygetallcampaignspermerchant,
  querylocateidwithpubId,
} from "../../../models/merchant/get.js";
import { querygetLogoforCampaignsMAd } from "../../../models/admin/get.js";
import { querygetsinglecampaign } from "../../../models/users/get.js";
import { updatereviews } from "../../../models/users/set.js";

const response = (message) => new Response(message);

export async function getusertype(rq, rs, pass) {
  const token = await rq.params.accesstoken;
  const ast = new Accesstoken(); //ast as accesstoken
  if (validator.isJWT(token)) {
    try {
      const { type } = await ast.verify(token);
      let message = true;
      rs.status(200).json(response(message).success(type));
    } catch (err) {
      pass(err);
    }
  } else {
    let message = "Err : invalid token";
    rs.status(403).json(response(message).warn());
  }
}
// get user type

/* isActive, noOfcampaigns, options, title, value, startDate, endDate, description, 
   discount, cover, promotion, usersCount, repurchaseCampaignAfter, 
   CampaignsPurchasablePerCustomer 
*/
function _projection_(body) {
  let projection = { _id: 0, pubId: 1, noOfcampaigns: 1, "users.count": 1 };
  function addprojection(key) {
    projection[key] = 1;
    return void 0;
  }
  /* the projection variable and function for appending to it. */
  body.isActive ? addprojection("isActive") : void 0;
  body.options ? addprojection("meta.options") : void 0;
  body.title ? addprojection("meta.title") : void 0;
  body.value ? addprojection("meta.value") : void 0;
  body.startDate ? addprojection("meta.startDate") : void 0;
  body.endDate ? addprojection("endDate") : void 0;
  body.description ? addprojection("meta.description") : void 0;
  body.discount ? addprojection("meta.discount") : void 0;
  body.cover ? addprojection("meta.cover") : void 0;
  body.promotion ? addprojection("promotion") : void 0;
  body.repurchaseCampaignAfter
    ? addprojection("settings.repurchaseCampaignAfter")
    : void 0;
  body.CampaignsPurchasablePerCustomer
    ? addprojection("settings.CampaignsPurchasablePerCustomer")
    : void 0;

  return projection;
}

/*
 all : get all merchants
 isActive : get all active merchants
 LnoOfcampaigns : get all merchants where no of campaigns is less than <LnoOfcampaigns>
 GnoOfcampaigns : get all merchants where no of campaigns is greater than <GnoOfcampaigns>
 options : get all merchants where merchants has merchants
 Gvalue : get all merchants where value is greater than <value>
 Lvalue : get all merchants where value is less than <value>
 startDate : get all merchants where startdate is <startDate>
 discount : get all merchants where discount is present
*/ export async function getmerchantcampaign(rq, rs, pass) {
  try {
    const size = Number(rq.query.size) || 10;
    const page = Number(rq.query.page) * size || 0;

    const { merchantid } = rq.params;
    const { projection, query } = rq.body;

    const mainid = await querylocateidwithpubId(merchantid);

    if (mainid) {
      let _query_ = {
        _admin: mainid,
        _istrashed: false,
        _isstopped: false,
        isActive: true,
      };
      function addquery(key, val) {
        _query_[key] = val;
        return void 0;
      }
      /* the query variable and function for appending to it. */
      query.all ? addquery("_admin", mainid) : void 0;
      query.isActive ? addquery("isActive", true) : void 0;
      query.LnoOfcampaigns
        ? addquery("noOfcampaigns", { $lt: Number(query.LnoOfcampaigns) })
        : void 0;
      query.GnoOfcampaigns
        ? addquery("noOfcampaigns", { $gt: Number(query.GnoOfcampaigns) })
        : void 0;
      query.options && Array.isArray(query.options)
        ? addquery("meta.options", { $in: query.options })
        : void 0;
      query.Gvalue
        ? addquery("meta.value", { $gt: Number(query.Gvalue) })
        : void 0;
      query.Lvalue
        ? addquery("meta.value", { $lt: Number(query.Lvalue) })
        : void 0;
      query.startDate ? addquery("meta.startDate", query.startDate) : void 0;
      query.discount ? addquery("meta.discount", { $gt: 0 }) : void 0;
      /* query part */
      const docs = await querygetallcampaignspermerchant(
        _projection_(projection),
        _query_,
        page,
        size
      );
      // get the docs.

      docs.forEach((elem) => {
        elem && elem.users.count === elem?.noOfcampaigns
          ? (elem["soled"] = true)
          : (elem["soled"] = false);
      });
      rs.status(200).json(response("ok").success(docs));
    } else {
      let message = "user not found";
      rs.status(404).json(response(message).warn());
    }
  } catch (err) {
    pass(err);
  }
}
// get merchant campaigns.

export async function getsinglecampaign(rq, rs, pass) {
  const { campaignid } = await rq.params;
  try {
    const GET = await querygetsinglecampaign(campaignid);
    if (GET !== null) {
      await updatereviews(campaignid);
      GET.users.count === GET.noOfcampaign
        ? (GET["soled"] = true)
        : (GET["soled"] = false);
      rs.status(200).json(response(true).success(GET));
    } else {
      let message = "campaign not found.";
      rs.status(404).json(response(message).warn());
    }
  } catch (err) {
    pass(err);
  }
}
// get merchant single campaign

/*
 all : get all campaigns
 isActive : get all active campaigns
 LnoOfcampaigns : get all campaigns where no of campaigns is less than <LnoOfcampaigns>
 GnoOfcampaigns : get all campaigns where no of campaigns is greater than <GnoOfcampaigns>
 options : get all campaigns where options has <options>
 Gvalue : get all campaigns where value is greater than <value>
 Lvalue : get all campaigns where value is less than <value>
 startDate : get all campaigns where startdate is <startDate>
 discount : get all campaigns where discount is present
 ispromotion : get all campaigns using promotions
 promotion: get all campaigns using <promotion>
 Gusers : get all campaigns where users count is greater than <value>
 Lusers : get all campaigns where users count is less than <value>
 */
export async function getallcampaigns(rq, rs, pass) {
  const size = Number(await rq.query.size) || 10;
  const page = Number(await rq.query.page) * size || 0 * size;
  const { projection, query } = await rq.body;
  let _query_ = {
    _istrashed: false,
    _isstopped: false,
    isActive: true,
  };
  function addquery(key, val) {
    _query_[key] = val;
    return void 0;
  }
  /* the query variable and function for appending to it. */
  query.all ? addquery("isActive", true) : void 0;
  query.isActive ? addquery("isActive", true) : void 0;
  query.LnoOfcampaigns
    ? addquery("noOfcampaigns", { $lt: Number(query.LnoOfcampaigns) })
    : void 0;
  query.GnoOfcampaigns
    ? addquery("noOfcampaigns", { $gt: Number(query.GnoOfcampaigns) })
    : void 0;
  query.options && Array.isArray(query.options)
    ? addquery("meta.options", { $in: query.options })
    : void 0;
  query.Gvalue ? addquery("meta.value", { $gt: Number(query.Gvalue) }) : void 0;
  query.Lvalue ? addquery("meta.value", { $lt: Number(query.Lvalue) }) : void 0;
  query.startDate ? addquery("meta.startDate", query.startDate) : void 0;
  query.discount ? addquery("meta.discount", { $gt: 0 }) : void 0;
  query.ispromotion ? addquery("promotion.ispromotion", true) : void 0;
  query.promotion
    ? addquery("promotion.promotion.active.plan", query.promotion)
    : void 0;
  query.Gusers
    ? addquery("users.count", { $gt: Number(query.Gusers) })
    : void 0;
  query.Lusers
    ? addquery("users.count", { $lt: Number(query.Lusers) })
    : void 0;
  /* query part */
  try {
    let pj = _projection_(projection);
    pj["_admin"] = 1;
    const GET = await querygetallcampaignspermerchant(pj, _query_, page, size);

    let merchantIds = [];
    for (let i = 0; i < GET.length; i++) {
      if (!merchantIds.includes(GET[i]._admin)) merchantIds.push(GET[i]._admin);
    }
    let Logos = await querygetLogoforCampaignsMAd(merchantIds);

    GET.forEach((elem) => {
      const obj = { ...elem };
      for (let j = 0; j < Logos.length; j++) {
        if (Logos[j]._id === obj._admin) obj.meta.logo = Logos[j].meta.logo;
      }
      return obj;
    });

    let message = "ok";
    rs.status(200).json(response(message).success(GET));
  } catch (err) {
    pass(err);
  }
}
// get all campaigns
