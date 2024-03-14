/*
FLOW
get campaign info :
   get campaign info from the backend. compare info to see if the user is eligibe
   [if campaigns are soled out, if user can purchase again, if user can repurchase].
calculte coupon :
   how much to withdraw, how much is going to the merchant, and how much is going
   to the admin.
process payment :
   use stripe and debit the user (payment => amount to withdraw), sending the money
   to the admin automatically.
update campaign :
   on the users fields, increament the count field, and push the doc to the entries.
   the doc should contian coupon,timestamp and id, purchasedCount, last purchase date
   ispaid etc.
update pathspoint :
   you can now update $path points by 2 and end the request.
*/

import {
  getcampaigninfo,
  getcampaignscount,
  getcouponinfo,
} from "../../models/campaigns/get.js";
import Response from "../../utils/response.js";
import dates from "../../utils/dates.js";
import { compareDate, returnDategap } from "../../utils/comparedate.js";
import { transferTobalanceAfterPurchasingCamaign } from "../../services/stripe.js";
import { idGenerator } from "../../utils/uid.js";
import purchaseDocs from "../../schema/campaign/purchaseDocs.js";
import {
  purchaseCampaign_updatecampaignside,
  purchaseCampaign_updatecouponside,
  purchaseCampaign_updatecustomerside,
  purchaseCampaign_updatepsside,
  updatepathpoints,
} from "../../models/campaigns/set.js";
import chalk from "chalk";

const response = (message) => new Response(message);

export async function purchasecampaign(rq, rs, pass) {
  const { id } = await rq.params;
  const { id: userid } = await rq.body;
  const { coupon } = await rq.query;
  const todaysdate = dates(new Date());

  try {
    const getcinfo = await getcampaigninfo(id);
    if (getcinfo) {
      const compareenddate = compareDate(getcinfo.meta.endDate, todaysdate);
      const comparestartdate = compareDate(getcinfo.meta.startDate, todaysdate);
      const checknoofcampaigns =
        getcinfo.users.count !== getcinfo.noOfcampaigns;
      /* the three variables checks if the camoaign is eligble */

      if (
        checknoofcampaigns &&
        compareenddate[1] === 1 &&
        comparestartdate[1] === 2
      ) {
        const CampaignsPurchasablePerCustomer =
          getcinfo.settings.CampaignsPurchasablePerCustomer;
        const fhmtuhpac = getcinfo.users.entries.find(
          (elem) => elem.id === userid
        );
        const howmanytimepurchased = fhmtuhpac?.purchasedCount;
        /* check how many times a campaign has been purchased. */
        const lastpurchaseAt = fhmtuhpac?.lastpurchaseAt;
        const repurchaseCampaignAfter =
          getcinfo.settings.repurchaseCampaignAfter;
        /* check wether user has purchased a campaign, if so wether the user can
        repurchase a campaign or not. */

        if (
          !fhmtuhpac ||
          howmanytimepurchased < CampaignsPurchasablePerCustomer ||
          (howmanytimepurchased === CampaignsPurchasablePerCustomer &&
            returnDategap(lastpurchaseAt, todaysdate) >=
              repurchaseCampaignAfter)
        ) {
          //
          /* continue to purchasing campaign */
          let actualprice = getcinfo.meta.value;
          let discount = getcinfo.meta.discount;
          let couponcode = coupon ? await getcouponinfo(coupon) : null;
          let coupondiscount = 0;
          let wethertoaddcasname = null;

          if (couponcode) {
            // verify coupon now
            const compareenddate = compareDate(couponcode.endDate, todaysdate);
            /* result[1] === 1 must be the correct way */
            const comparestartdate = compareDate(
              couponcode.startDate,
              todaysdate
            );
            /* result[1] === 2 must be the correct way */
            let vouchertype_support_Coption = false;
            /* make sure voucher supports coupon option. */
            for (let i = 0; i < getcinfo.meta.options.length; i++) {
              let opts = getcinfo.meta.options[i];
              for (let k = 0; k < couponcode.voucherType.length; k++) {
                if (opts === couponcode.voucherType[k])
                  vouchertype_support_Coption = true;
              }
            }

            if (
              coupon &&
              couponcode.status === 1 &&
              couponcode.noOfCoupon.avail !== 0 &&
              compareenddate[1] === 1 &&
              comparestartdate[1] === 2 &&
              vouchertype_support_Coption
            ) {
              coupondiscount = couponcode.discounts;
              wethertoaddcasname = couponcode.couponName;
              // now that we know the coupon is valid, we work.
              /* check the discout of the coupon, if it exceeds the value of
                 limit, then reduce the discoint till it reaches the value.
              */
              let selfcoupondiscountAmount =
                (coupondiscount / 100) * actualprice;
              if (selfcoupondiscountAmount > couponcode.limitOfPrice) {
                /* Function to calculate percentage for limitOfPrice since
                   since the discounted amount exceeds its limit, so the limitOfPrice
                   converted to percentage per campaign has to be the new replacement
                */
                coupondiscount = Math.round(
                  (couponcode.limitOfPrice / actualprice) * 100
                ); // returns a new percentage using the value of limitOfPrice
              } // end of returning a new percentage usign limitOfprice
              await purchaseCampaign_updatecouponside(coupon);
              // update coupons side
            } // end of validating coupon function
          } // end of the if coupon or discount function
          //
          /* continue to purchasing campaign */

          let finaldiscount = coupondiscount + discount;
          let finaldiscountAmount = (finaldiscount / 100) * actualprice;
          let finalpriceAfterDiscount = Math.round(
            actualprice - finaldiscountAmount
          );
          let halfpayouts = actualprice / 2;
          let finalpayouts = { ps: halfpayouts, merchant: halfpayouts };
          let finalcoupondiscountAmount = (coupondiscount / 100) * actualprice;
          let finalmerchantdiscountAmount = (discount / 100) * actualprice;

          finalpayouts.ps -= finalcoupondiscountAmount;
          finalpayouts.merchant -= finalmerchantdiscountAmount;
          // calculate how much is the percentage of the actual price
          // split to the objs and extract

          /* process payment.. */
          let transactionID = await transferTobalanceAfterPurchasingCamaign(
            userid,
            finalpriceAfterDiscount
          );
          /* process payment.. */
          let orderId = idGenerator(20);
          const docsSchema = new purchaseDocs();
          const updateCampaign = docsSchema.genforcampaign(
            userid,
            orderId,
            transactionID,
            finalpriceAfterDiscount,
            actualprice
          );
          await purchaseCampaign_updatecampaignside(id, updateCampaign);
          // update campaign
          const updatePathsynch = docsSchema.genforps(
            id,
            transactionID,
            orderId,
            actualprice,
            finalpriceAfterDiscount,
            finalpayouts.merchant,
            finalpayouts.ps,
            discount,
            wethertoaddcasname,
            coupondiscount
          );
          await purchaseCampaign_updatepsside(updatePathsynch);
          // update pathsynch side
          const updateCustomer = docsSchema.genforusers(
            id,
            orderId,
            transactionID,
            finalpriceAfterDiscount
          );
          await purchaseCampaign_updatecustomerside(userid, updateCustomer);
          // update customer
          /* update path points and end request. */
          const customercampaigncount = await getcampaignscount(userid);
          let addpointsby;
          customercampaigncount.user.wallet.membershipCount !== 0 &&
          customercampaigncount.user.wallet.membershipCount % 5 === 0
            ? (addpointsby = 4)
            : (addpointsby = 2);
          await updatepathpoints(userid, addpointsby);
          rs.status(200).json(response(true).success({ orderId }));

          //
        } else {
          let message = `ERR : cannot repurchase campapign. YOU CAN ONLY REPURCHASE
            CAMPAIGN AFTER ${repurchaseCampaignAfter} DAY(S), AND ITS BEEN
            ${amountofdayssincelastpurchase} DAY(S) SINCE YOU LAST PURCHASED THIS CAMAIGN.`;
          rs.status(403).json(response(message).warn());
        }
        //
      } else {
        let message = `ERR : INVALID STATE [campaign migth have not either started or already ended, campaign migth have been sold out]`;
        rs.status(403).json(response(message).warn());
      }
      //
    } else {
      let message = "ERR : campaign not found or not activated.";
      rs.status(404).json(response(message).warn());
    }
  } catch (err) {
    pass(err);
  }
}
// purchase campaign
