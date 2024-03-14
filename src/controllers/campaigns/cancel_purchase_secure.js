/*
...........
...........
...........
*/

import { DELETEFROMWATCHDB } from "../../models/campaigns/get.js";
import {
  purchaseCampaign_uCS_UPDATEPURCHASECOUNT_PHASE_TWO_FAILED,
  purchaseCampaign_uCS_UPDATEUSERCOUNT_PHASE_TWO_FAILED,
  purchaseCampaign_updatecouponsidePHASE_TWO_FAILED,
  retrieveFromWatchDb_Payment_Intent,
} from "../../models/campaigns/set.js";

export default async function update_service_after_paymentIntent_fails(
  transactionID
) {
  try {
    /* cancel payment.. */
    const watchDB = await retrieveFromWatchDb_Payment_Intent(transactionID);

    await purchaseCampaign_updatecouponsidePHASE_TWO_FAILED(watchDB?.coupon);
    await purchaseCampaign_uCS_UPDATEUSERCOUNT_PHASE_TWO_FAILED(watchDB?.id);
    await purchaseCampaign_uCS_UPDATEPURCHASECOUNT_PHASE_TWO_FAILED(
      watchDB?.id,
      watchDB?.userid
    );

    await DELETEFROMWATCHDB(transactionID);
    // delete from db

    return true;
  } catch (err) {
    console.log(`❌ ${err.message}`);
  }
}
// cancel purchase
