import express from "express";
import contact from "../controllers/etc/contact.js";
import support from "../controllers/etc/support.js";
import sendapkurl from "../controllers/etc/sendurl.js";

const etc = express.Router();

etc.post("/contact", contact);
/* contact team */
etc.post("/support", support);
/* support center */
etc.get("/get/url/tosendmobile/:mobile", sendapkurl);
/* send app url */

export default etc;
