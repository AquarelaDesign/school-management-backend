import asyncHandler from "express-async-handler";
import {
  sendMail,
  getMails,
} from "../backgroundServices/helpers/emailHelpers.js";

export const sendEmail = asyncHandler(async (req, res) => {
  try {
    const ret = await sendMail(req.body);
    res.status(201).json({ status: ret, error: "" });
  } catch (error) {
    console.log(error);
    res.status(403).json({ status: "Error", error });
  }
});

export const getEmails = asyncHandler(async (req, res) => {
  console.log(req.body);
  try {
    const ret = await getMails(req.body);
    res.status(201).json({ status: ret, error: "" });
  } catch (error) {
    console.log(error);
    res.status(403).json({ status: "Error", error });
  }
});
