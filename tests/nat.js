// using Twilio SendGrid's v3 Node.js Library

import sgMail from "@sendgrid/mail";
import { _sendgrid_api_key } from "../src/.config/var/connection.js";

sgMail.setApiKey(
  "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"
);

const msg = {
  to: "da40au40@gmail.com",
  from: {
    name: "pathsynch",
    email: "hello@pathsynch.com",
  }, // Use the email address or domain you verified above
  subject: "Sending with Twilio SendGrid is Fun",
  text: "and easy to do anywhere, even with Node.js",
  html: "<strong>and easy to do anywhere, even with Node.js</strong>",
};

//ES8
(async () => {
  try {
    await sgMail.send(msg);
  } catch (error) {
    console.error(error);

    if (error.response) {
      console.error(error.response.body);
    }
  }
})();
