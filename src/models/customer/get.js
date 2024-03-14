import Connection from "../../.config/connection/db.js";
import { _dbusers } from "../../.config/var/connection.js";
import { _appname, _usertypeB } from "../../.config/var/application.js";

export async function getiscompletedstatus(id) {
  let connection = Connection;
  try {
    await connection.connect();
    const db = connection.pipeline(_dbusers);
    const query = { _id: id, "auth.isVerified": true, "meta.type": _usertypeB };
    const options = { projection: { _id: 0, "metrics.profilestatus": 1 } };
    const doc = await db.findOne(query, options);
    return doc;
  } catch (err) {
    throw err;
  } finally {
    if (connection) connection.close();
  }
}
// query getiscompletedstatus

export async function querygetpersonalization(id) {
  let connection = Connection;
  try {
    await connection.connect();
    const db = connection.pipeline(_dbusers);
    const query = { _id: id, "auth.isVerified": true, "meta.type": _usertypeB };
    const options = { projection: { _id: 0, "user.personalization": 1 } };
    const doc = await db.findOne(query, options);
    return doc;
  } catch (err) {
    throw err;
  } finally {
    if (connection) connection.close();
  }
}
// get personalization

export async function querygetpathpoints(id) {
  let connection = Connection;
  try {
    await connection.connect();
    const db = connection.pipeline(_dbusers);
    const query = { _id: id, "auth.isVerified": true, "meta.type": _usertypeB };
    const options = { projection: { _id: 0, "user.path.points": 1 } };
    const doc = await db.findOne(query, options);
    return doc;
  } catch (err) {
    throw err;
  } finally {
    if (connection) connection.close();
  }
}
// get pathpoints

export async function querygetreferalLink(id) {
  let connection = Connection;
  try {
    await connection.connect();
    const db = connection.pipeline(_dbusers);
    const query = { _id: id, "auth.isVerified": true, "meta.type": _usertypeB };
    const options = { projection: { _id: 0, "user.referal.id": 1 } };
    const doc = await db.findOne(query, options);
    return doc;
  } catch (err) {
    throw err;
  } finally {
    if (connection) connection.close();
  }
}
// get referalLink

export async function cipetn(id) {
  let connection = Connection;
  try {
    await connection.connect();
    const db = connection.pipeline(_dbusers);
    const query = { _id: id, "auth.isVerified": true, "meta.type": _usertypeB };
    const options = { projection: { _id: 0, "meta.profile": 1 } };
    const doc = await db.findOne(query, options);
    return doc?.meta?.profile ?? null;
  } catch (err) {
    throw err;
  } finally {
    if (connection) connection.close();
  }
}
// check if profile equal to null model

export async function querygetcustomerinfo(id, projection) {
  let connection = Connection;
  try {
    await connection.connect();
    const db = connection.pipeline(_dbusers);
    const query = { _id: id, "auth.isVerified": true, "meta.type": _usertypeB };
    let options = { projection };
    const doc = await db.findOne(query, options);
    return doc;
  } catch (err) {
    throw err;
  } finally {
    if (connection) connection.close();
  }
}
// get customer info

export async function querygetlocationAccessSignup(id) {
  let connection = Connection;
  try {
    await connection.connect();
    const db = connection.pipeline(_dbusers);
    const query = { _id: id, "auth.isVerified": true, "meta.type": _usertypeB };
    let options = { projection: { "user.locationAccess": 1 } };
    const doc = await db.findOne(query, options);
    return doc;
  } catch (err) {
    throw err;
  } finally {
    if (connection) connection.close();
  }
}
// get location access [signup]
