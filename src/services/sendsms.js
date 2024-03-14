import {
  _twilio_sms_number,
  _twilio_sms_authtoken,
  _twilio_sms_sid,
} from "../.config/var/connection.js";
import twilio from "twilio";
import {
  _apklink_apple,
  _apklink_google,
  _appname,
} from "../.config/var/application.js";

export async function sendsignupOtp(mobile, otp) {
  try {
    const twilioclient = twilio(_twilio_sms_sid, _twilio_sms_authtoken);
    await twilioclient.messages.create({
      body: `your ${_appname} account verification code is ${otp}.`,
      from: _twilio_sms_number,
      to: mobile,
    });
    return true;
  } catch (err) {
    throw err;
  }
}
// send otp for account verification

export async function senddownloadLink(mobile) {
  try {
    const twilioclient = twilio(_twilio_sms_sid, _twilio_sms_authtoken);
    const message = `download pathsynch mobile on apple store from : ${_apklink_apple} or playstore from : ${_apklink_google}`;

    await twilioclient.messages.create({
      body: message,
      from: _twilio_sms_number,
      to: mobile,
    });
    return true;
  } catch (err) {
    throw err;
  }
}
// send application download link to users

export async function sendFPOtp(mobile, otp) {
  try {
    const twilioclient = twilio(_twilio_sms_sid, _twilio_sms_authtoken);
    await twilioclient.messages.create({
      body: `your ${_appname} reset password otp is ${otp}.`,
      from: _twilio_sms_number,
      to: mobile,
    });
    return true;
  } catch (err) {
    throw err;
  }
}
// send otp for forgotten password
