import Response from "../../../utils/response.js";
import { digitGenerator } from "../../../utils/uid.js";
import Customer from "../../../schema/user/customer.js";
import Merchant from "../../../schema/user/merchant.js";
import {
  Hash,
  Accesstoken,
  Refreshtoken,
} from "../../../.config/etc/tokens.js";
import { mobilelookup, emaillookup } from "../../../models/auth/get.js";
import {
  addmobileforauth,
  registeruser,
  updatepathforreferal,
} from "../../../models/auth/set.js";
import { _accesstokensecrete } from "../../../.config/var/private.js";
import {
  _appname,
  _signupwebBaseURL,
  _usertypeB,
} from "../../../.config/var/application.js";
import { sendsignupOtp } from "../../../services/sendsms.js";
import Validator from "validator";
import jwt from "jsonwebtoken";
import { template_emailVerification } from "../../../lib/templates.js";
import sendemail from "../../../services/sendemail.js";
import validator from "validator";

const response = (message) => new Response(message);

export async function signupCustomerDefault(rq, rs, pass) {
  const referal = await rq.query.referal;
  const body = await rq.body;
  const hashedpassword = await new Hash(body.password).sign();
  body.password = hashedpassword;
  try {
    const lookupmobile = await mobilelookup(body.mobile); // lookup mobile
    const lookupemail = await emaillookup(body.email); // lookup email
    if (lookupmobile === null && lookupemail === null) {
      if (referal) {
        body.referedBy = referal;
      }
      const schema = new Customer(body).register(); // get schema
      await registeruser(schema); // query user data
      const otp = digitGenerator(4);
      const hashedotp = await new Hash(otp).sign();
      const otptokenpayload = {
        id: schema._id,
        token: hashedotp,
        type: schema.meta.type,
      };
      if (referal) {
        otptokenpayload.referal = referal;
      }
      const otptoken = jwt.sign(otptokenpayload, _accesstokensecrete, {
        expiresIn: "8m",
      });
      await sendsignupOtp(schema.meta.mobile, otp);
      let message = `a verification code has been sent to ${schema.meta.mobile}. expires in 8 minutes`;
      rs.status(200).json(response(message).success({ otptoken }));
    } else {
      lookupmobile !== null
        ? rs.status(403).json(response("mobile already exists").warn())
        : lookupemail !== null
        ? rs.status(401).json(response("email already exists").warn())
        : pass();
    }
  } catch (err) {
    pass(err);
  }
}
// signup default method

export async function signupCustomerOauth(rq, rs, pass) {
  const { referal } = await rq.query;
  const body = await rq.body;
  const { email, fname, lname, mobile } = body;

  let testemail = Validator.isEmail(email || ""),
    testname = fname && lname && !/\W/.test(fname) && !/\W/.test(lname);

  try {
    if (testemail && testname) {
      body.mobile = mobile ? `+${mobile}` : null;
      // make sure the mobile is already in country code format (ecluding the + sign).

      // if mobile is found then send otp else tell the end user to add a number
      const lookupmobile = await mobilelookup(body.mobile ?? "1"); // lookup mobile
      const lookupemail = await emaillookup(body.email); // lookup email
      if (lookupmobile === null && lookupemail === null) {
        if (referal) {
          body.referedBy = referal;
        }
        const schema = new Customer(body).register(body.mobile ? true : false);
        // get schema
        await registeruser(schema);
        // query user data

        if (schema.meta.mobile !== null) {
          let referalfound;
          if (referal) {
            await updatepathforreferal(referal); // credit refered user
            referalfound = true;
          }
          const id = schema._id;
          const type = schema.meta.type;
          const accesstoken = await new Accesstoken().sign(id, type);
          const refreshtoken = await new Refreshtoken().sign(id, type);
          rs.status(200).json(
            response("ok").success({
              accesstoken,
              refreshtoken,
              referalfound,
            })
          );
        } else {
          const token = jwt.sign(
            { id: schema._id, referal, type: schema.meta.type },
            _accesstokensecrete,
            { expiresIn: "8m" }
          ); //generate token
          let message = "ok";
          // account created, mobile upload/verification required
          rs.status(200).json(response(message).success({ token }));
        }
      } else {
        lookupmobile !== null
          ? rs.status(403).json(response("mobile already exists").warn())
          : lookupemail !== null
          ? rs.status(401).json(response("email already exists").warn())
          : pass();
      }
    } else {
      let message;
      if (testemail === false) {
        message = "Email error";
      } else if (testname === false) {
        message = "Name error";
      } else if (!lname) {
        message = "Lastname is required";
      }
      rs.status(403).json(response(message).warn());
    }
  } catch (err) {
    pass(err);
  }
}
// signup oauth method

export async function addmobilesignupoauth(rq, rs, pass) {
  const { token, mobile } = await rq.body;
  try {
    let testmobile =
      mobile &&
      mobile.length <= 13 &&
      /[a-z]/.test(mobile) === false &&
      /[A-Z]/.test(mobile) === false;
    if (Validator.isJWT(token || "") && testmobile) {
      const {
        id: payloadid,
        referal,
        type,
      } = jwt.verify(token, _accesstokensecrete);
      const lookupmobile = await mobilelookup(`+${mobile}`); // lookup mobile
      if (lookupmobile === null) {
        const querydb = await addmobileforauth(payloadid, `+${mobile}`); // call db and query mobile
        if (querydb) {
          const otp = digitGenerator(4);
          const hashedotp = await new Hash(otp).sign();
          const otptokenpayload = {
            id: payloadid,
            token: hashedotp,
            type,
          };
          if (referal) {
            otptokenpayload.referal = referal;
          }
          const otptoken = jwt.sign(otptokenpayload, _accesstokensecrete, {
            expiresIn: "8m",
          });
          await sendsignupOtp(`+${mobile}`, otp);
          let message = `a verification code has been sent to +${mobile}. expires in 8 minutes`;
          rs.status(200).json(response(message).success({ otptoken }));
        } else {
          let message = "user already verified or does not exists";
          rs.status(400).json(response(message).warn());
        }
      } else {
        rs.status(403).json(response("mobile already exists").warn());
      }
    } else {
      let message = "token or mobile error";
      rs.status(400).json(response(message).warn());
    }
  } catch (err) {
    pass(err);
  }
}
// addmobile for signup(oath method)

export async function signupMerchantDefault(rq, rs, pass) {
  const referal = await rq.query.referal;
  const body = await rq.body;
  const hashedpassword = await new Hash(body.password).sign();
  body.password = hashedpassword;
  try {
    const lookupmobile = await mobilelookup(body.landline); // lookup mobile
    const lookupemail = await emaillookup(body.email); // lookup email
    if (lookupmobile === null && lookupemail === null) {
      if (referal) {
        body.referedBy = referal;
      }
      const schema = new Merchant(body).register(); // get schema
      await registeruser(schema); // query user data
      const payload = {
        id: schema._id,
        type: schema.meta.type,
      };
      if (referal) {
        payload.referal = referal;
      }
      const link = jwt.sign(payload, _accesstokensecrete, {
        expiresIn: "30m",
      });
      let template = template_emailVerification(
        schema.meta.name.fname,
        _signupwebBaseURL + link
      );
      await sendemail(template, schema.meta.email, "Confirm Your Email"); // send sms here
      let message = `a verification link has been sent to ${schema.meta.email}. expires in 30 minutes`;
      rs.status(200).json(response(message).success());
    } else {
      lookupmobile !== null
        ? rs.status(403).json(response("mobile already exists").warn())
        : lookupemail !== null
        ? rs.status(401).json(response("email already exists").warn())
        : pass();
    }
  } catch (err) {
    pass(err);
  }
}
// signup merchant

export async function signupCustomerDefaultMobileS1(rq, rs, pass) {
  const { mobile } = await rq.params;
  if (
    mobile &&
    mobile.length <= 13 &&
    /[a-z]/.test(mobile) === false &&
    /[A-Z]/.test(mobile) === false
  ) {
    try {
      const lookupmobile = await mobilelookup(`+${mobile}`); // lookup mobile
      if (lookupmobile === null) {
        const otp = digitGenerator(4);
        const hashedotp = await new Hash(otp).sign();
        const otptokenpayload = { token: hashedotp, mobile };
        const otptoken = jwt.sign(otptokenpayload, _accesstokensecrete, {
          expiresIn: "8m",
        });
        await sendsignupOtp(`+${mobile}`, otp);
        let message = `a verification code has been sent to +${mobile}. expires in 8 minutes`;
        rs.status(200).json(response(message).success({ otptoken }));
      } else {
        let message = "mobile already exists";
        rs.status(403).json(response(message).warn());
      }
    } catch (err) {
      pass(err);
    }
  } else {
    let message = "mobile error";
    rs.status(400).json(response(message).warn());
  }
}
// signup customer default mobile s1

export async function signupCustomerDefaultMobileS2(rq, rs, pass) {
  const { token, otp } = await rq.params;
  if (token && validator.isJWT(token) && otp && otp.length === 4) {
    try {
      const { token: hashedotp, mobile } = jwt.verify(
        token,
        _accesstokensecrete
      );
      const decryptedOTP = await new Hash(otp).compare(hashedotp);
      if (decryptedOTP) {
        const signupPayload = { mobile };
        const signupToken = jwt.sign(signupPayload, _accesstokensecrete, {
          expiresIn: "8m",
        });
        rs.status(200).json(response("ok").success({ signupToken }));
      } else {
        let message = "invalid otp";
        rs.status(400).json(response(message).warn());
      }
    } catch (err) {
      pass(err);
    }
  } else {
    let message =
      "ERR: requirements not met. token must be type jwt and otp must be of 4 characters long";
    rs.status(400).json(response(message).warn());
  }
}
// signup customer default mobile s2

export async function signupCustomerDefaultMobileS3(rq, rs, pass) {
  try {
    const body = await rq.body;
    const { token } = await rq.params;
    const { referal } = await rq.query;

    const { mobile } = jwt.verify(token, _accesstokensecrete);

    let testemail = Validator.isEmail(body.email || ""),
      testpassword = body.password && body.password.length >= 6,
      testname =
        body.fname &&
        body.lname &&
        !/\W/.test(body.fname) &&
        !/\W/.test(body.lname);

    if (testemail && mobile && testpassword && testname) {
      body.issuer = _appname;
      body.mobile = `+${mobile}`;
      const hashedpassword = await new Hash(body.password).sign();
      body.password = hashedpassword;

      // confirm that the email and mobile are not in use
      const lookupmobile = await mobilelookup(body.mobile); // lookup mobile
      const lookupemail = await emaillookup(body.email); // lookup email
      if (lookupmobile === null && lookupemail === null) {
        if (referal) body.referedBy = referal;

        // create the schema and update to database
        const schema = new Customer(body).register(true); // get schema
        await registeruser(schema); // query user data

        let referalfound;
        if (referal) {
          await updatepathforreferal(referal); // credit referred user
          referalfound = true;
        }
        const id = schema._id,
          type = schema.meta.type;
        const accesstoken = await new Accesstoken().sign(id, type);
        const refreshtoken = await new Refreshtoken().sign(id, type);
        rs.status(200).json(
          response("ok").success({ accesstoken, refreshtoken, referalfound })
        );
      } else {
        lookupmobile !== null
          ? rs.status(403).json(response("mobile already exists").warn())
          : lookupemail !== null
          ? rs.status(401).json(response("email already exists").warn())
          : pass();
      }
    } else {
      let message;
      if (testemail === false) {
        message = "Email error";
      } else if (testpassword === false) {
        message = "Password must not be less than 6";
      } else if (testname === false) {
        message = "Name error";
      } else if (!body.lname) {
        message = "Lastname is required";
      }
      rs.status(403).json(response(message).warn());
    }
  } catch (err) {
    pass(err);
  }
}
// signup customer default mobile s3
