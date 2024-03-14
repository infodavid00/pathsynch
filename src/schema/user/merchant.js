import { Buffer } from "node:buffer";
import { idGenerator } from "../../utils/uid.js";
import { _appname, _usertypeA } from "../../.config/var/application.js";
import dates from "../../utils/dates.js";

class Merchant {
  constructor(body) {
    this.body = body;
  }

  register() {
    const date = Buffer.from(String(Date.now()));

    const obj = {
      _id: idGenerator(15) + date.toString("base64url"),
      auth: {
        issuer: { issuedBy: _appname, uid: null },
        isVerified: false,
        password: this.body.password,
      },
      meta: {
        type: _usertypeA,
        email: this.body.email,
        profile: this.body.profile ?? null,
        logo: null,
        name: {
          fname: this.body.fname,
          lname: this.body.lname,
        },
        details: null,
        buisnessName: this.body.buisnessname,
        landline: this.body.landline,
        trail: this.body.trail ?? null, 
        buisnessAddress: {
          city: this.body.city,
          state: this.body.state,
          zip: this.body.zip ?? null,
          address: this.body.address ?? null,
        },
        buisnessType: {
          category: this.body.category,
          servicesTypes: this.body.servicesTypes ?? [], //must be type array
          services: this.body.services ?? [], //must be type array
        },
        createdAt: dates(new Date()),
        lastupdateAt: dates(new Date()),
        pubId: idGenerator(15) + date.toString("base64url"),
      },
      user: {
        referal: {
          referedBy: this.body.referedBy ?? "default",
        },
        favourites: {
          campaigns: [],
          users: [],
        },
        etc: {},
        social: {
          linkedin: null,
          twitter: null,
          instagram: null,
          facebook: null,
        },
        website: null,
        followers: {
          following: {
            count: 0,
            users: [],
          },
          followers: {
            count: 0,
            users: [],
          },
        },
      },
      merchant: {
        campaignCount: 0,
        campaigns: [],
        promotions: [],
        bank: [],
      },
    };
    // schema
    return obj;
  }
  // issuer can be only Google, Apple or Default
  // register user schema
}

export default Merchant;
