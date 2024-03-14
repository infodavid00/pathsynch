import Connection from "../../.config/connection/db.js";
import {
  _dbusers,
  _dbname,
  _dbcampaigns,
  _dbcoupons,
  _dbtrash,
  _dbwatch,
  _dbsales,
} from "../../.config/var/connection.js";
import { _appname, _usertypeA } from "../../.config/var/application.js";

export async function isFirstcampaign(id) {
  let connection = Connection;
  try {
    await connection.connect();
    const db = connection.pipeline(_dbusers);
    const query = { _id: id };
    const options = {
      projection: { "merchant.campaignCount": 1 },
    };
    const doc = await db.findOne(query, options);
    if (doc) {
      let isfc = doc.merchant.campaignCount === 0;
      if (isfc) {
        return true;
      } else {
        return false;
      }
    } else {
      throw { message: "user not found" };
    }
  } catch (err) {
    throw err;
  } finally {
    if (connection) connection.close();
  }
}
//  check if isfirstcampaign model

export async function getcampaigninfo(pubId) {
  let connection = Connection;
  try {
    await connection.connect();
    const db = connection.pipeline(_dbcampaigns);
    const query = {
      pubId,
      _istrashed: false,
      _isstopped: false,
      isActive: true,
    };
    const option = {
      projection: {
        noOfcampaigns: 1,
        meta: 1,
        settings: 1,
        users: 1,
        _admin: 1,
      },
    };
    const doc = await db.findOne(query, option);
    return doc;
  } catch (err) {
    throw err;
  } finally {
    if (connection) connection.close();
  }
}
//  get campaign info

export async function getcouponinfo(code) {
  let connection = Connection;
  try {
    await connection.connect();
    const db = connection.pipeline(_dbcoupons);
    const query = { code };
    const options = { projection: { redeems: 0 } };
    const doc = await db.findOne(query, options);
    return doc;
  } catch (err) {
    throw err;
  } finally {
    if (connection) connection.close();
  }
}
//  get coupon info

export async function getcampaignscount(_id) {
  let connection = Connection;
  try {
    await connection.connect();
    const db = connection.pipeline(_dbusers);
    const query = { _id };
    const options = {
      projection: { "user.wallet.membershipCount": 1 },
    };
    const doc = await db.findOne(query, options);
    return doc;
  } catch (err) {
    throw err;
  } finally {
    if (connection) connection.close();
  }
}
//  get coupon infobyNo

export async function getcampaignpromotionInfo(pubId) {
  let connection = Connection;
  try {
    await connection.connect();
    const db = connection.pipeline(_dbcampaigns);
    const query = { pubId };
    const options = { projection: { promotion: 1 } };
    const doc = await db.findOne(query, options);
    return doc;
  } catch (err) {
    throw err;
  } finally {
    if (connection) connection.close();
  }
}
//  get campaign promotion info

export async function getcampaigncompleteInfo(_id) {
  let connection = Connection;
  try {
    await connection.connect();
    const db = connection.pipeline(_dbcampaigns);
    const query = { _id };
    const doc = await db.findOne(query);
    return doc;
  } catch (err) {
    throw err;
  } finally {
    if (connection) connection.close();
  }
}
//  get campaign complete info

export async function inserttotrashMerchant(replica) {
  let connection = Connection;
  try {
    await connection.connect();
    const db = connection.pipeline(_dbtrash);
    await db.insertOne(replica);
    return true;
  } catch (err) {
    throw err;
  } finally {
    if (connection) connection.close();
  }
}
// insert to trash

export async function deleteCampaignFromCampaign(_id) {
  let connection = Connection;
  try {
    await connection.connect();
    const db = connection.pipeline(_dbcampaigns);
    const query = { _id };
    await db.deleteOne(query);
    return true;
  } catch (err) {
    throw err;
  } finally {
    if (connection) connection.close();
  }
}
// delete campaign from campaign

export async function getCampaignTrashInfo(pubId) {
  let connection = Connection;
  try {
    await connection.connect();
    const db = connection.pipeline(_dbtrash);
    const query = { pubId };
    const option = { projection: { _id: 1, _admin: 1 } };
    const doc = await db.findOne(query, option);
    return doc;
  } catch (err) {
    throw err;
  } finally {
    if (connection) connection.close();
  }
}
// get campaign trash info

export async function getcampaigncompleteInfoFromTrash(_id) {
  let connection = Connection;
  try {
    await connection.connect();
    const db = connection.pipeline(_dbtrash);
    const query = { _id };
    const doc = await db.findOne(query);
    return doc;
  } catch (err) {
    throw err;
  } finally {
    if (connection) connection.close();
  }
}
//  get campaign complete info from trash

export async function inserttoCampaignFromTrashMerchant(replica) {
  let connection = Connection;
  try {
    await connection.connect();
    const db = connection.pipeline(_dbcampaigns);
    await db.insertOne(replica);
    return true;
  } catch (err) {
    throw err;
  } finally {
    if (connection) connection.close();
  }
}
// insert to campaign

export async function deleteCampaignFromTrash(_id) {
  let connection = Connection;
  try {
    await connection.connect();
    const db = connection.pipeline(_dbtrash);
    const query = { _id };
    await db.deleteOne(query);
    return true;
  } catch (err) {
    throw err;
  } finally {
    if (connection) connection.close();
  }
}
// delete campaign from trash

export async function getConnectedIdofMerchant(id) {
  let connection = Connection;
  try {
    await connection.connect();
    const db = connection.pipeline(_dbusers);
    const query = { _id: id, "meta.type": _usertypeA };
    const option = { projection: { _connectedId: 1 } };
    const doc = await db.findOne(query, option);
    return doc;
  } catch (err) {
    throw err;
  } finally {
    if (connection) connection.close();
  }
}
//  get connected id of merchant

export async function DELETEFROMWATCHDB(transactionID) {
  let connection = Connection;
  try {
    await connection.connect();
    const db = connection.pipeline(_dbwatch);
    const query = { transactionID };
    await db.deleteOne(query);
    return true;
  } catch (err) {
    throw err;
  } finally {
    if (connection) connection.close();
  }
}
//  delete from watch db

export async function purchase_state_Hook_Lookup(transactionID) {
  let connection = Connection;
  try {
    await connection.connect();
    const db = connection.pipeline(_dbsales);
    const query = { transactionId: transactionID };
    const option = { projection: { transactionId: 1 } };
    const doc = await db.findOne(query, option);
    return doc;
  } catch (err) {
    throw err;
  } finally {
    if (connection) connection.close();
  }
}
//  purchase state hook lookup

export async function queryCheck_ifuserhascompletedonboarding(_id) {
  let connection = Connection;
  try {
    await connection.connect();
    const db = connection.pipeline(_dbusers);
    const query = { _id, "meta.type": _usertypeA };
    const options = { projection: { isCompletedOnboarding: 1 } };
    const doc = await db.findOne(query, options);
    return doc;
  } catch (err) {
    throw err;
  } finally {
    if (connection) connection.close();
  }
}
// check if the user has completed onboarding
