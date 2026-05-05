import { Router } from "express";
import {
  approveEventById,
  listEvents,
  listUsers,
  rejectEventById,
} from "../controllers/admin.controller.js";
import { attachUser, requireAdmin, requireAuth } from "../middlewares/auth.middleware.js";
import { mongoIdParamValidator } from "../validators/event.validator.js";
import { adminUserSearchValidator } from "../validators/user.validator.js";

const router = Router();

router.use(requireAuth, attachUser, requireAdmin);

router.get("/events", listEvents);
router.patch("/events/:id/approve", mongoIdParamValidator, approveEventById);
router.patch("/events/:id/reject", mongoIdParamValidator, rejectEventById);
router.get("/users", adminUserSearchValidator, listUsers);

export default router;
