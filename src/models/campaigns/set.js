import Connection from "../../.config/connection/db.js";
import {
  _dbusers,
  _dbname,
  _dbcampaigns,
  _dbsales,
  _dbcoupons,
  _dbpromotions,
  _dbwatch,
} from "../../.config/var/connection.js";
import { _appname, _usertypeA } from "../../.config/var/application.js";
import dates from "../../utils/dates.js";

export async function queryUserSide(id, campaignid) {
  let connection = Connection;
  try {
    await connection.connect();
    const db = connection.pipeline(_dbusers);
    const query = { _id: id };
    const update = {
      $push: { "merchant.campaigns": campaignid },
      $inc: { "merchant.campaignCount": 1 },
    };
    await db.updateOne(query, update);
    return true;
  } catch (err) {
    throw err;
  } finally {
    await connection.close();
  }
}
//  query user side

export async function queryCampaign(schema) {
  let connection = Connection;
  try {
    await connection.connect();
    const db = connection.pipeline(_dbcampaigns);
    await db.insertOne(schema);
    return true;
  } catch (err) {
    throw err;
  } finally {
    await connection.close();
  }
}
//  query campaign

export async function updateMerchantsinceFirstCampaign(
  id,
  campaignid,
  social,
  details,
  website,
  menu,
  logo
) {
  let connection = Connection;
  try {
    await connection.connect();
    const db = connection.pipeline(_dbusers);

    const query = { _id: id };
    const update = {
      $push: { "merchant.campaigns": campaignid },
      $inc: { "merchant.campaignCount": 1 },
      $set: {
        "meta.details": details,
        "user.website": website,
        "meta.profile": menu,
        "meta.logo": logo,
      },
    };
    if (social.linkedin) {
      update.$set["user.social.linkedin"] = social.linkedin;
    }
    if (social.facebook) {
      update.$set["user.social.facebook"] = social.facebook;
    }
    if (social.instagram) {
      update.$set["user.social.instagram"] = social.instagram;
    }
    if (social.twitter) {
      update.$set["user.social.twitter"] = social.twitter;
    }
    await db.updateOne(query, update);
    return true;
  } catch (err) {
    throw err;
  } finally {
    await connection.close();
  }
}
// update Merchant since First Campaign

export async function purchaseCampaign_uCS_UPDATEUSERCOUNT_PHASE_ONE(pubId) {
  let connection = Connection;
  try {
    await connection.connect();
    const db = connection.pipeline(_dbcampaigns);
    await db.updateOne({ pubId }, { $inc: { "users.count": 1 } });
    return true;
  } catch (err) {
    throw err;
  } finally {
    await connection.close();
  }
}
// update user count [phase one]

export async function purchaseCampaign_uCS_UPDATEUSERCOUNT_PHASE_TWO_FAILED(
  pubId
) {
  let connection = Connection;
  try {
    await connection.connect();
    const db = connection.pipeline(_dbcampaigns);
    await db.updateOne({ pubId }, { $inc: { "users.count": -1 } });
    return true;
  } catch (err) {
    throw err;
  } finally {
    await connection.close();
  }
}
// update user count [phase one]

export async function purchaseCampaign_uCS_UPDATEPURCHASECOUNT_PHASE_ONE(
  pubId,
  userId
) {
  let connection = Connection;
  try {
    await connection.connect();
    const db = connection.pipeline(_dbcampaigns);
    let query = { pubId, "users.entries.userId": userId };
    let update = {
      $inc: { "users.entries.$.purchaseCount": 1 },
      $set: { "users.entries.$.lastpurchaseAt": dates(new Date()) },
    };
    await db.updateOne(query, update);
    return true;
  } catch (err) {
    throw err;
  } finally {
    await connection.close();
  }
}
// update purchase count [phase one]

export async function purchaseCampaign_uCS_UPDATEPURCHASECOUNT_PHASE_TWO_FAILED(
  pubId,
  userId
) {
  let connection = Connection;
  try {
    await connection.connect();
    const db = connection.pipeline(_dbcampaigns);
    let query = { pubId, "users.entries.userId": userId };
    let update = {
      $inc: { "users.entries.$.purchaseCount": -1 },
    };
    await db.updateOne(query, update);
    return true;
  } catch (err) {
    throw err;
  } finally {
    await connection.close();
  }
}
// update purchase count [phase two]

async function pc_ucsHelper2(pubId, data) {
  let connection = Connection;
  try {
    await connection.connect();
    const db = connection.pipeline(_dbcampaigns);
    const existingUser = await db.findOne(
      { pubId, "users.entries.userId": data.userId },
      { projection: { userId: 1 } }
    );
    return existingUser;
  } catch (err) {
    throw err;
  } finally {
    await connection.close();
  }
}
async function pc_ucsHelper3(pubId, data) {
  let connection = Connection;
  try {
    await connection.connect();
    const db = connection.pipeline(_dbcampaigns);
    // user has already purchased the campaign, update the entry
    let query = { pubId, "users.entries.userId": data.userId };
    let update = {
      $set: { "users.entries.$.lastpurchaseAt": dates(new Date()) },
      $push: {
        "users.entries.$.purchases": data.purchases[0],
      },
    };
    await db.updateOne(query, update);
    return true;
  } catch (err) {
    throw err;
  } finally {
    await connection.close();
  }
}
async function pc_ucsHelper4(pubId, data) {
  let connection = Connection;
  try {
    await connection.connect();
    const db = connection.pipeline(_dbcampaigns);
    // user hasent purchased the campaign, push a new entry
    let query = { pubId };
    let update = { $push: { "users.entries": data } };
    await db.updateOne(query, update);
    return true;
  } catch (err) {
    throw err;
  } finally {
    await connection.close();
  }
}

export async function purchaseCampaign_updatecampaignside(pubId, data) {
  try {
    const existingUser = await pc_ucsHelper2(pubId, data);
    if (existingUser) {
      // user has already purchased the campaign, update the entry
      await pc_ucsHelper3(pubId, data);
    } else {
      // user hasent purchased the campaign, push a new entry
      await pc_ucsHelper4(pubId, data);
    }
    return true;
  } catch (err) {
    throw err;
  }
}
// purchase campaign update campaign side

async function pc_ucssHelper1(_id, data) {
  let connection = Connection;
  try {
    await connection.connect();
    const db = connection.pipeline(_dbusers);
    // Update wallet at the top level
    await db.updateOne(
      { _id },
      {
        $inc: {
          "user.wallet.membershipCount": 1,
          "user.wallet.ASOC": data.purchases[0].price,
        },
      }
    );
    return true;
  } catch (err) {
    throw err;
  } finally {
    await connection.close();
  }
}
async function pc_ucssHelper2(_id, data) {
  let connection = Connection;
  try {
    await connection.connect();
    const db = connection.pipeline(_dbusers);
    const existingUser = await db.findOne(
      { _id, "user.wallet.campaigns.campaignId": data.campaignId },
      { projection: { "user.wallet.campaigns.$": 1 } }
    );
    return existingUser;
  } catch (err) {
    throw err;
  } finally {
    await connection.close();
  }
}
async function pc_ucssHelper3(_id, data) {
  let connection = Connection;
  try {
    await connection.connect();
    const db = connection.pipeline(_dbusers);
    // user has already purchased the campaign, update the doc in the wallet
    let query = { _id, "user.wallet.campaigns.campaignId": data.campaignId };
    let update = {
      $inc: { "user.wallet.campaigns.$[elem].purchaseCount": 1 },
      $set: {
        "user.wallet.campaigns.$[elem].lastpurchaseAt": dates(new Date()),
      },
      $push: {
        "user.wallet.campaigns.$[elem].purchases": data.purchases[0],
      },
    };
    let arrayFilters = [{ "elem.campaignId": data.campaignId }];
    await db.updateOne(query, update, { arrayFilters });

    return true;
  } catch (err) {
    throw err;
  } finally {
    await connection.close();
  }
}
async function pc_ucssHelper4(_id, data) {
  let connection = Connection;
  try {
    await connection.connect();
    const db = connection.pipeline(_dbusers);
    // user hasn't purchased the campaign, push a new doc to the wallet
    let query = { _id };
    let update = { $push: { "user.wallet.campaigns": data } };
    await db.updateOne(query, update);
    return true;
  } catch (err) {
    throw err;
  } finally {
    await connection.close();
  }
}
export async function purchaseCampaign_updatecustomerside(_id, data) {
  try {
    // Update wallet at the top level
    await pc_ucssHelper1(_id, data);

    const existingUser = await pc_ucssHelper2(_id, data);
    if (existingUser && existingUser.user.wallet.campaigns.length > 0) {
      // user has already purchased the campaign, update the doc in the wallet
      await pc_ucssHelper3(_id, data);
    } else {
      // user hasn't purchased the campaign, push a new doc to the wallet
      await pc_ucssHelper4(_id, data);
    }
    return true;
  } catch (err) {
    throw err;
  }
}
// purchase campaign update customer side

export async function purchaseCampaign_updatepsside(data) {
  let connection = Connection;
  try {
    await connection.connect();
    const db = connection.pipeline(_dbsales);
    await db.insertOne(data);
    return true;
  } catch (err) {
    throw err;
  } finally {
    await connection.close();
  }
}
// purchase campaign update path synch side

export async function purchaseCampaign_updatecouponside(code) {
  let connection = Connection;
  try {
    await connection.connect();
    const db = connection.pipeline(_dbcoupons);
    const rds = dates(new Date()).split("/");
    let as = {
      $inc: { "noOfCoupon.avail": -1 },
      $push: { redeems: { stamp: [rds[0], rds[1], rds[2]] } },
    };
    await db.updateOne({ code }, as);
    return true;
  } catch (err) {
    throw err;
  } finally {
    await connection.close();
  }
}
// purchase campaign update coupons side

export async function purchaseCampaign_updatecouponsidePHASE_ONE(code) {
  let connection = Connection;
  try {
    await connection.connect();
    const db = connection.pipeline(_dbcoupons);
    let as = { $inc: { "noOfCoupon.avail": -1 } };
    await db.updateOne({ code }, as);
    return true;
  } catch (err) {
    throw err;
  } finally {
    await connection.close();
  }
}
// purchase campaign update coupons side [phase1]

export async function purchaseCampaign_updatecouponsidePHASE_TWO_SUCCESSFUL(
  code
) {
  let connection = Connection;
  try {
    await connection.connect();
    const db = connection.pipeline(_dbcoupons);
    const rds = dates(new Date()).split("/");
    let as = { $push: { redeems: { stamp: [rds[0], rds[1], rds[2]] } } };
    await db.updateOne({ code }, as);
    return true;
  } catch (err) {
    throw err;
  } finally {
    await connection.close();
  }
}
// purchase campaign update coupons side [phase2] successful

export async function purchaseCampaign_updatecouponsidePHASE_TWO_FAILED(code) {
  let connection = Connection;
  try {
    await connection.connect();
    const db = connection.pipeline(_dbcoupons);
    const rds = dates(new Date()).split("/");
    let as = { $inc: { "noOfCoupon.avail": 1 } };
    await db.updateOne({ code }, as);
    return true;
  } catch (err) {
    throw err;
  } finally {
    await connection.close();
  }
}
// purchase campaign update coupons side [phase2] failed

export async function updatepathpoints(_id, value) {
  let connection = Connection;
  try {
    await connection.connect();
    const db = connection.pipeline(_dbusers);
    const query = { _id };
    const update = { $inc: { "user.path.points": value } };
    await db.updateOne(query, update);
    return true;
  } catch (err) {
    throw err;
  } finally {
    await connection.close();
  }
}
// update path points

export async function querypromotecampaigncampaign(
  pubId,
  setToActive,
  promotionschema_campaign
) {
  let connection = Connection;
  try {
    await connection.connect();
    const db = connection.pipeline(_dbcampaigns);
    const queryCampaign = { pubId };
    const updateCampiagn = { $set: {} };
    setToActive
      ? (updateCampiagn.$set = {
          "promotion.promotion.active": promotionschema_campaign,
          "promotion.ispromotion": true,
        })
      : (updateCampiagn.$set = {
          "promotion.promotion.pending": promotionschema_campaign,
        });
    await db.updateOne(queryCampaign, updateCampiagn);
    return true;
  } catch (err) {
    throw err;
  } finally {
    await connection.close();
  }
}
// query promote campaign campaign

export async function querypromotecampaignmetric(promotionschema_metric) {
  let connection = Connection;
  try {
    await connection.connect();
    const db = connection.pipeline(_dbpromotions);
    await db.insertOne(promotionschema_metric);
    return true;
  } catch (err) {
    throw err;
  } finally {
    await connection.close();
  }
}
// query promote campaign metric

export async function queryupdatecouponAftPorP(code) {
  let connection = Connection;
  try {
    await connection.connect();
    const db = connection.pipeline(_dbcoupons);
    const query = { code };
    const redeems = { stamp: dates(new Date()).split("/") };
    const update = { $inc: { "noOfCoupon.avail": -1 }, $push: { redeems } };
    await db.updateOne(query, update);
    return true;
  } catch (err) {
    throw err;
  } finally {
    await connection.close();
  }
}
// queryupdate coupon after purchase or promote

export async function queryeditcampaigngetinfo(pubId) {
  let connection = Connection;
  try {
    await connection.connect();
    const db = connection.pipeline(_dbcampaigns);
    const query = { pubId };
    const options = { projection: { _id: 1, _admin: 1 } };
    const doc = await db.findOne(query, options);
    return doc;
  } catch (err) {
    throw err;
  } finally {
    await connection.close();
  }
}
// get campaign info (edit campaign)

export async function meditcupdatecampaign(_id, body) {
  let connection = Connection;
  try {
    await connection.connect();
    const db = connection.pipeline(_dbcampaigns);
    const query = { _id };
    const update = { $set: {} };
    if (body.title) update.$set["meta.title"] = body.title;
    if (body.description) update.$set["meta.description"] = body.description;
    if (body.cover) update.$set["meta.cover"] = body.cover;
    if (body.endDate)
      update.$set["meta.endDate"] = dates(new Date(body.endDate));
    if (body.startDate)
      update.$set["meta.startDate"] = dates(new Date(body.startDate));
    await db.updateOne(query, update);
    return true;
  } catch (err) {
    throw err;
  } finally {
    await connection.close();
  }
}
// edit campaign

export async function appendToWatchDb_Payment_Intent(schema) {
  let connection = Connection;
  try {
    await connection.connect();
    const db = connection.pipeline(_dbwatch);
    await db.insertOne(schema);
    return true;
  } catch (err) {
    throw err;
  } finally {
    await connection.close();
  }
}
// append to watch db.... paymet intent

export async function retrieveFromWatchDb_Payment_Intent(transactionID) {
  let connection = Connection;
  try {
    await connection.connect();
    const db = connection.pipeline(_dbwatch);
    const doc = await db.findOne({ transactionID });
    return doc;
  } catch (err) {
    throw err;
  } finally {
    await connection.close();
  }
}
// retrieve from watch db.... paymet intent
