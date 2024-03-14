import { Buffer } from "node:buffer";
import { idGenerator } from "../../utils/uid.js";
import { _usertypeB } from "../../.config/var/application.js";
import dates from "../../utils/dates.js";

class Customer {
  constructor(body) {
    this.body = body;
  }

  register(isverified) {
    const date = Buffer.from(String(Date.now()));
    const points = isverified ? 40 : 10;
    const obj = {
      _id: idGenerator(15) + date.toString("base64url"),
      auth: {
        issuer: { issuedBy: this.body.issuer, uid: this.body?.issuerid },
        isVerified: isverified ? true : false,
        password: this.body.password,
      },
      meta: {
        type: _usertypeB,
        email: this.body.email,
        profile: this.body.profile,
        name: {
          fname: this.body.fname,
          lname: this.body.lname,
        },
        mobile: this.body.mobile,
        dob: this.body.dob ? dates(new Date(this.body.dob)) : null,
        zip: this.body.zip ?? null,
        createdAt: dates(new Date()),
        lastupdateAt: isverified ? dates(new Date()) : null,
        pubId: idGenerator(15) + date.toString("base64url"),
      },
      user: {
        referal: {
          referedBy: this.body.referedBy ?? "default",
          id: idGenerator(15) + date.toString("base64url"),
        },
        favourites: {
          campaigns: [],
          users: [],
        },
        personalization: [],
        path: {
          points: isverified ? 1 : 0,
        },
        savedPayments: {},
        wallet: {
          coupons: [],
          membershipCount: 0,
          ASOC: 0, //amount spent on campaigns
          campaigns: [],
        },
        etc: {},
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
      metrics: {
        profilestatus: this.body.profile ? points + 20 : points + 0,
        isCUI: false, // isCUI as is completed user information
      },
    };
    // schema
    return obj;
  }
  // issuer can be only Google, Apple or Default
  // register user schema
}

export default Customer;
