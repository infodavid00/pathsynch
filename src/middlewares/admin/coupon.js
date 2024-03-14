import Response from "../../utils/response.js";

const response = (message) => new Response(message);
export async function createCouponMW(rq, rs, pass) {
  const { couponName, noOfCoupon, limitOfPrice, voucherType, discounts, code } =
    await rq.body;
  if (
    couponName &&
    noOfCoupon &&
    limitOfPrice &&
    voucherType &&
    Array.isArray(voucherType) &&
    discounts &&
    code
  ) {
    pass();
  } else {
    let message = "ERR : body requirements not meet.";
    rs.status(200).json(response(message).warn());
  }
}
