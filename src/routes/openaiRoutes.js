import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  openaiAssist,
  openaiCode,
  openaiText,
} from "../controllers/openaiController.js";

const router = express.Router();

router.route("/text").post(protect, openaiText);
router.route("/code").post(protect, openaiCode);
router.route("/assist").post(protect, openaiAssist);

export default router;
