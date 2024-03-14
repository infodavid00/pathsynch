import {
  getcampaignpromotionInfo,
  getcouponinfo,
} from "../../models/campaigns/get.js";
import {
  querypromotecampaigncampaign,
  querypromotecampaignmetric,
  queryupdatecouponAftPorP,
} from "../../models/campaigns/set.js";
import Promotion from "../../schema/admin/promotion.js";
import { transferTobalanceAfterPurchasingCamaign } from "../../services/stripe.js";
import { compareDate } from "../../utils/comparedate.js";
import dates from "../../utils/dates.js";
import Response from "../../utils/response.js";
import { idGenerator } from "../../utils/uid.js";

const response = (message) => new Response(message);

export async function promotecampaign(rq, rs, pass) {
  const { promotionId, campaignId } = await rq.params;
  const { coupon } = await rq.query;
  const todaysdate = dates(new Date());
  try {
    /* get info about the campaign */
    const promotionGeneralI = Promotion();
    let promotionI = promotionGeneralI.find((elem) => elem.id === promotionId);
    if (promotionI) {
      let {
        id: promotion_Id,
        plan: promotionPlan,
        price: promotionPrice,
        time: promotionDuration,
        plansname: promotionSName,
      } = promotionI;
      let couponcode = coupon ? await getcouponinfo(coupon) : null;
      /* get coupon information */

      let coupondiscount = 0;
      let couponname = null;

      if (coupon) {
        /* verify coupon now to male sure everything works */
        const compareenddate = compareDate(couponcode.endDate, todaysdate);
        /* if result[1] === 1 , then meaning coupon endDate is still greater
         than todays date. TO MAKE SURE THE COUPON HASENT ENDED
        */
        const comparestartdate = compareDate(couponcode.startDate, todaysdate);
        /* if result[1] === 2 , then meaning todays date is still greater than
         the coupons startDate . TO MAKE SURE THE COUPON HAS STARTED
        */
        let vouchertype_support_alloption =
          couponcode?.voucherType.includes("promotion");
        /* make sure the coupon supports promotion. */

        if (
          coupon &&
          couponcode.status === 1 &&
          couponcode.noOfCoupon.avail !== 0 &&
          compareenddate[1] === 1 &&
          comparestartdate[1] === 2 &&
          vouchertype_support_alloption === true
        ) {
          coupondiscount = couponcode?.discounts;
          couponname = couponcode?.couponName;

          let selfcoupondiscountAmount =
            (couponcode.discounts / 100) * promotionPrice;
          selfcoupondiscountAmount > couponcode.limitOfPrice
            ? (coupondiscount = Math.round(
                (couponcode.limitOfPrice / promotionPrice) * 100
              ))
            : "";
          // returns a new percentage using the value of limitOfPrice
          /* Function to calculate percentage for limitOfPrice since
             since the discounted amount exceeds its limit, so the limitOfPrice
             converted to percentage per campaign has th be the new replacement
          */
          await queryupdatecouponAftPorP(coupon);
          // update coupon codes
        } else "";
        // skip this side since coupon cannot be validated.
      }

      // continue to schema and query
      let finaldiscountAmount = (coupondiscount / 100) * promotionPrice;
      let finalpriceAfterDiscount = Math.round(
        promotionPrice - finaldiscountAmount
      );

      let promotionschema_campaign = {
        status: 1,
        plan: promotionSName,
        duration: promotionDuration,
        val: promotionPrice,
        date: dates(new Date()),
      };

      let promotionschema_metric = {
        plan: promotionPlan,
        planS: promotionSName,
        duration: promotionDuration,
        id: promotionId,
        price: promotionPrice,
        couponDiscount: coupondiscount,
        couponName: couponname,
        campaignId,
        couponAmount: finaldiscountAmount,
        paidAmount: finalpriceAfterDiscount,
        date: dates(new Date()),
      };

      const promotiondetails = await getcampaignpromotionInfo(campaignId);
      if (promotiondetails) {
        let setToActive;
        if (promotiondetails.promotion.ispromotion === true) {
          /* if is promotion is true, then there must be an active promotion,
          and if its false, then there must not be an active promotion or pending promotion
          since pending promotions are made active immediately active expires.  */

          if (promotiondetails.promotion.promotion?.pending?.status === 1) {
            setToActive = "decline";
            // because there is a pending promotion already
          } else {
            // firstly check if the user is tryna downgrade
            let checkidowngrading = Promotion().filter(
              (elem) =>
                elem.price < promotiondetails.promotion.promotion?.active?.val
            );

            let trynadowngrade = false;
            checkidowngrading.forEach((elem) =>
              elem?.price === promotionPrice ? (trynadowngrade = true) : void 0
            );

            trynadowngrade === true
              ? (setToActive = "cannot downgrade promotion.")
              : (setToActive = false);
          }
        } else {
          setToActive = true;
        }
        /* continue to processing requests. */
        if (setToActive === true || setToActive === false) {
          let orderId = await transferTobalanceAfterPurchasingCamaign();
          promotionschema_metric["orderId"] = orderId;
          promotionschema_metric["transactionId"] = idGenerator(25);
          // purchase the promotion
          await querypromotecampaigncampaign(
            campaignId,
            setToActive,
            promotionschema_campaign
          );
          await querypromotecampaignmetric(promotionschema_metric);
          rs.status(200).json(response("ok").success());
        } else {
          if (setToActive === "decline")
            rs.status(403).json(response("pending campaign found!").warn());
          if (setToActive === "cannot downgrade promotion.")
            rs.status(403).json(response(setToActive).warn());
        }
      } else {
        let message = "campaign does not exists.";
        rs.status(404).json(response(message).warn());
      }
    } else {
      let message = "promotion does not exists.";
      rs.status(404).json(response(message).warn());
    }
  } catch (err) {
    pass(err);
  }
}
// promote campaign
