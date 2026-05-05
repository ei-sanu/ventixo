import { body, param } from "express-validator";
import { EVENT_CATEGORIES, TEAM_TYPES } from "../models/Event.js";
import { validateRequest } from "./common.validator.js";

export const createEventValidator = [
  body("title")
    .isString()
    .withMessage("title must be a string")
    .trim()
    .isLength({ min: 3, max: 120 })
    .withMessage("title must be between 3 and 120 characters"),
  body("description")
    .isString()
    .withMessage("description must be a string")
    .trim()
    .isLength({ min: 10, max: 3000 })
    .withMessage("description must be between 10 and 3000 characters"),
  body("category")
    .isString()
    .withMessage("category must be a string")
    .trim()
    .isIn(EVENT_CATEGORIES)
    .withMessage(`category must be one of: ${EVENT_CATEGORIES.join(", ")}`),
  body("teamType")
    .isString()
    .withMessage("teamType must be a string")
    .trim()
    .isIn(TEAM_TYPES)
    .withMessage(`teamType must be one of: ${TEAM_TYPES.join(", ")}`),
  body("maxParticipants")
    .isInt({ min: 1, max: 10000 })
    .withMessage("maxParticipants must be an integer between 1 and 10000")
    .toInt(),
  body("date").isISO8601().withMessage("date must be a valid ISO 8601 date").toDate(),
  body("location")
    .isString()
    .withMessage("location must be a string")
    .trim()
    .isLength({ min: 2, max: 200 })
    .withMessage("location must be between 2 and 200 characters"),
  validateRequest,
];

export const mongoIdParamValidator = [
  param("id").isMongoId().withMessage("id must be a valid MongoDB ObjectId"),
  validateRequest,
];
