import express from "express";
const router = express.Router();

import { getEmails, sendEmail } from "../controllers/emailController.js";

router.route("/sendemail").post(sendEmail);
router.route("/getemails").post(getEmails);

export default router;
