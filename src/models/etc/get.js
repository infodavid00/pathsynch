// import Connection from "../../.config/connection/db.js";
// import { _dbusers, _dbname } from "../../.config/var/connection.js";
// import { _appname, _usertypeA } from "../../.config/var/application.js";

// export async function mobilelookup(mobile) {
//   let connection = Connection;
//   try {
//     await connection.connect();
//     const db = connection.pipeline(_dbusers);
//     const query = { "meta.mobile": mobile, "auth.isVerified": true };
//     const options = { projection: { _id: 1 } };
//     const doc = await db.findOne(query, options);
//     return doc;
//   } catch (err) {
//     throw err;
//   } finally {
//     if (connection) connection.close();
//   }
// }
// // mobile lookup

// export async function emaillookup(email) {
//   let connection = Connection;
//   try {
//     await connection.connect();
//     const db = connection.pipeline(_dbusers);
//     const query = { "meta.email": email, "auth.isVerified": true };
//     const options = { projection: { _id: 1 } };
//     const doc = await db.findOne(query, options);
//     return doc;
//   } catch (err) {
//     throw err;
//   } finally {
//     if (connection) connection.close();
//   }
// }
// // email lookup

// export async function isverifiedlookup(id) {
//   let connection = Connection;
//   try {
//     await connection.connect();
//     const db = connection.pipeline(_dbusers);
//     const query = { _id: id };
//     const options = { projection: { "auth.isVerified": 1 } };
//     const doc = await db.findOne(query, options);
//     if (doc?.auth?.isVerified === true) {
//       return true;
//     } else {
//       return false;
//     }
//   } catch (err) {
//     throw err;
//   } finally {
//     if (connection) connection.close();
//   }
// }
// // isverified lookup

// export async function accountdefaultlookup(mobile) {
//   let connection = Connection;
//   try {
//     await connection.connect();
//     const db = connection.pipeline(_dbusers);
//     const query = {
//       "meta.mobile": mobile,
//       "auth.isVerified": true,
//       "auth.issuer.issuedBy": _appname,
//     };
//     const options = {
//       projection: { _id: 1, "meta.type": 1, "auth.password": 1 },
//     };
//     const doc = await db.findOne(query, options);
//     return doc;
//   } catch (err) {
//     throw err;
//   } finally {
//     if (connection) connection.close();
//   }
// }
// // account default lookup

// export async function accountmerchantdefaultlookup(email) {
//   let connection = Connection;
//   try {
//     await connection.connect();
//     const db = connection.pipeline(_dbusers);
//     const query = {
//       "meta.email": email,
//       "auth.isVerified": true,
//       "auth.issuer.issuedBy": _appname,
//       "meta.type": _usertypeA,
//     };
//     const options = {
//       projection: { _id: 1, "meta.type": 1, "auth.password": 1 },
//     };
//     const doc = await db.findOne(query, options);
//     return doc;
//   } catch (err) {
//     throw err;
//   } finally {
//     if (connection) connection.close();
//   }
// }
// // account merchant default lookup

// export async function accountoauthlookup(uid, email, issuer) {
//   let connection = Connection;
//   try {
//     await connection.connect();
//     const db = connection.pipeline(_dbusers);
//     const query = {
//       "meta.email": email,
//       "auth.isVerified": true,
//       "auth.issuer.issuedBy": issuer,
//       "auth.issuer.uid": uid,
//     };
//     const options = { projection: { _id: 1, "meta.type": 1 } };
//     const doc = await db.findOne(query, options);
//     return doc;
//   } catch (err) {
//     throw err;
//   } finally {
//     if (connection) connection.close();
//   }
// }
// // account oauth lookup

// export async function mobilelookupforgottenpsw(mobile) {
//   let connection = Connection;
//   try {
//     await connection.connect();
//     const db = connection.pipeline(_dbusers);
//     const query = {
//       "meta.mobile": mobile,
//       "auth.isVerified": true,
//       "auth.issuer.issuedBy": _appname,
//     };
//     const options = { projection: { _id: 1 } };
//     const doc = await db.findOne(query, options);
//     return doc;
//   } catch (err) {
//     throw err;
//   } finally {
//     if (connection) connection.close();
//   }
// }
// // mobile lookup for forgotten password

// export async function emaillookupforgottenpsw(email) {
//   let connection = Connection;
//   try {
//     await connection.connect();
//     const db = connection.pipeline(_dbusers);
//     const query = {
//       "meta.email": email,
//       "auth.isVerified": true,
//       "auth.issuer.issuedBy": _appname,
//       "meta.type": _usertypeA,
//     };
//     const options = { projection: { _id: 1, "meta.name.fname": 1 } };
//     const doc = await db.findOne(query, options);
//     return doc;
//   } catch (err) {
//     throw err;
//   } finally {
//     if (connection) connection.close();
//   }
// }
// // email lookup for forgotten password
