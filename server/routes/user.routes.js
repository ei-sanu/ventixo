import { Router } from "express";
import {
  getCurrentUserProfile,
  syncCurrentUser,
  syncMyEvents,
  updateCurrentUserProfile,
} from "../controllers/user.controller.js";
import { attachUser, requireAuth } from "../middlewares/auth.middleware.js";
import { syncUserValidator } from "../validators/user.validator.js";

const router = Router();

router.post("/sync", requireAuth, syncUserValidator, syncCurrentUser);
router.post("/sync-events", requireAuth, attachUser, syncMyEvents);
router.get("/me", requireAuth, attachUser, getCurrentUserProfile);
router.patch("/me", requireAuth, attachUser, updateCurrentUserProfile);

export default router;
