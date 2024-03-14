import stripe from "stripe";

const Stripe = new stripe(
  "sk_test_51OAeaRCwhZJHjP6KtlHQ4fH7ZGo9ufUMhuSwY6gk6WmGbkI29VQvXaFV8nR76ey2Apwcs9mfYZwarmsfAhY84Uol00nuwcQ0dm"
);

// (async () => {
//   try {
//     const account = await Stripe.accounts.create({
//       type: "express",
//     });
//     console.log("Account created:", account);
//   } catch (error) {
//     console.log("Error creating account:", error.message);
//     // console.log("SSS");
//   }
// })();
// // create a connect account

// (async () => {
//   try {
//     const accountLink = await Stripe.accountLinks.create({
//       account: "acct_1OfkOwCpWx6cAe2c",
//       refresh_url: "http://localhost:8181/somethingwentwrong",
//       return_url: "http://localhost:8181/successful",
//       type: "account_onboarding",
//     });
//     console.log("Account Link Created :", accountLink);
//   } catch (error) {
//     console.error("Error :", error);
//   }
// })();
// // create an account link (for onboarding/consent)
