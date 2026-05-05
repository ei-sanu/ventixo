import { Router } from "express";
import { getCurrentUserProfile, syncCurrentUser } from "../controllers/user.controller.js";
import { attachUser, requireAuth } from "../middlewares/auth.middleware.js";
import { syncUserValidator } from "../validators/user.validator.js";

const router = Router();

router.post("/sync", requireAuth, syncUserValidator, syncCurrentUser);
router.get("/me", requireAuth, attachUser, getCurrentUserProfile);

export default router;
