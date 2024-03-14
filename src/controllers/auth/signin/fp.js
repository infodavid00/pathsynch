import Response from "../../../utils/response.js";
import {
  emaillookupforgottenpsw,
  mobilelookupforgottenpsw,
} from "../../../models/auth/get.js";
import { Hash } from "../../../.config/etc/tokens.js";
import { digitGenerator } from "../../../utils/uid.js";
import { sendFPOtp } from "../../../services/sendsms.js";
import { updatepassword } from "../../../models/auth/set.js";
import { _accesstokensecrete } from "../../../.config/var/private.js";
import { template_emailVerification_fp } from "../../../lib/templates.js";
import sendemail from "../../../services/sendemail.js";
import Validator from "validator";
import jwt from "jsonwebtoken";
import { _fbwebBaseURL } from "../../../.config/var/application.js";

const response = (message) => new Response(message);

export async function forgottenpassword(rq, rs, pass) {
  const { mobile } = await rq.params;
  try {
    if (
      mobile &&
      mobile.length <= 13 &&
      /[a-z]/.test(mobile) === false &&
      /[A-Z]/.test(mobile) === false
    ) {
      const lookupnumber = await mobilelookupforgottenpsw(`+${mobile}`);
      if (lookupnumber !== null) {
        const otp = digitGenerator(4); //generate otp (4 digits)
        const payload = {
          sub: lookupnumber._id,
          otp: await new Hash(otp).sign(),
        }; //generate payload
        const otptoken = jwt.sign(payload, _accesstokensecrete, {
          expiresIn: "8m",
        }); //generate otptoken
        await sendFPOtp(`+${mobile}`, otp);
        let message = `an 4 digit reset password code has been sent to ${`+${mobile}`}. expires in 8 minutes`;
        rs.status(200).json(response(message).success({ otptoken }));
      } else {
        let message = "user not found";
        rs.status(404).json(response(message).warn());
      }
    } else {
      let message = "mobile is invalid";
      rs.status(400).json(response(message).warn());
    }
  } catch (err) {
    pass(err);
  }
}
//send otp customer

export async function fpverification(rq, rs, pass) {
  const { otptoken } = await rq.params;
  const { otp } = await rq.query;
  try {
    if (Validator.isJWT(otptoken) && otp && otp.length === 4) {
      const { sub, otp: hashedotp } = jwt.verify(otptoken, _accesstokensecrete);
      const compareotp = await new Hash(otp).compare(hashedotp);
      if (compareotp === true) {
        let ep = { expiresIn: "5m" };
        const updatepswtoken = jwt.sign({ sub }, _accesstokensecrete, ep); //generate updatepswtoken
        let message = "Token expiry : 5mins";
        rs.status(200).json(
          response(message).success({ token: updatepswtoken })
        );
      } else {
        let message = "incorrect otp";
        rs.status(400).json(response(message).warn());
      }
    } else {
      let message = "Error validating parameters";
      rs.status(400).json(response(message).warn());
    }
  } catch (err) {
    pass(err);
  }
}
// verify otp customer

export async function fpupdatepsw(rq, rs, pass) {
  const { token } = await rq.params;
  const { password } = await rq.body;

  if (Validator.isJWT(token) && password && password.length >= 6) {
    try {
      const { sub } = jwt.verify(token, _accesstokensecrete);
      const hashedpsw = await new Hash(password).sign();
      const updatepsw = await updatepassword(sub, hashedpsw);
      if (updatepsw === true) {
        rs.status(200).json(response("ok").success());
      } else {
        let message = "user not found";
        rs.status(404).json(response(message).warn());
      }
    } catch (err) {
      pass(err);
    }
  } else {
    let message = "Error validating parameters";
    rs.status(400).json(response(message).warn());
  }
}
// update psw customer

export async function forgottenpasswordMERCHANT(rq, rs, pass) {
  const { email } = await rq.params;
  try {
    if (email && Validator.isEmail(email)) {
      const lookupemail = await emaillookupforgottenpsw(email);
      if (lookupemail !== null) {
        const payload = { sub: lookupemail._id };
        const link = jwt.sign(payload, _accesstokensecrete, {
          expiresIn: "30m",
        });
        let template = template_emailVerification_fp(
          lookupemail.meta.name.fname,
          _fbwebBaseURL + link
        );
        await sendemail(template, email, "Reset password"); // send email here
        let message = `a verification link has been sent to ${email}. expires in 30 minutes`;
        rs.status(200).json(response(message).success());
      } else {
        let message = "merchant not found";
        rs.status(404).json(response(message).warn());
      }
    } else {
      let message = "email is invalid";
      rs.status(400).json(response(message).warn());
    }
  } catch (err) {
    pass(err);
  }
}
//send verification link MERCHANT

export async function fpupdatepswMERCHANT(rq, rs, pass) {
  const { token } = await rq.params;
  const { password } = await rq.body;

  if (Validator.isJWT(token) && password && password.length >= 6) {
    try {
      const { sub } = jwt.verify(token, _accesstokensecrete);
      const hashedpsw = await new Hash(password).sign();
      const updatepsw = await updatepassword(sub, hashedpsw);
      if (updatepsw === true) {
        rs.status(200).json(response("ok").success());
      } else {
        let message = "user not found";
        rs.status(404).json(response(message).warn());
      }
    } catch (err) {
      pass(err);
    }
  } else {
    let message = "Error validating parameters";
    rs.status(400).json(response(message).warn());
  }
}
// update psw merchant
