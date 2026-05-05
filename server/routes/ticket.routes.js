import { Router } from "express";
import { validateTicketController, getMyTickets } from "../controllers/ticket.controller.js";
import { attachUser, requireAuth } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/my-tickets", requireAuth, attachUser, getMyTickets);
router.post("/validate", requireAuth, attachUser, validateTicketController);

export default router;
