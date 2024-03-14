import dates from "../../utils/dates.js";

class purchaseDocs {
  genforcampaign(userId, orderId, transactionId, priceToPay, totalPrice) {
    const obj = {
      userId,
      lastpurchaseAt: dates(new Date()),
      purchaseCount: 1,
      purchases: [
        {
          orderId,
          transactionId,
          timestamp: dates(new Date()),
          ispaid: false,
          priceToPay,
          totalPrice,
        },
      ],
    };
    return obj;
  }

  genforusers(campaignId, orderId, transactionId, price) {
    const obj = {
      campaignId,
      lastpurchaseAt: dates(new Date()),
      purchaseCount: 1,
      purchases: [
        { timestamp: dates(new Date()), price, orderId, transactionId },
      ],
    };
    return obj;
  }

  genforps(
    campaignId,
    transactionId,
    orderId,
    actualPrice,
    pricePaid,
    M_payout,
    PS_payout,
    discountPercentage,
    couponName,
    CouponPercentage
  ) {
    const obj = {
      _id: orderId,
      campaignId,
      transactionId,
      timestamp: dates(new Date()),
      ispaid: false,
      amount: {
        actualPrice,
        pricePaid,
        M_payout,
        PS_payout,
      },
      discountPercentage,
      coupon: {
        couponName,
        CouponPercentage,
      },
    };
    return obj;
  }
}

export default purchaseDocs;
