import { couponNameCheck } from "../../../models/admin/get.js";
import {
  querycoupon,
  querytooglecouponstatus,
} from "../../../models/admin/set.js";
import Coupon from "../../../schema/admin/coupon.js";
import Response from "../../../utils/response.js";

const response = (message) => new Response(message);

export async function createCoupon(rq, rs, pass) {
  try {
    const body = await rq.body;
    const schema = new Coupon(body).create();
    /* check if coupon name exists. */
    const nameLookup = await couponNameCheck(schema.couponName, schema.code);
    if (nameLookup === null) {
      /* insert to db since coupon dont exist. */
      await querycoupon(schema);
      rs.status(200).json(response("ok").success());
    } else {
      let message = "coupon already exists.";
      rs.status(403).json(response(message));
    }
  } catch (err) {
    pass(err);
  }
}
// create coupon

export async function tooglecouponstatus(rq, rs, pass) {
  try {
    const { code } = await rq.params;
    const { status } = await rq.query;
    let querystatus;
    Number(status) === 1 ? (querystatus = 1) : (querystatus = 0);
    const toogle = await querytooglecouponstatus(code, querystatus);
    if (toogle) {
      rs.status(200).json(response("ok").success());
    } else {
      let message = "coupon does not exists.";
      rs.status(404).json(response(message).warn());
    }
  } catch (err) {
    pass(err);
  }
}
// toogle coupon status
