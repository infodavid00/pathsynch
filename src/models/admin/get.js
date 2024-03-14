import Connection from "../../.config/connection/db.js";
import {
  _dbcampaigns,
  _dbcoupons,
  _dbpromotions,
  _dbsales,
  _dbsupports,
  _dbusers,
} from "../../.config/var/connection.js";
import { _usertypeB } from "../../.config/var/application.js";
import dates from "../../utils/dates.js";
import { getCurrentWeek, getLastWeek } from "../../utils/comparedate.js";

export async function couponNameCheck(couponName, code) {
  let connection = Connection;
  try {
    await connection.connect();
    const db = connection.pipeline(_dbcoupons);
    const query = { $or: [{ couponName }, { code }] };
    const options = { projection: { _id: 1 } };
    const doc = await db.findOne(query, options);
    return doc;
  } catch (err) {
    throw err;
  } finally {
    if (connection) connection.close();
  }
}
// coupon name check

export async function querygetcoupons(page, size, q) {
  let connection = Connection;
  try {
    await connection.connect();
    const db = connection.pipeline(_dbcoupons);

    const query = {};
    if (q && q.toLowerCase() === "membership")
      query.voucherType = { $in: ["membership"] };
    if (q && q.toLowerCase() === "online")
      query.voucherType = { $in: ["online"] };
    if (q && q.toLowerCase() === "instore")
      query.voucherType = { $in: ["instore"] };
    if (q && q.toLowerCase() === "mysterygift")
      query.voucherType = { $in: ["mysterygift"] };

    const options = {
      projection: { startDate: 0, endDate: 0, couponUsed: 0, redeems: 0 },
    };
    const doc = await db.find(query, options).skip(page).limit(size).toArray();
    return doc;
  } catch (err) {
    throw err;
  } finally {
    if (connection) connection.close();
  }
}
// get coupons

export async function querygetcoupon(code) {
  let connection = Connection;
  try {
    await connection.connect();
    const db = connection.pipeline(_dbcoupons);
    const query = { code };
    const options = { projection: { redeems: 0 } };
    let doc = await db.findOne(query, options);
    return doc;
  } catch (err) {
    throw err;
  } finally {
    if (connection) connection.close();
  }
}
// get coupon

export async function queryfindcampaignsusigncoupon(coupon) {
  let connection = Connection;
  try {
    await connection.connect();
    const db = connection.pipeline(_dbsales);
    const query = { "coupon.couponName": coupon };
    const option = { projection: { campaignId: 1 } };
    let doc = await db.find(query, option).toArray();
    return doc;
  } catch (err) {
    throw err;
  } finally {
    if (connection) connection.close();
  }
}
// get campaign using coupons

export async function queryfindcampaigncover(pubId) {
  let connection = Connection;
  try {
    await connection.connect();
    const db = connection.pipeline(_dbcampaigns);
    const query = { pubId: { $in: pubId } };
    const option = { projection: { "meta.cover": 1, pubId: 1 } };
    let doc = await db.find(query, option).toArray();
    return doc;
  } catch (err) {
    throw err;
  } finally {
    if (connection) connection.close();
  }
}
// get campaign cover

export async function queryfindmerchantlogo(_id) {
  let connection = Connection;
  try {
    await connection.connect();
    const db = connection.pipeline(_dbusers);
    const query = { _id };
    const option = { projection: { "meta.profile": 1, "meta.pubId": 1 } };
    let doc = await db.find(query, option).toArray();
    return doc;
  } catch (err) {
    throw err;
  } finally {
    if (connection) connection.close();
  }
}
// get merchant logo

export async function querygetcoupondetails(type) {
  let connection = Connection;
  try {
    await connection.connect();
    const db = connection.pipeline(_dbcoupons);

    const query = {};
    if (type && type.toLowerCase() === "membership")
      query.voucherType = { $in: ["membership"] };
    if (type && type.toLowerCase() === "online")
      query.voucherType = { $in: ["online"] };
    if (type && type.toLowerCase() === "instore")
      query.voucherType = { $in: ["instore"] };
    if (type && type.toLowerCase() === "mystery-gift")
      query.voucherType = { $in: ["mystery-gift"] };

    const options = {
      projection: { "noOfCoupon.total": 1, redeems: 1 },
    };

    const doc = await db.find(query, options).toArray();
    return doc;
  } catch (err) {
    throw err;
  } finally {
    if (connection) connection.close();
  }
}
// get coupon details

export async function queryGetPromotionsInfo(date, dmy) {
  let connection = Connection;
  try {
    await connection.connect();
    const db = connection.pipeline(_dbpromotions);
    const query = { date: { $regex: "/" } };
    let datehelper = dates(new Date()).split("/");
    if (date == "DD")
      query.date.$regex = `${dmy}/${datehelper[1]}/${datehelper[2]}`;
    if (date == "MM") query.date.$regex = `${dmy}/${datehelper[2]}`;
    if (date == "YYYY") query.date.$regex = `${dmy}`;
    const doc = await db.find(query, { price: 1, coupon: 1 }).toArray();
    return doc;
  } catch (err) {
    throw err;
  } finally {
    if (connection) connection.close();
  }
}
// get promotions details

export async function queryGetPromotions(size, page, date, dmy, type) {
  let connection = Connection;
  try {
    await connection.connect();
    const db = connection.pipeline(_dbpromotions);
    const query = { date: { $regex: "/" } };
    let datehelper = dates(new Date()).split("/");
    if (date == "DD")
      query.date.$regex = `${dmy}/${datehelper[1]}/${datehelper[2]}`;
    if (date == "MM") query.date.$regex = `${dmy}/${datehelper[2]}`;
    if (date == "YYYY") query.date.$regex = `${dmy}`;
    if (type !== null) query.planS = type;
    const doc = await db.find(query).skip(page).limit(size).toArray();
    return doc;
  } catch (err) {
    throw err;
  } finally {
    if (connection) connection.close();
  }
}
// get promotions

export async function queryPromotionsTotalRevenue() {
  let connection = Connection;
  try {
    await connection.connect();
    const db = connection.pipeline(_dbpromotions);
    const query = {};
    const options = { projection: { paidAmount: 1 } };
    const doc = await db.find(query, options).toArray();
    return doc;
  } catch (err) {
    throw err;
  } finally {
    if (connection) connection.close();
  }
}
// get promotions total revenue

export async function querygetTransactions(page, size, date) {
  let connection = Connection;
  try {
    await connection.connect();
    const db = connection.pipeline(_dbsales);
    const query = { timestamp: { $regex: date } };
    const options = { projection: { transactionId: 0 } };
    const doc = await db.find(query, options).skip(page).limit(size).toArray();
    return doc;
  } catch (err) {
    throw err;
  } finally {
    if (connection) connection.close();
  }
}
// get transactions

export async function queryGetTransactionDetails(date) {
  let connection = Connection;
  try {
    await connection.connect();
    const db = connection.pipeline(_dbsales);
    const query = { timestamp: { $regex: "/" } };
    let datehelper = dates(new Date()).split("/");
    if (date == "DD")
      query.timestamp.$regex = `${datehelper[0]}/${datehelper[1]}/${datehelper[2]}`;
    if (date == "MM")
      query.timestamp.$regex = `${datehelper[1]}/${datehelper[2]}`;
    if (date == "YYYY") query.timestamp.$regex = `${datehelper[2]}`;

    let options = {
      projection: { amount: 1, discountPercentage: 1, coupon: 1 },
    };
    const doc = await db.find(query, options).toArray();
    return doc;
  } catch (err) {
    throw err;
  } finally {
    if (connection) connection.close();
  }
}
// get transaction details

export async function querygetcampaignAdmin(page, size, type) {
  let connection = Connection;
  try {
    await connection.connect();
    const db = connection.pipeline(_dbcampaigns);
    const query = {};
    if (type && type.toLowerCase() === "membership")
      query["meta.options"] = { $in: ["membership"] };
    if (type && type.toLowerCase() === "online")
      query["meta.options"] = { $in: ["online"] };
    if (type && type.toLowerCase() === "instore")
      query["meta.options"] = { $in: ["instore"] };
    if (type && type.toLowerCase() === "mystery-gift")
      query["meta.options"] = { $in: ["mystery-gift"] };

    const options = {
      projection: {
        "meta.cover": 1,
        "meta.title": 1,
        "users.count": 1,
        "meta.options": 1,
        "meta.value": 1,
        "meta.startDate": 1,
        pubId: 1,
        _admin: 1,
      },
    };
    const doc = await db.find(query, options).skip(page).limit(size).toArray();
    return doc;
  } catch (err) {
    throw err;
  } finally {
    if (connection) connection.close();
  }
}
// get campaign admin

export async function querygetLogoforCampaignsMAd(ids) {
  let connection = Connection;
  try {
    await connection.connect();
    const db = connection.pipeline(_dbusers);
    const query = { _id: { $in: ids } };
    const options = { projection: { "meta.logo": 1, _id: 1 } };
    const doc = await db.find(query, options).toArray();
    return doc;
  } catch (err) {
    throw err;
  } finally {
    if (connection) connection.close();
  }
}
// get logo for campaigns merchant admin

export async function querygetifCampaignUsedCoupon(ids) {
  let connection = Connection;
  try {
    await connection.connect();
    const db = connection.pipeline(_dbsales);
    const query = {
      campaignId: { $in: ids },
      "coupon.couponName": { $ne: null },
    };
    const options = { projection: { campaignId: 1, _id: 0 } };
    const doc = await db.find(query, options).toArray();
    return doc;
  } catch (err) {
    throw err;
  } finally {
    if (connection) connection.close();
  }
}
// get if campaign used coupon

export async function queryGetCampaignDetailsSales(date) {
  let connection = Connection;
  try {
    await connection.connect();
    const db = connection.pipeline(_dbsales);
    const query = { timestamp: { $regex: "/" } };
    let datehelper = dates(new Date()).split("/");
    if (date == "DD")
      query.timestamp.$regex = `${datehelper[0]}/${datehelper[1]}/${datehelper[2]}`;

    if (date == "WW")
      query.timestamp.$regex = new RegExp(
        getCurrentWeek().join("|").replace(/\//g, "\\/"),
        "i"
      ); // 'i' for case-insensitive;

    if (date == "MM")
      query.timestamp.$regex = `${datehelper[1]}/${datehelper[2]}`;
    if (date == "YYYY") query.timestamp.$regex = `${datehelper[2]}`;
    let options = { projection: { "amount.pricePaid": 1 } };
    const doc = await db.find(query, options).toArray();
    return doc;
  } catch (err) {
    throw err;
  } finally {
    if (connection) connection.close();
  }
}
// get campaign details sales

export async function queryGetCampaignDetailsCustomers() {
  let connection = Connection;
  try {
    await connection.connect();
    const db = connection.pipeline(_dbusers);
    const query = { "meta.type": _usertypeB };
    let options = { projection: { _id: 1 } };
    const doc = await db.find(query, options).toArray();
    return doc;
  } catch (err) {
    throw err;
  } finally {
    if (connection) connection.close();
  }
}
// get campaign details customers

export async function querygetsupport(page, size) {
  let connection = Connection;
  try {
    await connection.connect();
    const db = connection.pipeline(_dbsupports);
    const query = {};
    const doc = await db.find(query).skip(page).limit(size).toArray();
    return doc;
  } catch (err) {
    throw err;
  } finally {
    if (connection) connection.close();
  }
}
// get support

export async function queryMerchantDataCampaign(date, _admin) {
  let connection = Connection;
  try {
    await connection.connect();
    const db = connection.pipeline(_dbcampaigns);
    const query = {
      _admin,
      $or: [{ "meta.startDate": {} }, { "meta.startDate": {} }],
    };
    let datehelper = dates(new Date()).split("/");

    if (date == "DD") {
      query.$or[0]["meta.startDate"].$in = getCurrentWeek();
      query.$or[1]["meta.startDate"].$in = getLastWeek();
    }

    // if (date == "MM") {
    //   query.$or[0][
    //     "meta.startDate"
    //   ].$regex = `${datehelper[1]}/${datehelper[2]}`;

    //   let month = datehelper[1] - 1;
    //   query.$or[1]["meta.startDate"].$regex = `${
    //     datehelper[1] == "01" ? "12" : month
    //   }/${datehelper[2] - 1}`;
    // }
    if (date == "MM") {
      query.$or[0][
        "meta.startDate"
      ].$regex = `${datehelper[1]}/${datehelper[2]}`;

      let month = `${datehelper[1] - 1}`;
      function monthFormater() {
        let r;
        if (datehelper[1] == "01") {
          r = "12";
        } else {
          if (month.length === 1) {
            r = `0${month}`;
          } else {
            r = month;
          }
        }
        return r;
      }
      query.$or[1]["meta.startDate"].$regex = `${monthFormater()}/${
        datehelper[1] == "01" ? datehelper[2] - 1 : datehelper[2]
      }`;
    }

    if (date == "YYYY") {
      (query.$or[0]["meta.startDate"].$regex = `${datehelper[2]}`),
        (query.$or[1]["meta.startDate"].$regex = `${datehelper[2] - 1}`);
    }

    let options = {
      projection: {
        "meta.options": 1,
        _id: 0,
        isActive: 1,
        "meta.startDate": 1,
        "meta.endDate": 1,
        "promotion.ispromotion": 1,
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
// get merchant data campaign

export async function querygetmerchantcampaignAdmin(page, size, _admin) {
  let connection = Connection;
  try {
    await connection.connect();
    const db = connection.pipeline(_dbcampaigns);
    const query = { _admin };
    const options = {
      projection: {
        "meta.cover": 1,
        "meta.title": 1,
        "users.count": 1,
        "meta.options": 1,
        "meta.value": 1,
        "meta.startDate": 1,
        pubId: 1,
        _admin: 1,
        "promotion.ispromotion": 1,
      },
    };
    const doc = await db.find(query, options).skip(page).limit(size).toArray();
    return doc;
  } catch (err) {
    throw err;
  } finally {
    if (connection) connection.close();
  }
}
// get merchant campaign admin

export async function adminlocateIdwithPubid(pubId) {
  let connection = Connection;
  try {
    await connection.connect();
    const db = connection.pipeline(_dbusers);
    const query = { "meta.pubId": pubId };
    const options = { projection: { _id: 1 } };
    const doc = await db.findOne(query, options);
    return doc;
  } catch (err) {
    throw err;
  } finally {
    if (connection) connection.close();
  }
}
// locate id with pubid
