import { _usertypeA } from "../../../.config/var/application.js";
import {
  querygetsocial_website,
  querygetdetails,
  querygetmenu_logo,
  querygetmerchantinfo,
  querygetallmerchants,
  querygetonemerchant,
  querylocateidwithpubId,
  querygetcamaignsmerchant,
  querygetpromotionsmerchant,
} from "../../../models/merchant/get.js";
import { getCampaignTrash } from "../../../models/merchant/set.js";
import { compareDate } from "../../../utils/comparedate.js";
import dates from "../../../utils/dates.js";
import Response from "../../../utils/response.js";

const response = (message) => new Response(message);

export async function getmedia_website(rq, rs, pass) {
  const { id } = await rq.body;
  try {
    const data = await querygetsocial_website(id);

    if (data !== null) {
      const medias = data?.user?.social;
      const web = data?.user?.website;
      let message = "ok";
      rs.status(200).json(response(message).success({ medias, web }));
    } else {
      let message = "user not found";
      rs.status(404).json(response(message).warn());
    }
  } catch (err) {
    pass(err);
  }
}
// get medias and websites

export async function getdetails(rq, rs, pass) {
  const { id } = await rq.body;
  try {
    const data = await querygetdetails(id);
    if (data !== null) {
      const details = data?.meta?.details;
      let message = "ok";
      rs.status(200).json(response(message).success({ details }));
    } else {
      let message = "user not found";
      rs.status(404).json(response(message).warn());
    }
  } catch (err) {
    pass(err);
  }
}
// get details

export async function getmenu_logo(rq, rs, pass) {
  const { id } = await rq.body;
  try {
    const data = await querygetmenu_logo(id);
    if (data !== null) {
      const menu = data?.meta?.profile;
      const logo = data?.meta?.logo;
      let message = "ok";
      rs.status(200).json(response(message).success({ menu, logo }));
    } else {
      let message = "user not found";
      rs.status(404).json(response(message).warn());
    }
  } catch (err) {
    pass(err);
  }
}
// get menu and logo

/*
[]
isVerified,
issuer,
type,
email,
menu,
logo,
name,
landline,
details,
buisnessName,
buisnessaddress,
createdAt,
lastupdateAt,
pubId,
referedBy,
followersCount,
followingCount,
campaignCount
[]
Users Data Retrievable
*/
export async function getmerchantinfo(rq, rs, pass) {
  const body = await rq.body;
  try {
    const _PROJECTION_ = { _id: 0 };
    /* the projection for the database. */

    function set_Projection_(field) {
      _PROJECTION_[field] = 1;
      return void 0;
    }
    /* func f0r setting projection. */

    body.isVerified ? set_Projection_("auth.isVerified") : void 0;
    body.issuer ? set_Projection_("auth.issuer.issuedBy") : void 0;
    body.type ? set_Projection_("meta.type") : void 0;
    body.email ? set_Projection_("meta.email") : void 0;
    body.menu ? set_Projection_("meta.profile") : void 0;
    body.logo ? set_Projection_("meta.logo") : void 0;
    body.name ? set_Projection_("meta.name") : void 0;
    body.landline ? set_Projection_("meta.landline") : void 0;
    body.details ? set_Projection_("meta.details") : void 0;
    body.buisnessName ? set_Projection_("meta.buisnessName") : void 0;
    body.buisnessAddress ? set_Projection_("meta.buisnessAddress") : void 0;
    body.createdAt ? set_Projection_("meta.createdAt") : void 0;
    body.lastupdateAt ? set_Projection_("meta.lastupdateAt") : void 0;
    body.pubId ? set_Projection_("meta.pubId") : void 0;
    body.referedBy ? set_Projection_("user.referal.referedBy") : void 0;
    body.followersCount
      ? set_Projection_("user.followers.followers.count")
      : void 0;
    body.followingCount
      ? set_Projection_("user.followers.following.count")
      : void 0;
    body.campaignCount ? set_Projection_("merchant.campaignCount") : void 0;

    const GET = await querygetmerchantinfo(body.id, _PROJECTION_);

    if (GET !== null) {
      const _RETURN_ = {};
      /* the returning object */

      function set_Return_(field, value) {
        _RETURN_[field] = value;
        return void 0;
      }
      /* func f0r setting return. */

      GET?.auth?.isVerified
        ? set_Return_("isVerified", GET.auth.isVerified)
        : void 0;
      GET?.auth?.issuer?.issuedBy
        ? set_Return_("issuer", GET.auth.issuer.issuedBy)
        : void 0;
      GET?.meta?.type ? set_Return_("type", GET.meta.type) : void 0;
      GET?.meta?.email ? set_Return_("email", GET.meta.email) : void 0;
      GET?.meta?.profile ? set_Return_("menu", GET.meta.profile) : void 0;
      GET?.meta?.logo ? set_Return_("logo", GET.meta.logo) : void 0;
      GET?.meta?.name ? set_Return_("name", GET.meta.name) : void 0;
      GET?.meta?.landline ? set_Return_("landline", GET.meta.landline) : void 0;
      GET?.meta?.details ? set_Return_("details", GET.meta.details) : void 0;
      GET?.meta?.buisnessName
        ? set_Return_("buisnessName", GET.meta.buisnessName)
        : void 0;
      GET?.meta?.buisnessAddress
        ? set_Return_("buisnessAddress", GET.meta.buisnessAddress)
        : void 0;
      GET?.meta?.createdAt
        ? set_Return_("createdAt", GET.meta.createdAt)
        : void 0;
      GET?.meta?.lastupdateAt
        ? set_Return_("lastupdateAt", GET.meta.lastupdateAt)
        : void 0;
      GET?.meta?.pubId ? set_Return_("pubId", GET.meta.pubId) : void 0;
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
      GET?.merchant?.campaignCount > 0
        ? set_Return_("campaignCount", GET.merchant.campaignCount)
        : GET?.merchant?.campaignCount === 0
        ? set_Return_("campaignCount", 0)
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
// get merchant info

function _projection_(body) {
  const _PROJECTION_ = { _id: 0 };
  function set_Projection_(field) {
    _PROJECTION_[field] = 1;
    return void 0;
  }
  body.isVerified ? set_Projection_("auth.isVerified") : void 0;
  body.issuer ? set_Projection_("auth.issuer.issuedBy") : void 0;
  body.type ? set_Projection_("meta.type") : void 0;
  body.email ? set_Projection_("meta.email") : void 0;
  body.menu ? set_Projection_("meta.profile") : void 0;
  body.logo ? set_Projection_("meta.logo") : void 0;
  body.name ? set_Projection_("meta.name") : void 0;
  body.landline ? set_Projection_("meta.landline") : void 0;
  body.details ? set_Projection_("meta.details") : void 0;
  body.buisnessName ? set_Projection_("meta.buisnessName") : void 0;
  body.buisnessAddress ? set_Projection_("meta.buisnessAddress") : void 0;
  body.createdAt ? set_Projection_("meta.createdAt") : void 0;
  body.lastupdateAt ? set_Projection_("meta.lastupdateAt") : void 0;
  body.pubId ? set_Projection_("meta.pubId") : void 0;
  body.referedBy ? set_Projection_("user.referal.referedBy") : void 0;
  body.followersCount
    ? set_Projection_("user.followers.followers.count")
    : void 0;
  body.followingCount
    ? set_Projection_("user.followers.following.count")
    : void 0;
  body.campaignCount ? set_Projection_("merchant.campaignCount") : void 0;

  return _PROJECTION_;
}
/* the projection function. */

/*
  all : get all merchants
  city : get all merchants where city is <value of city>
  state : get all merchants where state is <value of state>
  zip : get all merchants where zip is <value of zip>
  category : get all merchants where category is <value of category>
  servicesTypes : get all merchants where servicesTypes has <value of servicesTypes>
  services : get all merchants where services has <value of services>
  creation : get all users where creation date is <value of creation>
*/
export async function getallmerchants(rq, rs, pass) {
  const size = Number(await rq.query.size) || 10;
  const page = Number(await rq.query.page) * size || 0 * size;
  const { projection, query } = await rq.body;

  let _query_ = { "auth.isVerified": true, "meta.type": _usertypeA };
  function addquery(key, val) {
    _query_[key] = val;
    return void 0;
  }
  /* the query object and add query function. */

  query.all
    ? (addquery("auth.isVerified", true), addquery("meta.type", _usertypeA))
    : void 0;
  query.city ? addquery("meta.buisnessAddress.city", query.city) : void 0;
  query.state ? addquery("meta.buisnessAddress.state", query.state) : void 0;
  query.zip ? addquery("meta.buisnessAddress.zip", query.zip) : void 0;
  query.trail ? addquery("meta.trail", query.trail) : void 0;
  query.category
    ? addquery("meta.buisnessType.category", query.category)
    : void 0;
  query.servicesTypes
    ? addquery("meta.buisnessType.servicesTypes", query.servicesTypes)
    : void 0;
  query.services
    ? addquery("meta.buisnessType.services", query.services)
    : void 0;
  query.creation ? addquery("meta.createdAt", query.creation) : void 0;
  /* done with query. */
  try {
    const GET = await querygetallmerchants(
      _projection_(projection),
      page,
      size,
      _query_
    );
    /* get the merchants */
    if (GET !== null && Array.isArray(GET)) {
      const transformedArray = GET.map((item) => {
        const transformedObject = {};

        if (item?.auth?.isVerified)
          transformedObject.isVerified = item.auth.isVerified;
        if (item?.auth?.issuer?.issuedBy)
          transformedObject.issuer = item.auth.issuer.issuedBy;
        if (item?.meta?.type) transformedObject.type = item.meta.type;
        if (item?.meta?.email) transformedObject.email = item.meta.email;
        if (item?.meta?.profile) transformedObject.menu = item.meta.profile;
        if (item?.meta?.logo) transformedObject.logo = item.meta.logo;
        if (item?.meta?.name) transformedObject.name = item.meta.name;
        if (item?.meta?.trail) transformedObject.trail = item.meta.trail;
        if (item?.meta?.landline)
          transformedObject.landline = item.meta.landline;
        if (item?.meta?.details) transformedObject.details = item.meta.details;
        if (item?.meta?.buisnessName)
          transformedObject.buisnessName = item.meta.buisnessName;
        if (item?.meta?.buisnessAddress)
          transformedObject.buisnessAddress = item.meta.buisnessAddress;
        if (item?.meta?.createdAt)
          transformedObject.createdAt = item.meta.createdAt;
        if (item?.meta?.lastupdateAt)
          transformedObject.lastupdateAt = item.meta.lastupdateAt;
        if (item?.meta?.pubId) transformedObject.pubId = item.meta.pubId;
        if (item?.user?.referal?.referedBy)
          transformedObject.referedBy = item.user.referal.referedBy;
        if (item?.user?.followers?.followers?.count > 0)
          transformedObject.followersCount =
            item.user.followers.followers.count;
        if (item?.user?.followers?.following?.count > 0)
          transformedObject.followingCount =
            item.user.followers.following.count;
        if (item?.merchant?.campaignCount > 0)
          transformedObject.campaignCount = item.merchant.campaignCount;

        return transformedObject;
      });

      /* the returning object */
      let message = "ok";
      rs.status(200).json(response(message).success(transformedArray));
      /* */
    } else {
      let message = "nothing to return";
      rs.status(404).json(response(message).warn());
    }
  } catch (err) {
    pass(err);
  }
}
// get all merchants

export async function getonemerchant(rq, rs, pass) {
  const { projection } = await rq.body;
  const { merchantid } = await rq.params;
  try {
    const mainid = (await querylocateidwithpubId(merchantid)) || "O";
    const GET = await querygetonemerchant(mainid, _projection_(projection));
    /* get the user */

    if (GET !== null) {
      const _RETURN_ = {};
      /* the returning object */

      function set_Return_(field, value) {
        _RETURN_[field] = value;
        return void 0;
      }
      /* func f0r setting return. */

      GET?.auth?.isVerified
        ? set_Return_("isVerified", GET.auth.isVerified)
        : void 0;
      GET?.auth?.issuer?.issuedBy
        ? set_Return_("issuer", GET.auth.issuer.issuedBy)
        : void 0;
      GET?.meta?.type ? set_Return_("type", GET.meta.type) : void 0;
      GET?.meta?.email ? set_Return_("email", GET.meta.email) : void 0;
      GET?.meta?.profile ? set_Return_("menu", GET.meta.profile) : void 0;
      GET?.meta?.logo ? set_Return_("logo", GET.meta.logo) : void 0;
      GET?.meta?.name ? set_Return_("name", GET.meta.name) : void 0;
      GET?.meta?.landline ? set_Return_("landline", GET.meta.landline) : void 0;
      GET?.meta?.details ? set_Return_("details", GET.meta.details) : void 0;
      GET?.meta?.buisnessName
        ? set_Return_("buisnessName", GET.meta.buisnessName)
        : void 0;
      GET?.meta?.buisnessAddress
        ? set_Return_("buisnessAddress", GET.meta.buisnessAddress)
        : void 0;
      GET?.meta?.createdAt
        ? set_Return_("createdAt", GET.meta.createdAt)
        : void 0;
      GET?.meta?.lastupdateAt
        ? set_Return_("lastupdateAt", GET.meta.lastupdateAt)
        : void 0;
      GET?.meta?.pubId ? set_Return_("pubId", GET.meta.pubId) : void 0;
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
      GET?.merchant?.campaignCount > 0
        ? set_Return_("campaignCount", GET.merchant.campaignCount)
        : GET?.merchant?.campaignCount === 0
        ? set_Return_("campaignCount", 0)
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
// get one merchant

/*
accepted query types = all, active, expired, promoted, upcoming
accepted filter = recent, mostsales, mostreview, topdiscocunt, filterbyprice
 */
export async function getcampaignsMerchant(rq, rs, pass) {
  const { page: pageq, size: sizeq, filter } = await rq.query;
  const { id: merchantid } = await rq.body;
  const { query } = await rq.params;

  const size = Number(await sizeq) || 10;
  const page = Number(await pageq) * size || 0 * size;

  try {
    if (
      query === "all" ||
      query === "active" ||
      query === "expired" ||
      query === "promoted" ||
      query === "upcoming"
    ) {
      if (
        !filter ||
        (filter &&
          (filter === "recent" ||
            filter === "mostsales" ||
            filter === "mostreview" ||
            filter === "topdiscocunt" ||
            filter.startsWith("filterbyprice")))
      ) {
        /* */
        const docs = await querygetcamaignsmerchant(merchantid);

        if (docs.length > 0) {
          let preprocessed;
          if (query === "all") {
            preprocessed = docs;
            // check if query is for all
          } else if (query === "active") {
            preprocessed = docs.filter((elem) => elem.isActive === true);
            // check if query is for isActive
          } else if (query === "expired") {
            preprocessed = docs.filter((elem) => {
              compareDate(elem.meta.endDate, dates(new Date()))[1] === 2;
            });
            // check if query is for expired
          } else if (query === "promoted") {
            preprocessed = docs.filter(
              (elem) => elem.promotion.ispromotion === true
            );
            // check if query is for promoted
          } else if (query === "upcoming") {
            preprocessed = docs.filter(
              (elem) =>
                compareDate(elem.meta.startDate, dates(new Date()))[1] === 1
            );
            // check if query is for upcoming
          } else {
            preprocessed = docs;
            // preprocessed should take all docs. since else
          }

          /* now the docs has been cleaned and its in the preprocessed variable.
            filterin now before ending request. */

          let filtered;
          if (!filter) {
            filtered = preprocessed;
            // if not filtered
          } else if (filter && filter === "recent") {
            filtered = preprocessed.reverse();
            // sort based on creation Date
          } else if (filter && filter === "mostsales") {
            filtered = preprocessed;
            filtered.sort((a, b) => b.users.count - a.users.count);
            // sort based on users
          } else if (filter && filter === "mostreview") {
            filtered = preprocessed;
            filtered.sort((a, b) => b.reviews - a.reviews);
            // sort based on most reviewed
          } else if (filter && filter === "topdiscocunt") {
            filtered = preprocessed;
            filtered.sort((a, b) => b.meta.discount - a.meta.discount);
            // sort based on discounts
          } else if (filter && filter.startsWith("filterbyprice")) {
            filtered = preprocessed;
            filtered.sort((a, b) => b.meta.value - a.meta.value);
            // sort based on price
          } else {
            filtered = preprocessed;
            // do same as if not filtered
          }

          /* now we have filtered and query the docs, now we need to add pagignation
             and send the request. 
          */
          let newarray = []; // the actal array storing the new format
          let workingindex; // the variable holding the current array work is done on
          if (newarray.length < 1) {
            newarray.push([]);
            workingindex = 0;
          }
          for (let x = 0; x < filtered.length; x++) {
            if (newarray[workingindex].length < size) {
              newarray[workingindex].push(filtered[x]);
            } else {
              newarray.push([]);
              workingindex = workingindex + 1;
              newarray[workingindex].push(filtered[x]);
            }
          }
          let final = newarray[page];

          let finalA = final.map((item) => {
            let currentDate = dates(new Date());
            return {
              pubId: item.pubId,
              title: item.meta.title,
              value: item.meta.value,
              discount: item.meta.discount,
              tag:
                compareDate(item.meta.endDate, currentDate)[1] === 2
                  ? "expired"
                  : compareDate(item.meta.startDate, currentDate)[1] === 1
                  ? "upcoming"
                  : item.promotion.ispromotion
                  ? "promotion"
                  : "",
              cover: item.meta.cover,
              promotion: item.promotion.ispromotion
                ? item.promotion.promotion.active.plan
                : null,
            };
          });

          let message = true;
          rs.status(200).json(response(message).success(finalA));
          /* */
        } else {
          let message = "no campaign found.";
          rs.status(404).json(response(message).warn());
        }
        /* */
      } else {
        let message =
          "ERR : filter can only be recent, mostsales, mostreview, topdiscocunt or filterbyprice.";
        rs.status(400).json(response(message).warn());
      }
    } else {
      let message =
        "ERR : query can only be all, active, expired, promoted or upcoming.";
      rs.status(400).json(response(message).warn());
    }
  } catch (err) {
    pass(err);
  }
}
// get campaigns merchant.

/*
accepted query types = activepromotions, expiredpromotions,  upcomingpromotions
accepted filter = recent, mostsales, mostreview, topdiscocunt, filterbyprice
 */
export async function getpromotionsMerchant(rq, rs, pass) {
  const { page: pageq, size: sizeq, filter } = await rq.query;
  const { id: merchantid } = await rq.body;
  const { query } = await rq.params;

  const size = Number(await sizeq) || 10;
  const page = Number(await pageq) * size || 0 * size;

  try {
    if (
      query === "all" ||
      query === "active" ||
      query === "expired" ||
      query === "upcoming"
    ) {
      if (
        !filter ||
        (filter &&
          (filter === "recent" ||
            filter === "mostsales" ||
            filter === "mostreview" ||
            filter === "topdiscocunt" ||
            filter.startsWith("filterbyprice")))
      ) {
        /* */
        const docs = await querygetpromotionsmerchant(merchantid);

        if (docs.length > 0) {
          let preprocessed;
          if (query === "active") {
            preprocessed = docs.filter((elem) => elem.isActive === true);
            // check if query is for isActive
          } else if (query === "expired") {
            preprocessed = docs.filter(
              (elem) =>
                compareDate(elem.meta.endDate, dates(new Date()))[1] === 2
            );
            // check if query is for expired
          } else if (query === "upcoming") {
            let currentDate = dates(new Date());
            preprocessed = docs.filter(
              (elem) => compareDate(elem.meta.startDate, currentDate)[1] === 1
            );
            // check if query is for upcoming
          } else {
            preprocessed = docs;
            // preprocessed should take all docs. since else
          }
          /* now the docs has been cleaned and its in the preprocessed variable.
             filterin now before ending request. */
          let filtered;
          if (!filter) {
            filtered = preprocessed;
            // if not filtered
          } else if (filter && filter === "recent") {
            filtered = preprocessed.reverse();
            // sort based on creation Date
          } else if (filter && filter === "mostsales") {
            filtered = preprocessed;
            filtered.sort((a, b) => b.users.count - a.users.count);
            // sort based on users
          } else if (filter && filter === "mostreview") {
            filtered = preprocessed;
            filtered.sort((a, b) => b.reviews - a.reviews);
            // sort based on most reviewed
          } else if (filter && filter === "topdiscocunt") {
            filtered = preprocessed;
            filtered.sort((a, b) => b.meta.discount - a.meta.discount);
            // sort based on discounts
          } else if (filter && filter.startsWith("filterbyprice")) {
            filtered = preprocessed;
            filtered.sort((a, b) => b.meta.value - a.meta.value);
            // sort based on price
          } else {
            filtered = preprocessed;
            // do same as if not filtered
          }
          /* now we have filtered and query the docs, now we need to add pagignation
             and send the request.
          */
          let newarray = []; // the actal array storing the new format
          let workingindex; // the variable holding the current array work is done on
          if (newarray.length < 1) {
            newarray.push([]);
            workingindex = 0;
          }
          for (let x = 0; x < filtered.length; x++) {
            if (newarray[workingindex].length < size) {
              newarray[workingindex].push(filtered[x]);
            } else {
              newarray.push([]);
              workingindex = workingindex + 1;
              newarray[workingindex].push(filtered[x]);
            }
          }
          let final = newarray[page];
          let finalA = final.map((item) => {
            let currentDate = dates(new Date());
            return {
              pubId: item.pubId,
              title: item.meta.title,
              value: item.meta.value,
              discount: item.meta.discount,
              tag:
                compareDate(item.meta.startDate, currentDate)[1] === 1
                  ? "upcoming"
                  : compareDate(item.meta.endDate, currentDate)[1] === 2
                  ? "expired"
                  : item.promotion.ispromotion
                  ? "promotion"
                  : "",
              cover: item.meta.cover,
              promotion: item.promotion.promotion.active.plan,
            };
          });
          let message = true;
          rs.status(200).json(response(message).success(finalA));
          /* */
        } else {
          let message = "no campaign found.";
          rs.status(404).json(response(message).warn());
        }
        /* */
      } else {
        let message =
          "ERR : filter can only be recent, mostsales, mostreview, topdiscocunt or filterbyprice.";
        rs.status(400).json(response(message).warn());
      }
    } else {
      let message = "ERR : query can only be all, active, expired or upcoming.";
      rs.status(400).json(response(message).warn());
    }
  } catch (err) {
    pass(err);
  }
}
// get promotions merchant.

export async function getTrash(rq, rs, pass) {
  const { page: pageq, size: sizeq } = await rq.query;
  const { id: merchantid } = await rq.body;

  const size = Number(await sizeq) || 10;
  const page = Number(await pageq) * size || 0 * size;
  try {
    const findDocs = await getCampaignTrash(merchantid, page, size);
    rs.status(200).json(response(true).success(findDocs));
  } catch (err) {
    pass(err);
  }
}
// get trashed campaign
