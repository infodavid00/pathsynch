import Response from "../../utils/response.js";
import validator from "validator";

const response = (message) => new Response(message);

export default async function createcampaignMW(rq, rs, pass) {
  const {
    noOfcampaigns,
    title,
    value,
    CampaignsPurchasablePerCustomer,
    repurchaseCampaignAfter,
    discount,
  } = await rq.body;
  const { accesstoken } = await rq.params;
  if (
    accesstoken &&
    validator.isJWT(accesstoken) &&
    noOfcampaigns &&
    title &&
    value &&
    CampaignsPurchasablePerCustomer &&
    repurchaseCampaignAfter
  ) {
    if (!discount) {
      pass();
    } else {
      let discountAmount = (Number(discount) / 100) * Number(value);
      let priceAfterDiscount = Math.round(Number(value) - discountAmount);
      if (priceAfterDiscount >= 8) {
        pass();
      } else {
        let message =
          "campaign value after discount must be equivalent to 8USD(min) or more";
        rs.status(400).json(response(message).warn());
      }
    }
  } else {
    let message =
      "err: noOfcampaigns, title,value, CampaignsPurchasablePerCustomer, repurchaseCampaignAfter and accesstoken are required";
    rs.status(403).json(response(message).warn());
  }
}
// create campaign middleware
