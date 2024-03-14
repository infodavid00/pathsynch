import Connection from "../../.config/connection/db.js";
import { _dbusers, _dbcampaigns } from "../../.config/var/connection.js";

export async function addfavouritemodel(id, schema) {
  let connection = Connection;
  try {
    await connection.connect();
    const db = connection.pipeline(_dbusers);
    const query = { _id: id, "auth.isVerified": true };
    const data = { $push: { "user.favourites.users": schema } };
    await db.updateOne(query, data);
    return true;
  } catch (err) {
    throw err;
  } finally {
    if (connection) connection.close();
  }
}
// add favourite model

export async function addfavouritemodelcampaign(id, schema) {
  let connection = Connection;
  try {
    await connection.connect();
    const db = connection.pipeline(_dbusers);
    const query = { _id: id, "auth.isVerified": true };
    const data = { $push: { "user.favourites.campaigns": schema } };
    await db.updateOne(query, data);
    return true;
  } catch (err) {
    throw err;
  } finally {
    if (connection) connection.close();
  }
}
// add favourite model campaign

export async function removefavouritemodel(id, userid) {
  let connection = Connection;
  try {
    await connection.connect();
    const db = connection.pipeline(_dbusers);
    const query = { _id: id, "auth.isVerified": true };
    const data = {
      $pull: {
        "user.favourites.users": { userid },
      },
    };
    await db.updateOne(query, data);
    return true;
  } catch (err) {
    throw err;
  } finally {
    if (connection) connection.close();
  }
}
// remove favourite model

export async function removefavouritemodelcampaigns(id, campaignId) {
  let connection = Connection;
  try {
    await connection.connect();
    const db = connection.pipeline(_dbusers);
    const query = { _id: id, "auth.isVerified": true };
    const data = {
      $pull: {
        "user.favourites.campaigns": { campaignId },
      },
    };
    await db.updateOne(query, data);
    return true;
  } catch (err) {
    throw err;
  } finally {
    if (connection) connection.close();
  }
}
// remove favourite model campaigns

export async function queryfollowerA(id, schema) {
  let connection = Connection;
  try {
    await connection.connect();
    const db = connection.pipeline(_dbusers);
    const query = { _id: id, "auth.isVerified": true };
    const data = {
      $push: { "user.followers.following.users": schema },
      $inc: { "user.followers.following.count": 1 },
    };
    await db.updateOne(query, data);
    return true;
  } catch (err) {
    throw err;
  } finally {
    if (connection) connection.close();
  }
}
// query follower [requested user side] [following]

export async function queryfollowerB(pubid, schema) {
  let connection = Connection;
  try {
    await connection.connect();
    const db = connection.pipeline(_dbusers);
    const query = { "meta.pubId": pubid, "auth.isVerified": true };
    const data = {
      $push: { "user.followers.followers.users": schema },
      $inc: { "user.followers.followers.count": 1 },
    };
    await db.updateOne(query, data);
    return true;
  } catch (err) {
    throw err;
  } finally {
    if (connection) connection.close();
  }
}
// query follower [other side] [followers]

export async function unfollowA(id, userid) {
  let connection = Connection;
  try {
    await connection.connect();
    const db = connection.pipeline(_dbusers);
    const query = { _id: id, "auth.isVerified": true };
    const data = {
      $pull: {
        "user.followers.following.users": { userid },
      },
      $inc: { "user.followers.following.count": -1 },
    };
    await db.updateOne(query, data);
    return true;
  } catch (err) {
    throw err;
  } finally {
    if (connection) connection.close();
  }
}
// unfollow [requested user side] [following]

export async function unfollowB(id, pubid) {
  let connection = Connection;
  try {
    await connection.connect();
    const db = connection.pipeline(_dbusers);
    const query = { "meta.pubId": id, "auth.isVerified": true };
    const data = {
      $pull: {
        "user.followers.followers.users": { pubid },
      },
      $inc: { "user.followers.followers.count": -1 },
    };
    await db.updateOne(query, data);
    return true;
  } catch (err) {
    throw err;
  } finally {
    if (connection) connection.close();
  }
}
// unfollow [other side] [followers]

export async function updatereviews(campaignid) {
  let connection = Connection;
  try {
    await connection.connect();
    const db = connection.pipeline(_dbcampaigns);
    const query = { pubId: campaignid };
    const options = { $inc: { reviews: 1 } };
    const doc = await db.updateOne(query, options);
    return doc;
  } catch (err) {
    throw err;
  } finally {
    if (connection) connection.close();
  }
}
// update reviews

export async function deleteUserFromUser(_id) {
  let connection = Connection;
  try {
    await connection.connect();
    const db = connection.pipeline(_dbusers);
    const query = { _id, "auth.isVerified": true };
    await db.deleteOne(query);
    return true;
  } catch (err) {
    throw err;
  } finally {
    if (connection) connection.close();
  }
}
// deleteUserFromUser collection

export async function deleteUserCampaignsFromCampaigns(_admin) {
  let connection = Connection;
  try {
    await connection.connect();
    const db = connection.pipeline(_dbcampaigns);
    const query = { _admin };
    await db.deleteOne(query);
    return true;
  } catch (err) {
    throw err;
  } finally {
    if (connection) connection.close();
  }
}
// deleteUserCampaignsFromCampaigns collection
