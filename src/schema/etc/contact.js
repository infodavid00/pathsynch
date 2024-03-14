class Contact {
  constructor(body) {
    this.body = body;
  }

  create() {
    const obj = {
      name: {
        fname: this.body.fname,
        lname: this.body.lname,
      },
      contactinfo: {
        mobile: this.body.mobile,
        email: this.body.email,
      },
      message: this.body.message,
    };
    return obj;
  }
}

export default Contact;
