import Response from "../../../utils/response.js";
import {
  adminlocateIdwithPubid,
  queryMerchantDataCampaign,
  querygetifCampaignUsedCoupon,
  querygetmerchantcampaignAdmin,
} from "../../../models/admin/get.js";
import {
  compareDate,
  getCurrentWeek,
  getLastWeek,
} from "../../../utils/comparedate.js";
import dates from "../../../utils/dates.js";

const response = (message) => new Response(message);

export async function getmerchantsData(rq, rs, pass) {
  const { ddmmyy, pubId } = await rq.params;

  if (ddmmyy === "DD" || ddmmyy === "MM" || ddmmyy === "YYYY") {
    try {
      /* daily = get all campaigns that started today  [this week, last week] 
         monthly = get all campaigns that started this month [this month, last month]
         yearly = get all campaigns that started this year [this year, lasy year]
      */
      let getpubId = await adminlocateIdwithPubid(pubId);
      const campaigns = await queryMerchantDataCampaign(ddmmyy, getpubId._id);
      if (campaigns !== null) {
        let past = [],
          present = [];
        let datehelper = dates(new Date()).split("/");
        /* defune past present variables */

        if (ddmmyy == "DD")
          campaigns.map((elem) => {
            for (let x = 0; x < getCurrentWeek().length; x++) {
              if (elem.meta.startDate === getCurrentWeek()[x])
                present.push(elem);
            }
          }),
            campaigns.map((elem) => {
              for (let x = 0; x < getLastWeek().length; x++) {
                if (elem.meta.startDate === getLastWeek()[x]) past.push(elem);
              }
            });
        /* move past and present for daily */
        function monthFormater() {
          let month = `${datehelper[1] - 1}`;
          let r;
          if (datehelper[1] == "01") {
            r = "12";
          } else {
            if (month.length === 1) {
              r = `0${month}`;
            } else {
              r = month;
            }
          }
          return r;
        }
        if (ddmmyy == "MM")
          (present = campaigns.filter((elem) =>
            elem.meta.startDate.includes(`${datehelper[1]}/${datehelper[2]}`)
          )),
            (past = campaigns.filter((elem) =>
              elem.meta.startDate.includes(
                `${monthFormater()}/${
                  datehelper[1] == "01" ? datehelper[2] - 1 : datehelper[2]
                }`
              )
            ));
        /* move past and present for monthly */
        if (ddmmyy == "YYYY")
          (present = campaigns.filter((elem) =>
            elem.meta.startDate.includes(`${datehelper[2]}`)
          )),
            (past = campaigns.filter((elem) =>
              elem.meta.startDate.includes(`${datehelper[2] - 1}`)
            ));
        /* move past and present for yearly */

        let expired = {},
          promoted = {},
          upcoming = {},
          active = {};

        active["past"] = past.filter((elem) => elem.isActive === true).length;
        active["present"] = present.filter(
          (elem) => elem.isActive === true
        ).length;
        // active length total

        expired["past"] = past.filter(
          (elem) => compareDate(elem.meta.endDate, dates(new Date()))[1] === 2
        ).length;
        expired["present"] = present.filter(
          (elem) => compareDate(elem.meta.endDate, dates(new Date()))[1] === 2
        ).length;
        //  expired length total

        promoted["past"] = past.filter(
          (elem) => elem.promotion.ispromotion === true
        ).length;
        promoted["present"] = present.filter(
          (elem) => elem.promotion.ispromotion === true
        ).length;
        // promoted length total

        upcoming["past"] = past.filter(
          (elem) => compareDate(elem.meta.startDate, dates(new Date()))[1] === 1
        ).length;
        upcoming["present"] = present.filter(
          (elem) => compareDate(elem.meta.startDate, dates(new Date()))[1] === 1
        ).length;
        // upcoming length total

        rs.status(200).json(
          response("ok").success({ expired, upcoming, promoted, active })
        );
      } else {
        let message = "nothing to return.";
        rs.status(400).json(response(message).warn());
      }
    } catch (err) {
      pass(err);
    }
  } else {
    let message = "ddmmyy can only be DD, MM, or YYYY";
    rs.status(400).json(response(message).warn());
  }
}
// get merchants data

export async function getMerchantsCampaignAdmin(rq, rs, pass) {
  const { page: pageq, size: sizeq } = await rq.query;
  const size = Number(sizeq) || 10;
  const page = Number(pageq) * size || 0;
  const { pubId } = await rq.params;

  try {
    let getpubId = await adminlocateIdwithPubid(pubId);
    let docFirstForm = await querygetmerchantcampaignAdmin(
      page,
      size,
      getpubId._id
    );
    if (docFirstForm !== null) {
      let campaignpubIds = [];
      for (let i = 0; i < docFirstForm.length; i++) {
        if (!campaignpubIds.includes(docFirstForm[i].pubId))
          campaignpubIds.push(docFirstForm[i].pubId);
      }
      let IsusedCoupon = await querygetifCampaignUsedCoupon(campaignpubIds);
      // [{campaignId},{campaignId},...{campaignId}]

      let docSecondForm = docFirstForm.map((elem) => {
        const obj = {
          pubId: elem.pubId,
          startDate: elem.meta.startDate,
          value: elem.meta.value,
          options: elem.meta.options,
          membershipCount: elem.users.count,
          title: elem.meta.title,
          promotion: elem.promotion.ispromotion,
        };
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
// get merchant campaign admin
