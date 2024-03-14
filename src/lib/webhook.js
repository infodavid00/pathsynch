import stripe from "stripe";
import {
  _stripe_endpoint_secrete,
  _stripe_endpoint_onboarding_secrete,
  _stripe_secrete_key,
} from "../.config/var/connection.js";
import { update_service_after_paymentIntent_successful } from "../controllers/campaigns/confrm_purchase_secure.js";
import update_service_after_paymentIntent_fails from "../controllers/campaigns/cancel_purchase_secure.js";
import updateOnboarding from "../controllers/merchant/webhook/update_onboarding.js";
import chalk from "chalk";

const Stripe = new stripe(_stripe_secrete_key);
const endpointSecret = _stripe_endpoint_secrete;
const endpointonboardingSecret = _stripe_endpoint_onboarding_secrete;

export async function WEB_HOOK_PAYMENT(request, response) {
  const sig = request.headers["stripe-signature"];

  let event;

  try {
    const payload = request.body;
    if (typeof payload !== "string" && !(payload instanceof Buffer)) {
      throw new Error(
        "Webhook payload must be provided as a string or a Buffer."
      );
    }
    event = Stripe.webhooks.constructEvent(payload, sig, endpointSecret);
  } catch (err) {
    // On error, log and return the error message
    response.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Successfully constructed event ✅

  // Handle the event
  switch (event.type) {
    case "payment_intent.succeeded":
      const paymentSucceeded = event.data.object.id;
      console.log(chalk.green.bold(`💰 updating payment ########`));
      await update_service_after_paymentIntent_successful(paymentSucceeded);
      console.log(`💰 payment successfully updated ✅`);
      // 💰 payment_intent.succeeded
      break;
    case "payment_intent.payment_failed":
      const paymentIntentFailed = event.data.object;
      console.log(
        chalk.green.bold(`💰 updating payment failure response ########`)
      );
      await update_service_after_paymentIntent_fails(paymentIntentFailed.id);
      console.log(`❌ payment failure response successfully updated ✅`);
      // ❌ payment_intent.payment_failed
      break;
    default:
    // 🤷 Unhandled event type
  }

  // acknowledge the event
  response.json({ received: true });
}
// webhook payment

export async function WEB_HOOK_ONBOARDING(request, response) {
  const sig = request.headers["stripe-signature"];
  let event;
  try {
    const payload = request.body;
    if (typeof payload !== "string" && !(payload instanceof Buffer)) {
      throw new Error(
        "Webhook payload must be provided as a string or a Buffer."
      );
    }
    event = Stripe.webhooks.constructEvent(payload, sig, endpointonboardingSecret);
  } catch (err) {
    // On error, log and return the error message
    response.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }
  // Successfully constructed event ✅
  // Handle the event

  switch (event.type) {
    case "account.updated":
      const account = event.data.object;
      // Check if the account is fully onboarded
      if (account.details_submitted && account.charges_enabled) {
        console.log(chalk.green.bold(`updating onboarding ########`));
        await updateOnboarding(account.id);
        console.log(`onboarding updated ✅`);
        // onboarding updated.
      }
      break;
    default:
    // 🤷 Unhandled event type
  }
  // acknowledge the event
  response.json({ received: true });
}
// webhook payment onboarding
