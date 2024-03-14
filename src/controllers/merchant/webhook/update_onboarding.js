/* ........... */
import { queryupdate_verifyOnboarding } from "../../../models/merchant/set.js";

export default async function updateOnboarding(_connectedId) {
  try {
    await queryupdate_verifyOnboarding(_connectedId);
    return true;
  } catch (err) {
    console.log(`❌ ${err.message}`);
  }
}
// update onboarding
