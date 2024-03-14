import Response from "../../utils/response.js";
import { purchase_state_Hook_Lookup } from "../../models/campaigns/get.js";

const response = (message) => new Response(message);

export default async function purchase_state(rq, rs, pass) {
  const { transactionId } = await rq.params;
  try {
    const lookup = await purchase_state_Hook_Lookup(transactionId);

    let state;

    if (lookup !== null) {
      state = true;
    } else {
      state = false;
    }

    rs.status(200).json(
      response("ok").success({ from: "ps", watch: "sales", state })
    );
  } catch (err) {
    pass(err);
  }
}
// purchase state [hook]
