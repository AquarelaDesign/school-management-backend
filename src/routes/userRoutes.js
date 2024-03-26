import express from "express";
const router = express.Router();

import {
  // verifyResetPassword,
  registerUser,
  authUser,
  sendRestPassword,
  setNewPassword,
  getAllUsers,
  getAllTypeUsers,
  updateProfile,
} from "../controllers/userController.js";

import {
  createPersonal,
  updatePersonal,
  getPersonalById,
  getAllPersonalByUser,
  deletePersonalById,
} from "../controllers/userPersonalController.js";

import {
  createAndress,
  updateAndress,
  getAndressById,
  getAllAndressByUser,
  deleteAndressById,
} from "../controllers/userAndressController.js";

import {
  createContact,
  updateContact,
  getContactById,
  getAllContactByUser,
  deleteContactById,
} from "../controllers/userContactController.js";

import {
  createDocument,
  updateDocument,
  getDocumentById,
  getAllDocumentByUser,
  deleteDocumentById,
} from "../controllers/userDocumentController.js";

import { protect, admin } from "../middleware/authMiddleware.js";

router.route("/").post(registerUser);
router.route("/").get(getAllUsers);
router.route("/alltype/:usertype").get(getAllTypeUsers);
router.route("/update/:id").put(updateProfile);

router.route("/personal").post(createPersonal);
router.route("/personal/:id").put(updatePersonal);
router.route("/personal/:id").get(getPersonalById);
router.route("/personal-user/:userId").get(getAllPersonalByUser);
router.route("/personal/:id").delete(deletePersonalById);

router.route("/andress").post(createAndress);
router.route("/andress/:id").put(updateAndress);
router.route("/andress/:id").get(getAndressById);
router.route("/andress-user/:userId").get(getAllAndressByUser);
router.route("/andress/:id").delete(deleteAndressById);

router.route("/contact").post(createContact);
router.route("/contact/:id").put(updateContact);
router.route("/contact/:id").get(getContactById);
router.route("/contact-user/:userId").get(getAllContactByUser);
router.route("/contact/:id").delete(deleteContactById);

router.route("/document").post(createDocument);
router.route("/document/:id").put(updateDocument);
router.route("/document/:id").get(getDocumentById);
router.route("/document-user/:userId").get(getAllDocumentByUser);
router.route("/document/:id").delete(deleteDocumentById);

router.route("/reset-password").post(sendRestPassword);
router.route("/change-password/:id/:token").post(setNewPassword);

router.post("/login", authUser);
export default router;
