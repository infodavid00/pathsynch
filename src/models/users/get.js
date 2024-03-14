import Connection from "../../.config/connection/db.js";
import { _dbcampaigns, _dbusers } from "../../.config/var/connection.js";

export async function favouriteslookupmodel(id) {
  let connection = Connection;
  try {
    await connection.connect();
    const db = connection.pipeline(_dbusers);
    const query = { _id: id, "auth.isVerified": true };
    const options = { projection: { _id: 0, "user.favourites.users": 1 } };
    const doc = await db.findOne(query, options);
    return doc;
  } catch (err) {
    throw err;
  } finally {
    if (connection) connection.close();
  }
}
// favourites lookup

export async function favouriteslookupmodelcampaigns(id) {
  let connection = Connection;
  try {
    await connection.connect();
    const db = connection.pipeline(_dbusers);
    const query = { _id: id, "auth.isVerified": true };
    const options = { projection: { _id: 0, "user.favourites.campaigns": 1 } };
    const doc = await db.findOne(query, options);
    return doc;
  } catch (err) {
    throw err;
  } finally {
    if (connection) connection.close();
  }
}
// favourites lookup campaigns

export async function returnusersinfoSL(pubid) {
  let connection = Connection;
  try {
    await connection.connect();
    const db = connection.pipeline(_dbusers);
    const query = { "meta.pubId": { $in: pubid }, "auth.isVerified": true };
    const options = {
      projection: {
        _id: 0,
        "meta.profile": 1,
        "meta.logo": 1,
        "meta.name": 1,
        "meta.pubId": 1,
      },
    };
    const doc = await db.find(query, options).toArray();
    return doc;
  } catch (err) {
    throw err;
  } finally {
    if (connection) connection.close();
  }
}
// return users info Short Lists

export async function returnusersinfoSLCampaign(pubId) {
  let connection = Connection;
  try {
    await connection.connect();
    const db = connection.pipeline(_dbcampaigns);
    const query = { pubId: { $in: pubId } };
    const options = {
      projection: {
        _id: 0,
        "meta.cover": 1,
        "meta.title": 1,
        "meta.value": 1,
        "meta.startDate": 1,
        "meta.endDate": 1,
        "meta.discount": 1,
        pubId: 1,
      },
    };
    const doc = await db.find(query, options).toArray();
    return doc;
  } catch (err) {
    throw err;
  } finally {
    if (connection) connection.close();
  }
}
// return users info Short Lists campaign

export async function getrequestinguserpubid(id) {
  let connection = Connection;
  try {
    await connection.connect();
    const db = connection.pipeline(_dbusers);
    const query = { _id: id, "auth.isVerified": true };
    const options = { projection: { _id: 0, "meta.pubId": 1 } };
    const doc = await db.findOne(query, options);
    return doc;
  } catch (err) {
    throw err;
  } finally {
    if (connection) connection.close();
  }
}
// get requesting user's pub id

export async function findfollowing(id) {
  let connection = Connection;
  try {
    await connection.connect();
    const db = connection.pipeline(_dbusers);
    const query = { _id: id, "auth.isVerified": true };
    const options = { projection: { _id: 0, "user.followers.following": 1 } };
    const doc = await db.findOne(query, options);
    return doc;
  } catch (err) {
    throw err;
  } finally {
    if (connection) connection.close();
  }
}
// find following

export async function findfollowers(id) {
  let connection = Connection;
  try {
    await connection.connect();
    const db = connection.pipeline(_dbusers);
    const query = { _id: id, "auth.isVerified": true };
    const options = { projection: { _id: 0, "user.followers.followers": 1 } };
    const doc = await db.findOne(query, options);
    return doc;
  } catch (err) {
    throw err;
  } finally {
    if (connection) connection.close();
  }
}
// find followers

export async function querygetsinglecampaign(campaignid) {
  let connection = Connection;
  try {
    await connection.connect();
    const db = connection.pipeline(_dbcampaigns);
    const query = { pubId: campaignid };
    const options = {
      projection: {
        _id: 0,
        "users.entries": 0,
        "members.entries": 0,
        _admin: 0,
      },
    };
    const doc = await db.findOne(query, options);
    return doc;
  } catch (err) {
    throw err;
  } finally {
    if (connection) connection.close();
  }
}
// get single campaign
