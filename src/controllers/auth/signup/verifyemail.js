import Response from "../../../utils/response.js";
import { Accesstoken, Refreshtoken } from "../../../.config/etc/tokens.js";
import {
  addStripeConnectedid,
  updatepathforreferal,
  verifyuser,
} from "../../../models/auth/set.js";
import { isverifiedlookup } from "../../../models/auth/get.js";
import jwt from "jsonwebtoken";
import { _accesstokensecrete } from "../../../.config/var/private.js";
import stripe from "stripe";
import { _stripe_secrete_key } from "../../../.config/var/connection.js";

export default async function verifyemail(rq, rs, pass) {
  const { token } = await rq.params;
  const response = (message) => new Response(message);

  try {
    const payload = jwt.verify(token, _accesstokensecrete);
    /* didn't use the Accesstoken class as that is for signin access token and not
       email verification token.
      */
    const lookupisverified = await isverifiedlookup(payload.id);
    /* make sure that the user is not verified before proceeding */
    if (lookupisverified === false) {
      // if true meaning user is verified already
      const verifyrequesteduser = await verifyuser(payload.id, true);
      /* return false if the doc is not found */
      if (verifyrequesteduser === true) {
        //
        const Stripe = new stripe(_stripe_secrete_key);
        const account = await Stripe.accounts.create({
          type: "express",
        });
        let _connectedId = account?.id;

        await addStripeConnectedid(payload.id, _connectedId);
        // Create connect account

        let referalfound;
        if (payload.referal) {
          await updatepathforreferal(payload.referal); // credit referred user
          referalfound = true;
        }
        const { id, type } = payload;
        const accesstoken = await new Accesstoken().sign(id, type);
        const refreshtoken = await new Refreshtoken().sign(id, type);
        rs.status(200).json(
          response("ok").success({ accesstoken, refreshtoken, referalfound })
        );
      } else {
        /* the docs might have been deleted, causing the function to return false */
        rs.status(401).json(response("user not found").warn());
      }
    } else {
      /* user is already verified */
      rs.status(401).json(response("user already verified").warn());
    }
  } catch (err) {
    pass(err);
  }
}
