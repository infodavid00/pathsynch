import Response from "../../utils/response.js";
import Validator from "validator";
import {
  _usertypeA,
  _usertypeB,
  _appname,
} from "../../.config/var/application.js";

const response = (message) => new Response(message);

export async function signupMAFCS1MW(rq, rs, pass) {
  const { email, password, fname, lname, mobile } = await rq.body;

  let testemail = Validator.isEmail(email || ""),
    testmobile =
      mobile &&
      mobile.length <= 13 &&
      /[a-z]/.test(mobile) === false &&
      /[A-Z]/.test(mobile) === false,
    testpassword = password && password.length >= 6,
    testname = fname && lname && !/\W/.test(fname) && !/\W/.test(lname);

  if (testemail && testmobile && testpassword && testname) {
    rq.body.issuer = _appname;
    rq.body.mobile = `+${mobile}`;
    pass();
  } else {
    let message;
    if (testemail === false) {
      message = "Email error";
    } else if (testmobile === false) {
      message = "Mobile error";
    } else if (testpassword === false) {
      message = "Password must not be less than 6";
    } else if (testname === false) {
      message = "Name error";
    } else if (!lname) {
      message = "Lastname is required";
    }
    rs.status(403).json(response(message).warn());
  }
}
// signup method A FOR CUSTOMERS step 1 middleware

export async function signupMAFMS1MW(rq, rs, pass) {
  const {
    email,
    password,
    fname,
    lname,
    landline,
    city,
    state,
    category,
    buisnessname,
  } = await rq.body;
  let testemail = email && Validator.isEmail(email),
    testlandline =
      landline &&
      landline.length <= 13 &&
      /[a-z]/.test(landline) === false &&
      /[A-Z]/.test(landline) === false,
    testpassword = password && password.length >= 6,
    testname = fname && lname && !/\W/.test(fname) && !/\W/.test(lname);
  if (
    testemail &&
    testlandline &&
    testpassword &&
    testname &&
    city &&
    state &&
    category &&
    buisnessname
  ) {
    rq.body.landline = `+${landline}`;
    pass();
  } else {
    let message;
    if (testemail === false) {
      message = "Email error";
    } else if (landline === false) {
      message = "Landline error";
    } else if (testpassword === false) {
      message = "Password must not be less than 6";
    } else if (testname === false) {
      message = "Name error";
    } else if (!buisnessname) {
      message = "buisnessname is required";
    } else if (!lname) {
      message = "Lastname is required";
    } else {
      message = "Required Fields Missing";
    }
    rs.status(403).json(response(message).warn());
  }
}
// // signup method A FOR MERCHANT step 1 middleware

export async function signupMBS1MW(rq, rs, pass) {
  const { issuer, userId } = await rq.params;
  const issuers = ["google", "apple"];

  if (
    issuer.toLowerCase() === issuers[0] ||
    issuer.toLowerCase() === issuers[1]
  ) {
    if (userId && userId.length > 1) {
      rq.body.issuer = issuer; //set issuer
      rq.body.issuerid = userId; //set issuerid
      rq.body.password = userId; //set password
      pass();
    } else {
      let message = "url parameters missing : userId required";
      rs.status(400).json(response(message).warn());
    }
  } else {
    let message = "issuer can only be google or apple.";
    rs.status(403).json(response(message).warn());
  }
}
// signup method B step 1 middleware

export async function signupVMS2MW(rq, rs, pass) {
  const otptoken = await rq.params.otptoken;
  const otp = await rq.query.otp;

  if (Validator.isJWT(otptoken)) {
    if (otp.length === 4) {
      pass();
    } else {
      let message = `otp url must be 4 digits`;
      rs.status(403).json(response(message).warn());
    }
  } else {
    let message = `invalid otp url`;
    rs.status(403).json(response(message).warn());
  }
}
// signup verify mobile step 2 middelware

// export async function signupMBS3MW(rq, rs, pass) {
//   const { category, services, servicesTypes } = await rq.body;
//   const { accesstoken: token } = await rq.params;

//   if (
//     Validator.isJWT(token) &&
//     category &&
//     servicesTypes &&
//     typeof servicesTypes === "object" &&
//     services &&
//     typeof services === "object" &&
//     services.length <= 5
//   ) {
//     pass();
//   } else {
//     let message = "cannot validate body";
//     rs.status(403).json(response(message).warn());
//   }
// }
// signup method B step 3 middleware
