import express from "express";
const router = express.Router();

import { protect, admin } from "../middleware/authMiddleware.js";
import {
  addTeacher,
  deleteTeacher,
  getAllTeachers,
  updateTeacher,
} from "../controllers/teacherController.js";

router.route("/").post(protect, admin, addTeacher);
router.route("/").get(protect, admin, getAllTeachers);
router.route("/:id").put(protect, admin, updateTeacher);
router.route("/:id").delete(protect, admin, deleteTeacher);

export default router;
