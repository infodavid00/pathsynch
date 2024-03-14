import Connection from "../../.config/connection/db.js";
import { _dbcontacts, _dbsupports } from "../../.config/var/connection.js";

export async function querycontact(schema) {
  let connection = Connection;
  try {
    await connection.connect();
    const db = connection.pipeline(_dbcontacts);
    await db.insertOne(schema);
    return true;
  } catch (err) {
    throw err;
  } finally {
    if (connection) connection.close();
  }
}
// query contact

export default async function querysupport(schema) {
  let connection = Connection;
  try {
    await connection.connect();
    const db = connection.pipeline(_dbsupports);
    await db.insertOne(schema);
    return true;
  } catch (err) {
    throw err;
  } finally {
    if (connection) connection.close();
  }
}
// query support
