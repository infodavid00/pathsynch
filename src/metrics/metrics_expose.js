// keeps track of requests to generate metrics
// stores requests by routes (secs)
// stores secs (requests by routes) by dates (day)
// stores active users (by weeks)

/* 
     format should be (DAILY REPORT) :
     monday 11th october: {
        date: monday 11th october,
        trbrpd: {
           admin: no of requests,
           auth: no of requests,
           customers: no of requests,
           merchant: no of requests,
           user: no of requests
        },
        trpd: total requests from ENTRY POINT
     }
     where trbrpd stands for total requests by routes per day, and trpd stands for total
     requests per day
  */
/*
   when requests are made, its written directly in the Metrics class (primary bucket),
   once the _EXTEND_ function starts, it firstly sets the registery to 1 (pausing
   the primary bucket, therefore making all new values to be redirected and written to 
   the alternate bucket). the _EXTEND_ function now picks up the data from the primary 
   bucket, and write it to the JOURNAL (generating a schema), ready for db inserting.

   after successfully inserting to db, it clears all the values of the primary bucket
   ,and set the registry back to 0 (new requests are now writen in the primary bucket).
   it then adds up the alternate buckets values to the primary bucket and clears the 
   alternate bucket, before acknowledge the requests.

   note that if you call the _PREMATUREXPOSE method, it gets the current value of the 
   primary bucket and write it to the journal to generate a schema also, which is
   returned back as a response
   */
function Journal(date, admin, auth, merchant, customer, user, entry) {
  let obj = {
    date,
    trbrpd: { admin, auth, customer, merchant, user },
    trpd: entry,
  };
  return obj;
}
/* journal for writing the values temporaly to generate schema */

class Alternatebucket {
  constructor() {
    this.$b1_admin = 0;
    this.$b1_auth = 0;
    this.$b1_merchant = 0;
    this.$b1_customer = 0;
    this.$b1_user = 0;
    this.$b1_entry = 0;
  }
}
/* the alternate bucket */

class Metrics extends Alternatebucket {
  constructor() {
    super();
    this.registery = 0;
    this.date = new Date();
    this.admin = 0;
    this.auth = 0;
    this.merchant = 0;
    this.customer = 0;
    this.user = 0;
    this.entry = 0;
  }

  async _EXTEND_() {
    this.registery = 1;
    /* redirects all requests to the alternate bucket */

    const date = this.date,
      admin = this.admin,
      auth = this.auth,
      merchant = this.merchant,
      customer = this.customer,
      user = this.user,
      entry = this.entry;
    /* pick up the data from the primary bucket */

    const primaryjournal = Journal(
      date,
      admin,
      auth,
      merchant,
      customer,
      user,
      entry
    );
    /* write to the journal and generate a schema */

    const insertodb = setTimeout(() => primaryjournal, 5000);
    /* call to database */

    this.registery = 0;
    this.date = new Date();
    this.admin = 0 + this.$b1_admin;
    this.auth = 0 + this.$b1_auth;
    this.merchant = 0 + this.$b1_merchant;
    this.customer = 0 + this.$b1_customer;
    this.user = 0 + this.$b1_user;
    this.entry = 0 + this.$b1_entry;

    return true;
  }

  _pipe_entry() {
    this.registery === 0 ? (this.entry += 1) : (this.$b1_entry += 1);
    return true;
  }
  _pipe_admin() {
    this.registery === 0 ? (this.admin += 1) : (this.$b1_admin += 1);
    return true;
  }
  _pipe_auth() {
    this.registery === 0 ? (this.auth += 1) : (this.$b1_auth += 1);
    return true;
  }
  _pipe_merchant() {
    this.registery === 0 ? (this.merchant += 1) : (this.$b1_merchant += 1);
    return true;
  }
  _pipe_customer() {
    this.registery === 0 ? (this.customer += 1) : (this.$b1_customer += 1);
    return true;
  }
  _pipe_user() {
    this.registery === 0 ? (this.user += 1) : (this.$b1_user += 1);
    return true;
  }

  _PREMATUREXPOSE_() {
    const date = this.date,
      admin = this.admin,
      auth = this.auth,
      merchant = this.merchant,
      customer = this.customer,
      user = this.user,
      entry = this.entry;
    const primaryjournal = Journal(
      date,
      admin,
      auth,
      merchant,
      customer,
      user,
      entry
    );
    console.log(
      this.$b1_admin,
      this.$b1_auth,
      this.$b1_merchant,
      this.$b1_customer,
      this.$b1_user,
      this.$b1_entry
    );
    console.log(this.registery);
    return primaryjournal;
  }
  /* the premature expose method. */

  static _metrics_() {
    if (!Metrics.instance) {
      Metrics.instance = new Metrics();
    }
    return Metrics.instance;
  }
  /* the static method exposed to public so as to make sure only 1 instance lives */
}

const _metrics_ = Metrics._metrics_();
/* call class here */

const _pipe_entry = (rq, rs, next) => {
  _metrics_._pipe_entry();
  next();
};
/* pipe entry */

const _pipe_auth = (rq, rs, next) => {
  _metrics_._pipe_auth();
  next();
};
/* pipe auth */

const _pipe_admin = (rq, rs, next) => {
  _metrics_._pipe_admin();
  next();
};
/* pipe admin */

const _pipe_user = (rq, rs, next) => {
  _metrics_._pipe_user();
  next();
};
/* pipe user */

const _pipe_merchant = (rq, rs, next) => {
  _metrics_._pipe_merchant();
  next();
};
/* pipe merchant */

const _pipe_customer = (rq, rs, next) => {
  _metrics_._pipe_customer();
  next();
};
/* pipe customer */

const _PREMATUREXPOSE_ = (rq, rs, next) => {
  const x = _metrics_._PREMATUREXPOSE_();
  console.log(x);
  next();
};
/* premature expose */

export {
  _pipe_entry,
  _PREMATUREXPOSE_,
  _pipe_admin,
  _pipe_auth,
  _pipe_merchant,
  _pipe_customer,
  _pipe_user,
  _metrics_,
};
