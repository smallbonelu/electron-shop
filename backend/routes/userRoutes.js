import express from "express";
import {
  authUser,
  getUserProfile,
  getUsers,
  registerUser,
  signOutUser,
  updateUserProfile,
  deleteUser,
  getUserById,
  updateUser,
} from "../controllers/userController.js";
import { isAdmin, protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.route("/").post(registerUser).get(protect, isAdmin, getUsers);

router
  .route("/:id")
  .delete(protect, isAdmin, deleteUser)
  .get(protect, getUserById)
  .put(protect, isAdmin, updateUser);

router.post("/login", authUser);
router.post("/logout", signOutUser);
router
  .route("/profile")
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

export default router;
