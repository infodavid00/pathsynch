import Response from "../../../utils/response.js";
import dates from "../../../utils/dates.js";
import {
  queryGetTransactionDetails,
  querygetTransactions,
} from "../../../models/admin/get.js";

let currentDate = dates(new Date());
let response = (message) => new Response(message);

export async function getTransations(rq, rs, pass) {
  const { page: pageq, size: sizeq } = await rq.query;
  const { date } = await rq.params;
  let refactoredDate = dates(new Date(date));
  const size = Number(sizeq) || 10;
  const page = Number(pageq) * size || 0;

  try {
    const docs = await querygetTransactions(page, size, refactoredDate);
    rs.status(200).json(response("ok").success(docs));
  } catch (err) {
    pass(err);
  }
}

export async function getTransactionsDetails(rq, rs, pass) {
  const { ddmmyy } = await rq.params;
  if (ddmmyy === "DD" || ddmmyy === "MM" || ddmmyy === "YYYY") {
    try {
      const docs = await queryGetTransactionDetails(ddmmyy); // get the docs
      if (docs !== null) {
        let totalRevenue,
          merchantRevenue,
          pathsynchRevenue,
          campaignSold,
          totalDiscount,
          totalCouponUsed;

        totalRevenue = docs.reduce(
          (accumulator, currentVal) =>
            accumulator + currentVal.amount.pricePaid,
          0
        ); // total money made
        merchantRevenue = docs.reduce(
          (accumulator, currentVal) => accumulator + currentVal.amount.M_payout,
          0
        ); // total cash made [merchant payout]
        pathsynchRevenue = docs.reduce(
          (accumulator, currentVal) =>
            accumulator + currentVal.amount.PS_payout,
          0
        ); // total cash made [ps payout]
        campaignSold = docs.length;
        //   number or campaigns sold
        totalDiscount = docs.reduce(
          (accumulator, currentVal) =>
            accumulator + currentVal.discountPercentage ??
            0 + currentVal.coupon.CouponPercentage ??
            0,
          0
        );
        //  total discount percantage added together
        totalCouponUsed = docs.filter(
          (currentObj) => currentObj.coupon.couponName !== null
        ).length;
        //  total coupon used

        rs.status(200).json(
          response(true).success({
            totalRevenue,
            merchantRevenue,
            pathsynchRevenue,
            campaignSold,
            totalDiscount,
            totalCouponUsed,
          })
        );
      } else {
        let message = "nothing to return.";
        rs.status(404).json(response(message).warn());
      }
    } catch (err) {
      pass(err);
    }
  } else {
    let message = ":ddmmyy can only be DD, MM or YYYY";
    rs.status(400).json(response(message).warn());
  }
}
// get transactions details
