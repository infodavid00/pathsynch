import Connection from "../../.config/connection/db.js";
import { _dbcampaigns, _dbusers } from "../../.config/var/connection.js";
import { _usertypeA } from "../../.config/var/application.js";

export async function querygetbuisnesstype(id) {
  let connection = Connection;
  try {
    await connection.connect();
    const db = connection.pipeline(_dbusers);
    const query = { _id: id, "auth.isVerified": true, "meta.type": _usertypeA };
    const options = { projection: { _id: 0, "meta.buisnessType": 1 } };
    const doc = await db.findOne(query, options);
    return doc;
  } catch (err) {
    throw err;
  } finally {
    if (connection) connection.close();
  }
}
// get buisnesstype

export async function querygetsocial_website(id) {
  let connection = Connection;
  try {
    await connection.connect();
    const db = connection.pipeline(_dbusers);
    const query = { _id: id, "auth.isVerified": true, "meta.type": _usertypeA };
    const options = {
      projection: { _id: 0, "user.social": 1, "user.website": 1 },
    };
    const doc = await db.findOne(query, options);
    return doc;
  } catch (err) {
    throw err;
  } finally {
    if (connection) connection.close();
  }
}
// get socialmedias and website

export async function querygetdetails(id) {
  let connection = Connection;
  try {
    await connection.connect();
    const db = connection.pipeline(_dbusers);
    const query = { _id: id, "auth.isVerified": true, "meta.type": _usertypeA };
    const options = { projection: { _id: 0, "meta.details": 1 } };
    const doc = await db.findOne(query, options);
    return doc;
  } catch (err) {
    throw err;
  } finally {
    if (connection) connection.close();
  }
}
// get details

export async function querygetmenu_logo(id) {
  let connection = Connection;
  try {
    await connection.connect();
    const db = connection.pipeline(_dbusers);
    const query = { _id: id, "auth.isVerified": true, "meta.type": _usertypeA };
    const options = {
      projection: { _id: 0, "meta.profile": 1, "meta.logo": 1 },
    };
    const doc = await db.findOne(query, options);
    return doc;
  } catch (err) {
    throw err;
  } finally {
    if (connection) connection.close();
  }
}
// get menu and logo

export async function querygetmerchantinfo(id, projection) {
  let connection = Connection;
  try {
    await connection.connect();
    const db = connection.pipeline(_dbusers);
    const query = { _id: id, "auth.isVerified": true, "meta.type": _usertypeA };
    let options = { projection };
    const doc = await db.findOne(query, options);
    return doc;
  } catch (err) {
    throw err;
  } finally {
    if (connection) connection.close();
  }
}
// get merchant info

export async function querygetallmerchants(projection, page, size, query) {
  let connection = Connection;
  try {
    await connection.connect();
    const db = connection.pipeline(_dbusers);
    const doc = await db
      .find(query, { projection })
      .limit(size)
      .skip(page)
      .toArray();
    return doc;
  } catch (err) {
    throw err;
  } finally {
    if (connection) connection.close();
  }
}
// get all merchants

export async function querylocateidwithpubId(id) {
  let connection = Connection;
  try {
    await connection.connect();
    const db = connection.pipeline(_dbusers);
    const doc = await db.findOne(
      { "meta.pubId": id },
      { projection: { _id: 1 } }
    );
    return doc?._id;
  } catch (err) {
    throw err;
  } finally {
    if (connection) connection.close();
  }
}
// locate id with pubid

export async function querygetonemerchant(id, projection) {
  let connection = Connection;
  try {
    await connection.connect();
    const db = connection.pipeline(_dbusers);
    const query = { _id: id };
    const doc = await db.findOne(query, { projection });
    return doc;
  } catch (err) {
    throw err;
  } finally {
    if (connection) connection.close();
  }
}
// get one merchant

export async function querygetallcampaignspermerchant(
  projection,
  query,
  page,
  size
) {
  let connection = Connection;
  try {
    await connection.connect();
    const db = connection.pipeline(_dbcampaigns);
    const doc = await db
      .find(query, { projection })
      .limit(size)
      .skip(page)
      .toArray();
    return doc;
  } catch (err) {
    throw err;
  } finally {
    if (connection) connection.close();
  }
}
// get all campaigns per merchant

export async function querygetcamaignsmerchant(_admin) {
  let connection = Connection;
  try {
    await connection.connect();
    const db = connection.pipeline(_dbcampaigns);
    const query = { _admin };
    const options = {
      projection: {
        _id: 0,
        "users.count": 1,
        "promotion.ispromotion": 1,
        "promotion.promotion.active.plan": 1,
        _istrashed: 1,
        _isstopped: 1,
        isActive: 1,
        pubId: 1,
        "meta.title": 1,
        "meta.value": 1,
        "meta.startDate": 1,
        "meta.endDate": 1,
        "meta.discount": 1,
        "meta.cover": 1,
        reviews: 1,
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
// get campaigns merhant

export async function querygetpromotionsmerchant(_admin) {
  let connection = Connection;
  try {
    await connection.connect();
    const db = connection.pipeline(_dbcampaigns);
    const query = { _admin, "promotion.ispromotion": true };
    const options = {
      projection: {
        _id: 0,
        "users.count": 1,
        "promotion.promotion.active.plan": 1,
        isActive: 1,
        pubId: 1,
        "meta.title": 1,
        "meta.value": 1,
        "meta.startDate": 1,
        "meta.endDate": 1,
        "meta.discount": 1,
        "meta.cover": 1,
        reviews: 1,
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
// get promotions merhant

export async function querygetdpcampaignInfo(pubId) {
  let connection = Connection;
  try {
    await connection.connect();
    const db = connection.pipeline(_dbcampaigns);
    const query = { pubId };
    const options = {
      projection: {
        _id: 0,
        users: 0,
        promotion: 0,
        _istrashed: 0,
        _isstopped: 0,
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
// get campaign info [duplicate campaign]

export async function querygetcampaignTOreactivate(pubId) {
  let connection = Connection;
  try {
    await connection.connect();
    const db = connection.pipeline(_dbcampaigns);
    const query = { pubId };
    const options = {
      projection: { "meta.startDate": 1, "meta.endDate": 1, _admin: 1 },
    };
    const doc = await db.findOne(query, options);
    return doc;
  } catch (err) {
    throw err;
  } finally {
    if (connection) connection.close();
  }
}
// get campaign to reactivate

export async function querygetmerchantOnboarding(id) {
  let connection = Connection;
  try {
    await connection.connect();
    const db = connection.pipeline(_dbusers);
    const query = { _id: id, "meta.type": _usertypeA };
    const options = {
      projection: { _connectedId: 1, isCompletedOnboarding: 1 },
    };
    const doc = await db.findOne(query, options);
    return doc;
  } catch (err) {
    throw err;
  } finally {
    if (connection) connection.close();
  }
}
// get merchant onboarding
