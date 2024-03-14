import Response from "../../../utils/response.js";
import {
  queryGetCampaignDetailsCustomers,
  queryGetCampaignDetailsSales,
  querygetLogoforCampaignsMAd,
  querygetcampaignAdmin,
  querygetifCampaignUsedCoupon,
} from "../../../models/admin/get.js";

const response = (message) => new Response(message);

export async function getcampaignsAdmin(rq, rs, pass) {
  const { page: pageq, size: sizeq, filter } = await rq.query;
  const size = Number(sizeq) || 10;
  const page = Number(pageq) * size || 0;

  try {
    let docFirstForm = await querygetcampaignAdmin(page, size, filter);
    if (docFirstForm !== null) {
      let merchantIds = [];
      let campaignpubIds = [];
      for (let i = 0; i < docFirstForm.length; i++) {
        if (!merchantIds.includes(docFirstForm[i]._admin))
          merchantIds.push(docFirstForm[i]._admin);
        if (!campaignpubIds.includes(docFirstForm[i].pubId))
          campaignpubIds.push(docFirstForm[i].pubId);
      }

      let Logos = await querygetLogoforCampaignsMAd(merchantIds);
      let IsusedCoupon = await querygetifCampaignUsedCoupon(campaignpubIds);
      // [{campaignId},{campaignId},...{campaignId}]

      let docSecondForm = docFirstForm.map((elem) => {
        const obj = {
          pubId: elem.pubId,
          merchantId: elem._admin,
          startDate: elem.meta.startDate,
          value: elem.meta.value,
          options: elem.meta.options,
          membershipCount: elem.users.count,
          title: elem.meta.title,
          cover: elem.meta.cover,
        };
        for (let j = 0; j < Logos.length; j++) {
          if (Logos[j]._id === obj.merchantId) obj.logo = Logos[j].meta.logo;
        }
        delete obj.merchantId;

        let checkCoupon = IsusedCoupon.find(
          (elem) => elem.campaignId === obj.pubId
        );
        if (checkCoupon) obj["coupon"] = true;

        return obj;
      });

      rs.status(200).json(response("ok").success(docSecondForm));
    } else {
      let message = "nothing to return";
      rs.status(404).json(response(message).warn());
    }
  } catch (err) {
    pass(err);
  }
}
// get campaigns admin

export async function getcampaignDetailsAdmin(rq, rs, pass) {
  const { ddmmyy } = await rq.params;
  if (
    ddmmyy === "DD" ||
    ddmmyy === "WW" ||
    ddmmyy === "MM" ||
    ddmmyy === "YYYY"
  ) {
    try {
      let revenue, salesCount, customerCount;

      let salesDetails = await queryGetCampaignDetailsSales(ddmmyy);
      let cutomerDetails = await queryGetCampaignDetailsCustomers();

      revenue = salesDetails.reduce(
        (accumulator, currentVal) => accumulator + currentVal.amount.pricePaid,
        0
      ); // get revenue
      salesCount = salesDetails.length; // get sales count
      customerCount = cutomerDetails.length; // customers count

      rs.status(200).json(
        response("ok").success({ revenue, salesCount, customerCount })
      );
    } catch (err) {
      pass(err);
    }
  } else {
    let message = ":ddmmyy can only be DD, WW, MM or YYYY";
    rs.status(400).json(response(message).warn());
  }
}
// get campaigndetails admin
