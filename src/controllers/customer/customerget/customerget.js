import {
  querygetcustomerinfo,
  querygetpathpoints,
  querygetreferalLink,
} from "../../../models/customer/get.js";
import Response from "../../../utils/response.js";

const response = (message) => new Response(message);

export async function getpathpoints(rq, rs, pass) {
  const { id } = await rq.body;
  try {
    const getpoints = await querygetpathpoints(id);
    /* get the points */
    if (getpoints !== null) {
      const points = getpoints?.user?.path?.points;
      let message = "ok";
      rs.status(200).json(response(message).success(points));
    } else {
      let message = "user not found";
      rs.status(404).json(response(message).warn());
    }
  } catch (err) {
    pass(err);
  }
}
// get $path points

export async function getreferalLink(rq, rs, pass) {
  const { id } = await rq.body;
  try {
    const getreferal = await querygetreferalLink(id);
    /* get the link */
    if (getreferal !== null) {
      const referal = getreferal?.user?.referal?.id;
      let message = "ok";
      rs.status(200).json(response(message).success(referal));
    } else {
      let message = "user not found";
      rs.status(404).json(response(message).warn());
    }
  } catch (err) {
    pass(err);
  }
}
// get referalLink

/*
[]
type,
email,
profilephoto,
name,
mobile,
dob,
zip,
createdAt,
lastupdateAt,
pubId,
isVerified,
issuer,
profilestatus,
isCUI,
referedBy,
followersCount,
followingCount,
[]
Users Data Retrievable
*/
export async function getcustomerinfo(rq, rs, pass) {
  const body = await rq.body;
  try {
    const _PROJECTION_ = { _id: 0 };
    /* the projection for the database. */

    function set_Projection_(field) {
      _PROJECTION_[field] = 1;
      return void 0;
    }
    /* func f0r setting projection. */

    body.type ? set_Projection_("meta.type") : void 0;
    body.email ? set_Projection_("meta.email") : void 0;
    body.profilephoto ? set_Projection_("meta.profile") : void 0;
    body.name ? set_Projection_("meta.name") : void 0;
    body.mobile ? set_Projection_("meta.mobile") : void 0;
    body.dob ? set_Projection_("meta.dob") : void 0;
    body.zip ? set_Projection_("meta.zip") : void 0;
    body.createdAt ? set_Projection_("meta.createdAt") : void 0;
    body.lastupdateAt ? set_Projection_("meta.lastupdateAt") : void 0;
    body.pubId ? set_Projection_("meta.pubId") : void 0;
    body.isVerified ? set_Projection_("auth.isVerified") : void 0;
    body.issuer ? set_Projection_("auth.issuer.issuedBy") : void 0;
    body.profilestatus ? set_Projection_("metrics.profilestatus") : void 0;
    body.isCUI ? set_Projection_("metrics.isCUI") : void 0;
    body.referedBy ? set_Projection_("user.referal.referedBy") : void 0;
    body.followersCount
      ? set_Projection_("user.followers.followers.count")
      : void 0;
    body.followingCount
      ? set_Projection_("user.followers.following.count")
      : void 0;

    const GET = await querygetcustomerinfo(body.id, _PROJECTION_);
    if (GET !== null) {
      const _RETURN_ = {};
      /* the returning object */

      function set_Return_(field, value) {
        _RETURN_[field] = value;
        return void 0;
      }
      /* func f0r setting return. */

      GET?.meta?.type ? set_Return_("type", GET.meta.type) : void 0;
      GET?.meta?.email ? set_Return_("email", GET.meta.email) : void 0;
      GET?.meta?.profile ? set_Return_("profile", GET.meta.profile) : void 0;
      GET?.meta?.name ? set_Return_("name", GET.meta.name) : void 0;
      GET?.meta?.mobile ? set_Return_("mobile", GET.meta.mobile) : void 0;
      GET?.meta?.dob ? set_Return_("dob", GET.meta.dob) : void 0;
      GET?.meta?.zip ? set_Return_("zip", GET.meta.zip) : void 0;
      GET?.meta?.createdAt
        ? set_Return_("createdAt", GET.meta.createdAt)
        : void 0;
      GET?.meta?.lastupdateAt
        ? set_Return_("lastupdateAt", GET.meta.lastupdateAt)
        : void 0;
      GET?.meta?.pubId ? set_Return_("pubId", GET.meta.pubId) : void 0;
      GET?.meta?.isVerified
        ? set_Return_("isVerified", GET.auth.isVerified)
        : void 0;
      GET?.auth?.issuer?.issuedBy
        ? set_Return_("issuer", GET.auth.issuer.issuedBy)
        : void 0;
      GET?.metrics?.profilestatus
        ? set_Return_("profilestatus", GET.metrics.profilestatus)
        : void 0;
      GET?.metrics?.isCUI ? set_Return_("isCUI", GET.metrics.isCUI) : void 0;
      GET?.user?.referal?.referedBy
        ? set_Return_("referedBy", GET.user.referal.referedBy)
        : void 0;
      GET?.user?.followers?.followers?.count > 0
        ? set_Return_("followersCount", GET.user.followers.followers.count)
        : GET?.user?.followers?.followers?.count === 0
        ? set_Return_("followersCount", 0)
        : void 0;
      GET?.user?.followers?.following?.count > 0
        ? set_Return_("followingCount", GET.user.followers.following.count)
        : GET?.user?.followers?.following?.count === 0
        ? set_Return_("followingCount", 0)
        : void 0;

      let message = "ok";
      rs.status(200).json(response(message).success(_RETURN_));
      /* */
    } else {
      let message = "nothing to return";
      rs.status(404).json(response(message).warn());
    }
  } catch (err) {
    pass(err);
  }
}
// get customer info
