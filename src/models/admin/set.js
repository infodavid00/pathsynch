import Connection from "../../.config/connection/db.js";
import {
  _dbcoupons,
  _dbpromotions,
  _dbsupports,
} from "../../.config/var/connection.js";

export async function querycoupon(schema) {
  let connection = Connection;
  try {
    await connection.connect();
    const db = connection.pipeline(_dbcoupons);
    await db.insertOne(schema);
    return true;
  } catch (err) {
    throw err;
  } finally {
    if (connection) connection.close();
  }
}
// query coupon

export async function querytooglecouponstatus(code, status) {
  let connection = Connection;
  try {
    await connection.connect();
    const db = connection.pipeline(_dbcoupons);
    const query = { code };
    const options = { $set: { status } };
    const update = await db.updateOne(query, options);
    return update.modifiedCount !== 0 ? true : false;
  } catch (err) {
    throw err;
  } finally {
    if (connection) connection.close();
  }
}
// query toogle coupon status

export async function querymarksupportasResponded(_id) {
  let connection = Connection;
  try {
    await connection.connect();
    const db = connection.pipeline(_dbsupports);
    const query = { _id };
    const option = { $set: { responded: true } };
    await db.updateOne(query, option);
    return true;
  } catch (err) {
    throw err;
  } finally {
    if (connection) connection.close();
  }
}
// mark support as responded
