import Response from "../../../utils/response.js";
import {
  accountdefaultlookup,
  accountoauthlookup,
  accountmerchantdefaultlookup,
} from "../../../models/auth/get.js";
import {
  Accesstoken,
  Refreshtoken,
  Hash,
} from "../../../.config/etc/tokens.js";

const response = (message) => new Response(message);

export async function signindefaultCUSTOMER(rq, rs, pass) {
  const { email, password } = await rq.body;

  try {
    if (email && password) {
      const accountlookup = await accountdefaultlookup(email);
      if (accountlookup !== null) {
        const hashedpsw = accountlookup.auth.password;
        const comparepassword = await new Hash(password).compare(hashedpsw);
        if (comparepassword === true) {
          const id = accountlookup._id;
          const type = accountlookup.meta.type;
          const accesstoken = await new Accesstoken().sign(id, type);
          const refreshtoken = await new Refreshtoken().sign(id, type);
          rs.status(200).json(
            response("ok").success({ accesstoken, refreshtoken })
          );
        } else {
          let message = "password does not match";
          rs.status(401).json(response(message).warn());
        }
      } else {
        let message = "user does not exist";
        rs.status(404).json(response(message).warn());
      }
    } else {
      let message = "mobile and password are required";
      rs.status(400).json(response(message).warn());
    }
  } catch (err) {
    pass(err);
  }
}
// signin default method CUSTOMER

export async function signinOauthCUSTOMER(rq, rs, pass) {
  const { userId, issuer, email } = await rq.params;
  const issuers = ["google", "apple"];

  try {
    if (
      issuer.toLowerCase() === issuers[0] ||
      issuer.toLowerCase() === issuers[1]
    ) {
      const accountlookup = await accountoauthlookup(userId, email, issuer);
      //lookup database

      if (accountlookup !== null) {
        const id = accountlookup._id;
        const type = accountlookup.meta.type;
        const accesstoken = await new Accesstoken().sign(id, type);
        const refreshtoken = await new Refreshtoken().sign(id, type);
        rs.status(200).json(
          response("ok").success({ accesstoken, refreshtoken })
        );
      } else {
        let message = "user does not exists.";
        rs.status(404).json(response(message).warn());
      }
    } else {
      let message = `cannot validate issuer.`;
      rs.status(401).json(response(message).warn());
    }
  } catch (err) {
    pass(err);
  }
}
// signin oauth method CUSTOMER

export async function signindefaultMERCHANT(rq, rs, pass) {
  const { email, password } = await rq.body;

  try {
    if (email && password) {
      const accountlookup = await accountmerchantdefaultlookup(email);
      if (accountlookup !== null) {
        const hashedpsw = accountlookup.auth.password;
        const comparepassword = await new Hash(password).compare(hashedpsw);
        if (comparepassword === true) {
          const id = accountlookup._id;
          const type = accountlookup.meta.type;
          const accesstoken = await new Accesstoken().sign(id, type);
          const refreshtoken = await new Refreshtoken().sign(id, type);
          rs.status(200).json(
            response("ok").success({ accesstoken, refreshtoken })
          );
        } else {
          let message = "password does not match";
          rs.status(401).json(response(message).warn());
        }
      } else {
        let message = "merchant does not exist";
        rs.status(404).json(response(message).warn());
      }
    } else {
      let message = "email and password are required";
      rs.status(400).json(response(message).warn());
    }
  } catch (err) {
    pass(err);
  }
}
// signin default method MERCHANT
