import express from "express";
import {
  signupMAFCS1MW,
  signupMAFMS1MW,
  signupMBS1MW,
  signupVMS2MW,
} from "../middlewares/auth/signup.js";
import {
  addmobilesignupoauth,
  signupCustomerDefault,
  signupCustomerDefaultMobileS1,
  signupCustomerDefaultMobileS2,
  signupCustomerDefaultMobileS3,
  signupCustomerOauth,
  signupMerchantDefault,
} from "../controllers/auth/signup/signup.js";
import verifymobile from "../controllers/auth/signup/verifymobile.js";
import verifyemail from "../controllers/auth/signup/verifyemail.js";
import refreshactoken from "../controllers/auth/token/refreshactoken.js";
import signupadmin from "../controllers/auth/admin/signin.js";
import {
  signinOauthCUSTOMER,
  signindefaultCUSTOMER,
  signindefaultMERCHANT,
} from "../controllers/auth/signin/signin.js";
import {
  forgottenpassword,
  forgottenpasswordMERCHANT,
  fpupdatepsw,
  fpupdatepswMERCHANT,
  fpverification,
} from "../controllers/auth/signin/fp.js";

const auth = express.Router();

auth.post("/register/customer", signupMAFCS1MW, signupCustomerDefault);
/* create an account CUSTOMER */
auth.post(
  "/register/customer/oath/:issuer/:userId",
  signupMBS1MW,
  signupCustomerOauth
);
/* create an account OAUTH CUSTOMER */
auth.post("/register/customer/addmobile", addmobilesignupoauth);
/* add mobile manually CUSTOMER */
auth.post("/register/customer/verify/:otptoken", signupVMS2MW, verifymobile);
/* verify account CUSTOMER */
auth.post("/register/merchant", signupMAFMS1MW, signupMerchantDefault);
/* create an account MERCHANT */
auth.post("/register/merchant/verify/:token", verifyemail);
/* verify an account MERCHANT */

auth.post("/checkpoint/natoken/:refreshtoken", refreshactoken);
/* refresh accesstoken */

auth.post("/checkpoint/admin/hax4", signupadmin);
/* signin admin */

auth.post("/signin/customer", signindefaultCUSTOMER);
/* signin default CUSTOMER  */
auth.post("/signin/customer/:issuer/:userId/:email", signinOauthCUSTOMER);
/* signin oauth CUSTOMER */
auth.post("/signin/merchant", signindefaultMERCHANT);
/* signin default MERCHANT  */

auth.post("/fp/customer/1/:mobile", forgottenpassword);
/* forgotting password phase 1 CUSTOMER */
auth.post("/fp/customer/2/:otptoken", fpverification);
/* forgotting password phase 2 CUSTOMER */
auth.post("/fp/customer/3/:token", fpupdatepsw);
/* forgotting password phase 3 CUSTOMER */
auth.post("/fp/merchant/1/:email", forgottenpasswordMERCHANT);
/* forgotting password phase 1 MERCHANT */
auth.post("/fp/merchant/2/:token", fpupdatepswMERCHANT);
/* forgotting password phase 2 MERCHANT */

auth.post("/signup/customer/mobile/1/:mobile", signupCustomerDefaultMobileS1);
/* signup customer default mobile s1 */
auth.post(
  "/signup/customer/mobile/2/:token/:otp",
  signupCustomerDefaultMobileS2
);
/* signup customer default mobile s2 */
auth.post("/signup/customer/mobile/3/:token", signupCustomerDefaultMobileS3);
/* signup customer default mobile s3 */

export default auth;
