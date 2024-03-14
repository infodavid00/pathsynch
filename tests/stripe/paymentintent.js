import stripe from "stripe";

const Stripe = new stripe(
  "sk_test_51OAeaRCwhZJHjP6KtlHQ4fH7ZGo9ufUMhuSwY6gk6WmGbkI29VQvXaFV8nR76ey2Apwcs9mfYZwarmsfAhY84Uol00nuwcQ0dm"
);

(async () => {
  try {
    const paymentIntent = await Stripe.paymentIntents.create({
      amount: 2000, // (in smallest units eg : USD = cents)
      currency: "usd",
      // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
      automatic_payment_methods: {
        enabled: true,
      }, // specifies if the payment methods listed should be from dashboard or manualy
      application_fee_amount: 1000, // amount going to stripe account (in smallest units eg : USD = cents)
      transfer_data: {
        destination: "acct_1Oc4K6CYO1n4YfnK",
      },
    });
    console.log({
      paymentIntent: paymentIntent.client_secret,
      publishableKey:
        "pk_test_51OAeaRCwhZJHjP6KxgcYEnNjl9krmgFtfkZi9bi3T7rvY8q0CDXjzeSrn5WBdvPALchyeiTz749HGS7VlrqBxsNP00T8zbvMfa", //its seperate from secrete key and this is for client side
    });
  } catch (error) {
    console.error("Error :", error);
  }
})();
// create a payment intent
// 100 cent = 1 dollar
