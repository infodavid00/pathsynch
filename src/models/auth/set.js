import Connection from "../../.config/connection/db.js";
import { _dbusers, _dbname } from "../../.config/var/connection.js";
import { _appname, _usertypeA } from "../../.config/var/application.js";
import dates from "../../utils/dates.js";

export async function registeruser(schema) {
  let connection = Connection;
  try {
    await connection.connect();
    const db = connection.pipeline(_dbusers);
    await db.insertOne(schema);
    return true;
  } catch (err) {
    throw err;
  } finally {
    await connection.close();
  }
}
// registeruser

export async function verifyuser(id, ismerchant) {
  let connection = Connection;
  try {
    await connection.connect();
    const db = connection.pipeline(_dbusers);
    const query = { _id: id };
    const data = {
      $set: {
        "auth.isVerified": true,
        "meta.lastupdateAt": dates(new Date()),
      },
    };
    if (!ismerchant)
      data.$inc = { "metrics.profilestatus": 30, "user.path.points": 1 };
    const result = await db.updateOne(query, data);
    return result?.modifiedCount ? true : false;
  } catch (err) {
    throw err;
  } finally {
    await connection.close();
  }
}
// verifyuser

export async function updatepathforreferal(referal) {
  let connection = Connection;
  try {
    await connection.connect();
    const db = connection.pipeline(_dbusers);
    const query = { "user.referal.id": referal };
    const data = { $inc: { "user.path.points": 1 } };
    const result = await db.updateOne(query, data);
    if (result?.modifiedCount == 1) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    throw err;
  } finally {
    await connection.close();
  }
}
// update $path for referal

export async function addmobileforauth(id, mobile) {
  let connection = Connection;
  try {
    await connection.connect();
    const db = connection.pipeline(_dbusers);
    const query = { _id: id, "auth.isVerified": false };
    const data = { $set: { "meta.mobile": mobile } };
    const result = await db.updateOne(query, data);
    return result.modifiedCount == 1 ? true : false;
  } catch (err) {
    throw err;
  } finally {
    await connection.close();
  }
}
// add mobile number for oauth account type

// export async function updatemerchant(id, schema) {
//   let connection = Connection;
//   try {
//     await connection.connect();
//         const db = connection.pipeline(_dbusers);
//     const query = {
//       _id: id,
//       "auth.isVerified": true,
//       "meta.type": bh,
//       "merchant.meta.isCompleted": false,
//     };
//     const option = {
//       $set: {
//         "merchant.meta.data": schema,
//         "merchant.meta.isCompleted": true,
//         "metrics.isCUI": true,
//         "meta.lastupdateAt": new Date(),
//       },
//       $inc: { "metrics.profilestatus": 40 },
//     };
//     const result = await db.updateOne(query, option);
//     return result.modifiedCount == 1 ? true : false;
//   } catch (err) {
//     throw err;
//   } finally {
//      await connection.close();
//   }
// }
// // update merchant

export async function updatepassword(id, password) {
  let connection = Connection;
  try {
    await connection.connect();
    const db = connection.pipeline(_dbusers);
    const query = {
      _id: id,
      "auth.isVerified": true,
      "auth.issuer.issuedBy": _appname,
    };
    const option = { $set: { "auth.password": password } };
    const result = await db.updateOne(query, option);
    return result.modifiedCount == 1 ? true : false;
  } catch (err) {
    throw err;
  } finally {
    await connection.close();
  }
}
//update password

export async function addStripeConnectedid(id, _connectedId) {
  let connection = Connection;
  try {
    await connection.connect();
    const db = connection.pipeline(_dbusers);
    const query = { _id: id };
    const data = { $set: { _connectedId, isCompletedOnboarding: false } };
    await db.updateOne(query, data);
    return true;
  } catch (err) {
    throw err;
  } finally {
    await connection.close();
  }
}
// add stripe connected id
