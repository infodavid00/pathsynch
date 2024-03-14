import {
  queryfindcampaigncover,
  queryfindcampaignsusigncoupon,
  queryfindmerchantlogo,
  querygetcoupon,
  querygetcoupondetails,
  querygetcoupons,
} from "../../../models/admin/get.js";
import Response from "../../../utils/response.js";
import dates from "../../../utils/dates.js";

const response = (message) => new Response(message);

export async function getcoupons(rq, rs, pass) {
  try {
    const { page: pageq, size: sizeq, type } = await rq.query;
    const size = Number(sizeq) || 10;
    const page = Number(pageq) * size || 0;

    const GET = await querygetcoupons(page, size, type);
    let message = "ok";
    rs.status(200).json(response(message).success(GET));
  } catch (err) {
    pass(err);
  }
}
// get coupons

export async function getcoupon(rq, rs, pass) {
  try {
    const { code } = await rq.params;
    const GET = await querygetcoupon(code);
    let message = "ok";
    rs.status(200).json(response(message).success(GET));
  } catch (err) {
    pass(err);
  }
}
// get coupon

export async function getcampaignsusingcoupon(rq, rs, pass) {
  try {
    const { coupon } = await rq.params;
    const campaignslists = await queryfindcampaignsusigncoupon(coupon);
    if (campaignslists.length !== 0) {
      const campaigns = [];
      const campaignids = [];
      campaignslists.map((elem) => {
        campaigns.push({
          pubId: elem.campaignId,
          cover: null,
          count: 1,
        });
        campaignids.push(elem.campaignId);
      });

      let covers = await queryfindcampaigncover(campaignids);

      for (let i = 0; i < campaigns.length; i++) {
        covers &&
          covers.map((elem) =>
            elem.pubId === campaigns[i].pubId
              ? (campaigns[i].cover = elem.meta.cover)
              : void 0
          );
      } // add cover to campaigns
      let final = [];

      if (campaigns.length > 1) {
        campaigns.map((elem) => {
          for (let k = 0; k < final.length; k++) {
            if (elem.pubId === final[i].pubId) {
              for (let i = 0; i < final.length; i++) {
                final[i].pubId === elem.pubId ? final[i].count++ : void 0;
              }
            } else {
              final.push(elem);
            }
          }
        }); // transform the output
      } else {
        final = campaigns;
      }
      let message = true;
      rs.status(200).json(response(message).success(final));
    } else {
      let message = "coupon does not exists || not being used";
      rs.status(404).json(response(message).warn());
    }
  } catch (err) {
    pass(err);
  }
}
// get campaigns using coupons

export async function getcoupondetails(rq, rs, pass) {
  try {
    const { date } = await rq.params;
    const { type } = await rq.query;
    if (date === "DD" || date === "MM" || date === "YYYY") {
      let day = dates(new Date()).split("/");
      const coupons = await querygetcoupondetails(type);

      if (coupons !== null) {
        let totalNoofCouponsArr = [];
        coupons.forEach((elem) =>
          totalNoofCouponsArr.push(elem.noOfCoupon.total)
        );
        let totalNumberofCoupons = totalNoofCouponsArr.reduce(
          (accumulator, currentValue) => accumulator + currentValue,
          0
        );

        let totalNumberRedeemed;
        let redeemedList = [];

        if (date === "DD") {
          coupons.forEach((elem) => {
            let newredeem = elem.redeems.filter(
              (redeem) =>
                redeem.stamp[0] == day[0] &&
                redeem.stamp[1] == day[1] &&
                redeem.stamp[2] == day[2]
            );
            redeemedList = redeemedList.concat(newredeem);
          });
        } else if (date === "MM") {
          coupons.forEach((elem) => {
            let newredeem = elem.redeems.filter(
              (redeem) => redeem.stamp[1] == day[1] && redeem.stamp[2] == day[2]
            );
            redeemedList = redeemedList.concat(newredeem);
          });
        } else if (date === "YYYY") {
          coupons.forEach((elem) => {
            let newredeem = elem.redeems.filter(
              (redeem) => redeem.stamp[2] == day[2]
            );
            redeemedList = redeemedList.concat(newredeem);
          });
        }

        totalNumberRedeemed = redeemedList.length;

        let message = "ok";
        rs.status(200).json(
          response(message).success({
            totalNumberofCoupons,
            totalNumberRedeemed,
          })
        );
      } else {
        let message = "nothing to return";
        rs.status(404).json(response(message).warn());
      }
    } else {
      let message = "date can only be DD, MM or YYYY";
      rs.status(400).json(response(message).warn());
    }
  } catch (err) {
    pass(err);
  }
}
// get coupon details
