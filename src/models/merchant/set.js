import Connection from "../../.config/connection/db.js";
import {
  _dbcampaigns,
  _dbtrash,
  _dbusers,
} from "../../.config/var/connection.js";
import { _usertypeA } from "../../.config/var/application.js";
import dates from "../../utils/dates.js";

export async function queryupdatebuisnesstype(id, body) {
  let connection = Connection;
  try {
    await connection.connect();
    const db = connection.pipeline(_dbusers);
    const query = {
      _id: id,
      "auth.isVerified": true,
      "meta.type": _usertypeA,
    };
    const option = { $set: { "meta.lastupdateAt": dates(new Date()) } };

    if (body.category) {
      option.$set["meta.buisnessType.category"] = body.category;
    }
    if (body.servicesTypes) {
      option.$set["meta.buisnessType.servicesTypes"] = body.servicesTypes;
    }
    if (body.services) {
      option.$set["meta.buisnessType.services"] = body.services;
    }

    await db.updateOne(query, option);
    return true;
  } catch (err) {
    throw err;
  } finally {
    if (connection) connection.close();
  }
}
// update buisnesstype

export async function updateSocialorwebsite(id, social, website) {
  let connection = Connection;
  try {
    await connection.connect();
    const db = connection.pipeline(_dbusers);

    const query = { _id: id };
    const update = { $set: { "meta.lastupdateAt": dates(new Date()) } };
    if (website) {
      update.$set["user.website"] = website;
    }
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
    if (connection) connection.close();
  }
}
// update social or website

export async function queryupdatedetails(id, details) {
  let connection = Connection;
  try {
    await connection.connect();
    const db = connection.pipeline(_dbusers);
    const query = { _id: id };
    const update = {
      $set: { "meta.lastupdateAt": dates(new Date()), "meta.details": details },
    };
    await db.updateOne(query, update);
    return true;
  } catch (err) {
    throw err;
  } finally {
    if (connection) connection.close();
  }
}
// update details

export async function queryupdatemenu_logo(id, menu, logo) {
  let connection = Connection;
  try {
    await connection.connect();
    const db = connection.pipeline(_dbusers);
    const query = { _id: id };
    const update = { $set: { "meta.lastupdateAt": dates(new Date()) } };

    if (menu) update.$set["meta.profile"] = menu;
    if (logo) update.$set["meta.logo"] = logo;

    await db.updateOne(query, update);
    return true;
  } catch (err) {
    throw err;
  } finally {
    if (connection) connection.close();
  }
}
// update menu or logo

export async function getCampaignTrash(_admin, page, size) {
  let connection = Connection;
  try {
    await connection.connect();
    const db = connection.pipeline(_dbtrash);
    const query = { _admin };
    const options = { projection: { meta: 1 } };
    const doc = await db.find(query, options).skip(page).limit(size).toArray();
    return doc;
  } catch (err) {
    throw err;
  } finally {
    if (connection) connection.close();
  }
}
// get campaign trash

export async function reactiveCampaignModel(_id, metadates) {
  let connection = Connection;
  try {
    await connection.connect();
    const db = connection.pipeline(_dbcampaigns);
    const query = { _id };
    const updates = {
      $set: {
        "meta.startDate": metadates.startDate,
        "meta.endDate": metadates.endDate,
      },
    };
    await db.updateOne(query, updates);
    return true;
  } catch (err) {
    throw err;
  } finally {
    if (connection) connection.close();
  }
}
// reactivate campaign model

export async function queryupdate_verifyOnboarding(_connectedId) {
  let connection = Connection;
  try {
    await connection.connect();
    const db = connection.pipeline(_dbusers);
    const query = { _connectedId };
    const updates = { $set: { isCompletedOnboarding: true } };
    await db.updateOne(query, updates);
    return true;
  } catch (err) {
    throw err;
  } finally {
    if (connection) connection.close();
  }
}
// verify onboarding
