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
  getConnectedIdofMerchant,
  getcampaigninfo,
  getcouponinfo,
} from "../../models/campaigns/get.js";
import Response from "../../utils/response.js";
import dates from "../../utils/dates.js";
import { compareDate, returnDategap } from "../../utils/comparedate.js";
import { idGenerator } from "../../utils/uid.js";
import purchaseDocs from "../../schema/campaign/purchaseDocs.js";
import {
  appendToWatchDb_Payment_Intent,
  purchaseCampaign_uCS_UPDATEPURCHASECOUNT_PHASE_ONE,
  purchaseCampaign_uCS_UPDATEUSERCOUNT_PHASE_ONE,
  purchaseCampaign_updatecouponsidePHASE_ONE,
} from "../../models/campaigns/set.js";
import stripe from "stripe";
import {
  _stripe_publishable_key,
  _stripe_secrete_key,
} from "../../.config/var/connection.js";

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
          (elem) => elem.userId === userid
        );
        const howmanytimepurchased = fhmtuhpac?.purchaseCount;
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
          let discountAmount = (discount / 100) * actualprice;
          let priceAfterDiscount = Math.round(actualprice - discountAmount);
          let couponcode = coupon ? await getcouponinfo(coupon) : null;
          let coupondiscount = 0;
          let wethertoaddcasname = null;
          let cannotvalidatecoupon;
          let errorSignal;
          let shouldQueryCoupon;
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
              couponcode &&
              couponcode.status === 1 &&
              couponcode.noOfCoupon.avail !== 0 &&
              compareenddate[1] === 1 &&
              comparestartdate[1] === 2 &&
              vouchertype_support_Coption &&
              priceAfterDiscount >= 10
            ) {
              cannotvalidatecoupon = false;
              coupondiscount = couponcode.discounts;
              wethertoaddcasname = couponcode.couponName;
              // now that we know the coupon is valid, we work.
              /* check the discout of the coupon, if it exceeds the value of
                limit, then reduce the discoint till it reaches the value.
              */
              let selfcoupondiscountAmount =
                (coupondiscount / 100) * actualprice;
              /* Function to calculate percentage for limitOfPrice since
                   ince the discounted amount exceeds its limit, so the limitOfPrice
                   converted to percentage per campaign has to be the new replacement
               */
              if (selfcoupondiscountAmount > couponcode.limitOfPrice)
                coupondiscount = Math.round(
                  (couponcode.limitOfPrice / actualprice) * 100
                ); // returns a new percentage using the value of limitOfPrice
              // end of returning a new percentage usign limitOfprice
              shouldQueryCoupon = true;
              //specifies that coupon side should be updated
            } else {
              cannotvalidatecoupon = true;
              shouldQueryCoupon = false;
              !couponcode
                ? (errorSignal = "Coupon not found")
                : couponcode.status !== 1
                ? (errorSignal = "Coupon currently offed")
                : couponcode.noOfCoupon.avail === 0
                ? (errorSignal = "Coupon not instore")
                : compareenddate[1] === 2
                ? (errorSignal = "Coupon expired")
                : comparestartdate[1] === 1
                ? (errorSignal = "Coupon hasen't started")
                : !vouchertype_support_Coption
                ? (errorSignal = "Coupon does not support campaign options")
                : priceAfterDiscount < 10
                ? (errorSignal =
                    "limit price must be 10USD(min) or more, or coupon is considered invalid")
                : (errorSignal = "An unknown error occured : COUPON ERROR");
              // errorSignal;
            } // end of validating coupon function
          } else if (coupon && !couponcode) {
            cannotvalidatecoupon = true;
            errorSignal = "Coupon not found.";
          } else {
            cannotvalidatecoupon = false;
          } // end of the if coupon function
          //
          /* continue to purchasing campaign */
          if (cannotvalidatecoupon !== true) {
            let couponDiscount = coupondiscount;
            let finaldiscountAmount =
              (couponDiscount / 100) * priceAfterDiscount;
            let finalpriceAfterDiscount =
              priceAfterDiscount - finaldiscountAmount;
            // price to pay (customers)
            let halfpayouts = priceAfterDiscount / 2;
            let finalpayouts = {
              ps: finalpriceAfterDiscount - halfpayouts,
              merchant: halfpayouts,
            };
            // calculate how much is the percentage of the actual price
            // split to the objs and extract
            /* process payment.. */

            const Stripe = new stripe(_stripe_secrete_key);
            const connectedAccountObj = await getConnectedIdofMerchant(
              getcinfo._admin
            );
            const connectedAccountLocation = connectedAccountObj._connectedId;
            const paymentIntent = await Stripe.paymentIntents.create({
              amount: finalpriceAfterDiscount * 100, // the amount to pay (In cents)
              currency: "usd",
              automatic_payment_methods: {
                enabled: true,
              },
              application_fee_amount: finalpayouts.ps * 100, // amount going to stripe account (In cents)
              transfer_data: {
                destination: connectedAccountLocation ?? "{{}}",
              },
            });
            /* generate the payment Intent */

            let paymentIntent_ = paymentIntent.client_secret;
            let transactionID = paymentIntent_.split("_secret_")[0];
            let orderId = idGenerator(20);
            let publishableKey = _stripe_publishable_key;

            /* process payment.. */
            const docsSchema = new purchaseDocs();
            const updateCampaign = docsSchema.genforcampaign(
              userid,
              orderId,
              transactionID,
              finalpriceAfterDiscount,
              actualprice
            );
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
              couponDiscount
            );
            const updateCustomer = docsSchema.genforusers(
              id,
              orderId,
              transactionID,
              finalpriceAfterDiscount
            );
            // the main docs to be added to db

            await appendToWatchDb_Payment_Intent({
              id,
              userid,
              shouldQueryCoupon,
              coupon,
              campaignOptions: getcinfo.meta.options,
              orderId,
              transactionID,
              publishableKey,
              paymentIntent_,
              updateCampaign,
              updatePathsynch,
              updateCustomer,
            });
            // append to watch db

            if (shouldQueryCoupon === true) {
              await purchaseCampaign_updatecouponsidePHASE_ONE(coupon);
            }
            await purchaseCampaign_uCS_UPDATEUSERCOUNT_PHASE_ONE(id);
            await purchaseCampaign_uCS_UPDATEPURCHASECOUNT_PHASE_ONE(
              id,
              userid
            );

            rs.status(200).json(
              response(true).success({
                orderId,
                transactionID,
                publishableKey,
                paymentIntent_,
              })
            );
            //
          } else {
            let message = `${errorSignal}`;
            rs.status(403).json(response(message).warn());
            // send the error because cannot valiadate campaign
          }
        } else {
          let message = `ERR : cannot repurchase campapign. YOU CAN ONLY REPURCHASE
          CAMPAIGN AFTER ${repurchaseCampaignAfter} DAY(S).`;
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
