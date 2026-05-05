import { Router } from "express";
import { getAnalyticsStats } from "../controllers/analytics.controller.js";
import { requireAuth, attachUser, requireAdmin } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/dashboard", requireAuth, attachUser, requireAdmin, getAnalyticsStats);

export default router;
