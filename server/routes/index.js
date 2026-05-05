import { Router } from "express";
import adminRoutes from "./admin.routes.js";
import eventRoutes from "./event.routes.js";
import userRoutes from "./user.routes.js";

const router = Router();

router.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Ventixo API is healthy",
    timestamp: new Date().toISOString(),
  });
});

router.use("/users", userRoutes);
router.use("/events", eventRoutes);
router.use("/admin", adminRoutes);

export default router;
