import Response from "../../../utils/response.js";
import {
  Accesstoken,
  Refreshtoken,
  Hash,
} from "../../../.config/etc/tokens.js";
import { updatepathforreferal, verifyuser } from "../../../models/auth/set.js";
import { isverifiedlookup } from "../../../models/auth/get.js";
import jwt from "jsonwebtoken";
import { _accesstokensecrete } from "../../../.config/var/private.js";

export default async function verifymobile(rq, rs, pass) {
  const otptoken = await rq.params.otptoken;
  const otp = await rq.query.otp;

  const response = (message) => new Response(message);

  try {
    const payload = jwt.verify(otptoken, _accesstokensecrete); //didnt used the Accesstoken class as that is for signin accesstoken and not otp token
    const compare = await new Hash(otp).compare(payload.token);
    if (compare === true) {
      const lookupisverified = await isverifiedlookup(payload.id); //make sure that the user is not verified before proceeding
      if (lookupisverified === false) {
        //if true meaning user is verified already
        const verifyrequesteduser = await verifyuser(payload.id); //return false if the doc is not found
        if (verifyrequesteduser === true) {
          let referalfound;
          if (payload.referal) {
            await updatepathforreferal(payload.referal); // credit refered user
            referalfound = true;
          }
          const { id, type } = payload;
          const accesstoken = await new Accesstoken().sign(id, type);
          const refreshtoken = await new Refreshtoken().sign(id, type);
          rs.status(200).json(
            response("ok").success({ accesstoken, refreshtoken, referalfound })
          );
        } else {
          // the docs migth have been deleted, causing the function return false
          rs.status(404).json(response("user not found").warn());
        }
      } else {
        // user is already verified
        rs.status(401).json(response("user already verified").warn());
      }
    } else {
      rs.status(401).json(response("incorrect otp").warn());
    }
  } catch (err) {
    pass(err);
  }
}
