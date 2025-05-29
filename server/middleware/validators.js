/**
 * @fileoverview
 * Express-validator middlewares for validating input data on authentication and messages.
 * Each exported middleware validates request body fields and returns 400 on failure.
 */

const { body, validationResult } = require("express-validator");

/**
 * Validate registration input fields:
 * - username: required, trimmed, not empty
 * - email: required, trimmed, valid email format
 * - password: required, not empty
 */
const validateRegister = [
  body("username")
    .trim()
    .notEmpty()
    .withMessage("Username is required"),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email"),
  body("password")
    .notEmpty()
    .withMessage("Password is required"),
  // error formatter and short-circuit handler
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });
    next();
  },
];

/**
 * Validate login input fields:
 * - email: required, trimmed, valid email
 * - password: required, not empty
 */
const validateLogin = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email"),
  body("password")
    .notEmpty()
    .withMessage("Password is required"),
  // error handler
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });
    next();
  },
];

/**
 * Validate message content:
 * - content: required, trimmed, not empty, max length 500 chars
 */
const validateMessageContent = [
  body("content")
    .trim()
    .notEmpty()
    .withMessage("Content is required")
    .isLength({ max: 500 })
    .withMessage("Content cannot exceed 500 characters"),
  // error handler
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });
    next();
  },
];

module.exports = {
  validateRegister,
  validateLogin,
  validateMessageContent,
};