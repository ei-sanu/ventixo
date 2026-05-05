import { Router } from "express";
import {
  createCurrentUserEvent,
  getMyEvents,
  getOngoingPublishedEvents,
  joinCurrentUserToEvent,
} from "../controllers/event.controller.js";
import { attachUser, requireAuth } from "../middlewares/auth.middleware.js";
import { createEventValidator, mongoIdParamValidator } from "../validators/event.validator.js";

const router = Router();

router.get("/ongoing", getOngoingPublishedEvents);
router.post("/create", requireAuth, attachUser, createEventValidator, createCurrentUserEvent);
router.get("/my-events", requireAuth, attachUser, getMyEvents);
router.post("/:id/join", requireAuth, attachUser, mongoIdParamValidator, joinCurrentUserToEvent);

export default router;
