/* import auth details */
import sgMail from "@sendgrid/mail";
import {
  _sendgrid_api_key,
  _sendgrid_api_email,
} from "../.config/var/connection.js";
import { _appname } from "../.config/var/application.js";

export default async function sendemail(template, email, sub) {
  sgMail.setApiKey(_sendgrid_api_key);
  const msg = {
    to: email,
    from: {
      name: _appname,
      email: _sendgrid_api_email,
    },
    subject: sub,
    html: template,
  };

  try {
    await sgMail.send(msg);
    return true;
  } catch (err) {
    throw err;
  }
}
