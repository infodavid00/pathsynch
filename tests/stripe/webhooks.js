// // This is your test secret API key.
import express from "express";
import stripe from "stripe";

const Stripe = new stripe(
  "sk_test_51OAeaRCwhZJHjP6KtlHQ4fH7ZGo9ufUMhuSwY6gk6WmGbkI29VQvXaFV8nR76ey2Apwcs9mfYZwarmsfAhY84Uol00nuwcQ0dm"
);

// Replace this endpoint secret with your endpoint's unique secret
// If you are testing with the CLI, find the secret by running 'stripe listen'
// If you are using an endpoint defined with the API or dashboard, look in your webhook settings
// at https://dashboard.stripe.com/webhooks
const endpointSecret = "whsec_...";

const app = express();

app.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  (request, response) => {
    let event;
    if (endpointSecret) {
      // Get the signature sent by Stripe
      const signature = request.headers["stripe-signature"];
      try {
        event = Stripe.webhooks.constructEvent(
          request.body,
          signature,
          endpointSecret
        );
      } catch (err) {
        console.log(`⚠️  Webhook signature verification failed.`, err.message);
        return response.sendStatus(400);
      }
    } else {
      event = request.body;
    }

    // Handle the event
    if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object;
      console.log(paymentIntent);
      // Then define and call a method to handle the successful payment intent.
      // handlePaymentIntentSucceeded(paymentIntent);
    } else if (event.type === "payment_intent.payment_failed") {
      const paymentFailed = event.data.object;
      console.log(paymentFailed);
      // Then define and call a method to handle the successful attachment of a PaymentMethod.
      // handlePaymentMethodAttached(paymentMethod);
    } else if (event.type === "payment_method.attached") {
      const paymentMethod = event.data.object;
      console.log(paymentMethod);
      // Then define and call a method to handle the successful attachment of a PaymentMethod.
      // handlePaymentMethodAttached(paymentMethod);
    } else {
      // Unexpected event type
      console.log(`Unhandled event type ${event.type}.`);
    }

    // Return a 200 response to acknowledge receipt of the event
    response.send();
  }
);

app.listen(4242, () => console.log("Running on port 4242"));
