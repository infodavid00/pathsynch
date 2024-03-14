import Response from "../../../utils/response.js";
import {
  queryGetPromotions,
  queryGetPromotionsInfo,
  queryPromotionsTotalRevenue,
} from "../../../models/admin/get.js";

const response = (message) => new Response(message);

export async function getpromotions(rq, rs, pass) {
  const { page: pageq, size: sizeq, dmy, type } = await rq.query;
  const { date: dateq } = await rq.params;
  const size = Number(sizeq) || 10;
  const page = Number(pageq) * size || 0;
  try {
    if (dateq == "DD" || dateq == "MM" || dateq == "YYYY") {
      const totalrevenueraw = await queryPromotionsTotalRevenue();
      const totalrevenuearr = [];
      totalrevenueraw.forEach((elem) => totalrevenuearr.push(elem.paidAmount));
      const totalrevenue = totalrevenuearr.reduce(
        (accumulator, currentValue) => accumulator + currentValue,
        0
      );

      const promotioninforaw = await queryGetPromotionsInfo(dateq, dmy);
      let revenuearr = [];
      let totaldiscountarr = [];
      promotioninforaw.forEach((elem) => {
        revenuearr.push(elem.paidAmount ?? 0),
          totaldiscountarr.push(elem.couponDiscount ?? 0);
      });

      let revenue = revenuearr.reduce(
        (accumulator, currentValue) => accumulator + currentValue,
        0
      );
      let totaldiscount = totaldiscountarr.reduce(
        (accumulator, currentValue) => accumulator + currentValue,
        0
      );
      let totalpromotion = promotioninforaw.length;

      const promotions = await queryGetPromotions(
        size,
        page,
        dateq,
        dmy,
        type ?? null
      );
      rs.status(200).json(
        response("ok").success({
          totalrevenue,
          revenue,
          totaldiscount,
          totalpromotion,
          promotions,
        })
      );
    } else {
      let message = "date can only be DD, MM or YYYY";
      rs.status(400).json(response(message).warn());
    }
  } catch (err) {
    pass(err);
  }
}
// get promotions
