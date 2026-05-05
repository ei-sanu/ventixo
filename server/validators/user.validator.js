import { query, body } from "express-validator";
import { validateRequest } from "./common.validator.js";

export const syncUserValidator = [
  body("username")
    .optional()
    .isString()
    .withMessage("username must be a string")
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage("username must be between 3 and 30 characters")
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage("username may only contain letters, numbers, and underscores")
    .toLowerCase(),
  validateRequest,
];

export const adminUserSearchValidator = [
  query("username")
    .optional()
    .isString()
    .withMessage("username must be a string")
    .trim()
    .isLength({ min: 1, max: 30 })
    .withMessage("username search must be between 1 and 30 characters"),
  query("userId")
    .optional()
    .isString()
    .withMessage("userId must be a string")
    .trim()
    .isLength({ min: 1, max: 8 })
    .withMessage("userId search must be between 1 and 8 characters")
    .matches(/^[0-9]+$/)
    .withMessage("userId search must contain only digits"),
  validateRequest,
];
