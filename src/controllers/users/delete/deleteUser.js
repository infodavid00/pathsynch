import {
  deleteUserCampaignsFromCampaigns,
  deleteUserFromUser,
} from "../../../models/users/set.js";
import Response from "../../../utils/response.js";

const response = (message) => new Response(message);

export async function deleteUser(rq, rs, pass) {
  const { id, acknowledgeRequest } = await rq.body;
  if (id && acknowledgeRequest) {
    try {
      await deleteUserFromUser(id);
      await deleteUserCampaignsFromCampaigns(id);

      let message = "User Deleted Completely";
      rs.status(200).json(response(message).success());
    } catch (err) {
      pass(err);
    }
  } else {
    rs.status(403).json(response("request must be acknowledged.").warn());
  }
}
// delete user
