import { Router } from "express";
import {
  getCurrentUserProfile,
  updateCurrentUserProfile,
  markNotificationsAsRead,
  registerUser,
  loginUser,
  logoutUser,
  checkUsername,
} from "../controllers/user.controller.js";
import { attachUser, requireAuth } from "../middlewares/auth.middleware.js";

const router = Router();

// Public routes
router.get("/check-username", checkUsername);
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

// Protected routes
router.get("/me", requireAuth, attachUser, getCurrentUserProfile);
router.patch("/me", requireAuth, attachUser, updateCurrentUserProfile);
router.post("/notifications/read", requireAuth, attachUser, markNotificationsAsRead);

export default router;
