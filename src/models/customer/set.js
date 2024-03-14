import Connection from "../../.config/connection/db.js";
import { _dbusers } from "../../.config/var/connection.js";
import { _appname, _usertypeB } from "../../.config/var/application.js";
import dates from "../../utils/dates.js";

export async function checkiffirstpersonalization(id) {
  let connection = Connection;
  try {
    await connection.connect();
    const db = connection.pipeline(_dbusers);
    const query = {
      _id: id,
      "auth.isVerified": true,
      "meta.type": _usertypeB,
      "user.personalization": [],
      "metrics.isCUI": false,
    };
    const option = { projection: { _id: 1 } };
    const result = await db.findOne(query, option);
    return result;
  } catch (err) {
    throw err;
  } finally {
    if (connection) connection.close();
  }
}
// check if first personalization

export async function querypersonalization(id, schema) {
  let connection = Connection;
  try {
    await connection.connect();
    const db = connection.pipeline(_dbusers);
    const query = {
      _id: id,
      "auth.isVerified": true,
      "meta.type": _usertypeB,
      "user.personalization": [],
      "metrics.isCUI": false,
    };
    const option = {
      $set: {
        "user.personalization": schema,
        "meta.lastupdateAt": dates(new Date()),
      },
      $inc: { "metrics.profilestatus": 40 },
    };
    const result = await db.updateOne(query, option);
    return result.modifiedCount == 1 ? true : false;
  } catch (err) {
    throw err;
  } finally {
    if (connection) connection.close();
  }
}
// update personalization

export async function reupdatepersonalization(id, schema) {
  let connection = Connection;
  try {
    await connection.connect();
    const db = connection.pipeline(_dbusers);
    const query = {
      _id: id,
      "auth.isVerified": true,
      "meta.type": _usertypeB,
    };
    const option = {
      $set: {
        "user.personalization": schema,
        "meta.lastupdateAt": dates(new Date()),
      },
    };
    const result = await db.updateOne(query, option);
    return result.modifiedCount == 1 ? true : false;
  } catch (err) {
    throw err;
  } finally {
    if (connection) connection.close();
  }
}
// re update personalization

export async function queryeditprofile(id, data) {
  let connection = Connection;
  try {
    await connection.connect();
    const db = connection.pipeline(_dbusers);
    const query = { _id: id, "auth.isVerified": true, "meta.type": _usertypeB };
    await db.updateOne(query, data);
    return true;
  } catch (err) {
    throw err;
  } finally {
    if (connection) connection.close();
  }
}
// edit profile

export async function setprofilepoints(id) {
  let connection = Connection;
  try {
    await connection.connect();
    const db = connection.pipeline(_dbusers);
    const query = { _id: id, "auth.isVerified": true, "meta.type": _usertypeB };
    let data = { $inc: { "metrics.profilestatus": 20 } };
    await db.updateOne(query, data);
    return true;
  } catch (err) {
    throw err;
  } finally {
    if (connection) connection.close();
  }
}
// set profile points

export async function queryuserafpers(id) {
  let connection = Connection;
  try {
    await connection.connect();
    const db = connection.pipeline(_dbusers);
    const query = { _id: id, "auth.isVerified": true, "meta.type": _usertypeB };
    let data = {
      $set: { "metrics.isCUI": true, "meta.lastupdateAt": dates(new Date()) },
      $inc: { "user.path.points": 2 },
    };
    await db.updateOne(query, data);
    return true;
  } catch (err) {
    throw err;
  } finally {
    if (connection) connection.close();
  }
}
// query and credit user for profile completation.

export async function insertLocationAcessSignup(id, data) {
  let connection = Connection;
  try {
    await connection.connect();
    const db = connection.pipeline(_dbusers);
    const query = { _id: id, "auth.isVerified": true, "meta.type": _usertypeB };
    const update = {
      $set: { "user.locationAccess": data },
      $inc: { "user.path.points": 1 },
    };
    await db.updateOne(query, update);
    return true;
  } catch (err) {
    throw err;
  } finally {
    if (connection) connection.close();
  }
}
// insert Location access [signup]

export async function topupPathPointsAfterFollowingModel(id) {
  let connection = Connection;
  try {
    await connection.connect();
    const db = connection.pipeline(_dbusers);
    const query = { _id: id, "auth.isVerified": true, "meta.type": _usertypeB };
    const update = { $inc: { "user.path.points": 1 } };
    await db.updateOne(query, update);
    return true;
  } catch (err) {
    throw err;
  } finally {
    if (connection) connection.close();
  }
}
// top up path points after following social
