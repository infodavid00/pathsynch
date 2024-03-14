import dates from "../../utils/dates.js";

class Coupon {
  constructor(body) {
    this.body = body;
  }

  create() {
    let obj = {
      status: 1,
      couponName: this.body.couponName,
      noOfCoupon: { avail: this.body.noOfCoupon, total: this.body.noOfCoupon },
      redeems: [],
      limitOfPrice: this.body.limitOfPrice,
      voucherType: this.body.voucherType,
      discounts: this.body.discounts,
      code: this.body.code,
      startDate: dates(new Date(this.body.startDate)),
      endDate: dates(new Date(this.body.endDate)),
    };
    return obj;
  }
}

export default Coupon;
