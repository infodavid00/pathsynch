import { digitGenerator, idGenerator } from "../../utils/uid.js";

class Support {
  constructor(body) {
    this.body = body;
  }

  create() {
    const obj = {
      _id: idGenerator(30),
      name: this.body.name,
      contactinfo: {
        mobile: this.body.mobile,
        email: this.body.email,
      },
      meta: {
        company: this.body.company,
        natureOfwork: this.body.natureOfwork,
      },
      message: this.body.message,
      responded: false,
      supportId: `#${digitGenerator(5)}`,
    };
    return obj;
  }
}

export default Support;
