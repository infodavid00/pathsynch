/*
...........
...........
...........
*/
import {
  DELETEFROMWATCHDB,
  getcampaignscount,
} from "../../models/campaigns/get.js";
import {
  purchaseCampaign_updatecampaignside,
  purchaseCampaign_updatecouponsidePHASE_TWO_SUCCESSFUL,
  purchaseCampaign_updatecustomerside,
  purchaseCampaign_updatepsside,
  retrieveFromWatchDb_Payment_Intent,
  updatepathpoints,
} from "../../models/campaigns/set.js";

export async function update_service_after_paymentIntent_successful(
  transactionID
) {
  try {
    /* process payment.. */
    const watchDB = await retrieveFromWatchDb_Payment_Intent(transactionID);

    if (watchDB?.shouldQueryCoupon === true) {
      await purchaseCampaign_updatecouponsidePHASE_TWO_SUCCESSFUL(
        watchDB?.coupon
      );
    }
    /* update coupons side */

    await purchaseCampaign_updatecampaignside(
      watchDB?.id,
      watchDB?.updateCampaign
    );
    /* update campaign */

    await purchaseCampaign_updatepsside(watchDB?.updatePathsynch);
    /* update pathsynch side */

    await purchaseCampaign_updatecustomerside(
      watchDB?.userid,
      watchDB?.updateCustomer
    );
    /* update customer */

    /* update path points and end request. */
    const customercampaigncount = await getcampaignscount(watchDB?.userid);
    if (watchDB?.campaignOptions.includes("membership")) {
      let addpointsby;
      customercampaigncount.user.wallet.membershipCount !== 0 &&
      customercampaigncount.user.wallet.membershipCount % 5 === 0
        ? (addpointsby = 4)
        : (addpointsby = 2);
      await updatepathpoints(watchDB?.userid, addpointsby);
    }
    /* update path points and end request. */

    await DELETEFROMWATCHDB(transactionID);
    // delete from db
    return true;
  } catch (err) {
    console.log(`❌ ${err.message}`);
  }
}
// purchase campaign
