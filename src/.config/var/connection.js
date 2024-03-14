import process from "node:process";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });

export const _port = 8181;
export const _dbstring = process.env.MONGOSTRING;
export const _twilio_sms_sid = process.env.TWILIOSID;
export const _twilio_sms_authtoken = process.env.TWILIOAUTHTOKEN;
export const _twilio_sms_number = process.env.TWILIONUMBER;
export const _sendgrid_api_key = process.env.SENDGRID_API_KEY;
export const _sendgrid_api_email = process.env.SENDGRID_API_EMAIL;
export const _stripe_secrete_key = process.env.STRIPE_SECRETE_KEY;
export const _stripe_publishable_key = process.env.STRIPE_PUBLISHABLE_KEY;
export const _stripe_endpoint_secrete = process.env.STRIPE_ENDPOINT_SECRETE;
export const _stripe_endpoint_onboarding_secrete =
  process.env.STRIPE_ENDPOINT_ONBOARDING_SECRETE;
export const _dbname = "dbPathsynch";
export const _dbusers = "col_users";
export const _dbcoupons = "col_coupons";
export const _dbpromotions = "col_promotions";
export const _dbcampaigns = "col_campaigns";
export const _dbsales = "col_sales";
export const _dbtrash = "col_trash";
export const _dbcontacts = "col_contacts";
export const _dbauthLocalstorage = "col_auth_localStorage";
export const _dbsupports = "col_supports";
export const _dbwatch = "col_payment_tempHolder";
export const _stripe_connect_accLink_refresh_url =
  process.env.STRIPE_CONNECT_ACCLINK_REFRESH_URL;
export const _stripe_connect_accLink_return_url =
  process.env.STRIPE_CONNECT_ACCLINK_RETURN_URL;
