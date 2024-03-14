import { Buffer } from "node:buffer";
import { idGenerator } from "../../utils/uid.js";
import dates from "../../utils/dates.js";
import { compareDate } from "../../utils/comparedate.js";

class Campaign {
  constructor(body) {
    this.body = body;
  }

  create() {
    const date = Buffer.from(String(Date.now()));

    let campaignstartdate = this.body.startDate
      ? dates(new Date(this.body.startDate))
      : dates(new Date());

    const obj = {
      _id: idGenerator(25) + date.toString("base64url"),
      _istrashed: false,
      _isstopped: false,
      _admin: this.body.id,
      isActive:
        compareDate(this.body.startDate, dates(new Date()))[1] === 1
          ? true
          : false,
      pubId: idGenerator(25) + date.toString("base64url"),
      noOfcampaigns: this.body.noOfcampaigns,
      meta: {
        options: this.body.options ?? [],
        title: this.body.title,
        value: this.body.value,
        startDate: campaignstartdate,
        endDate: this.body.endDate
          ? dates(new Date(this.body.endDate))
          : "****",
        discount: this.body.discount ?? 0,
        description: this.body.description ?? null,
        cover: this.body.cover ?? null,
      },
      settings: {
        CampaignsPurchasablePerCustomer:
          this.body.CampaignsPurchasablePerCustomer,
        repurchaseCampaignAfter: this.body.repurchaseCampaignAfter,
      },
      users: {
        count: 0,
        entries: [],
      },
      promotion: {
        ispromotion: false,
        promotion: {},
      },
    };

    if (obj.meta.options.includes("membership")) {
      obj.members = {
        count: 0,
        entries: [],
      };
      obj.settings.weeks = this.body.weeks;
      obj.settings.validPerWeek = this.body.validPerWeek || "unlimited";
    }
    return obj;
  }
}

export default Campaign;
