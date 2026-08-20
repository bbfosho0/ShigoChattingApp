/**
 * @fileoverview
 * Authentication routes for registration, login, secure password recovery,
 * and authenticated password changes.
 */

const express = require("express");
const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");

const User = require("../models/User");
const verifyToken = require("../middleware/auth");
const {
  generateResetToken,
  hashResetToken,
  signAuthToken,
} = require("../lib/authTokens");
const {
  createPasswordResetToken,
  consumePasswordResetToken,
  invalidatePasswordResetTokens,
} = require("../lib/passwordRecovery");
const {
  sendPasswordResetEmail,
  sendPasswordChangedEmail,
} = require("../services/email");
const {
  normalizeEmail,
  forgotPasswordIpLimiter,
  forgotPasswordEmailLimiter,
  resetPasswordIpLimiter,
} = require("../middleware/authRateLimits");

const FORGOT_PASSWORD_MESSAGE =
  "If an account exists for that email, a recovery link has been sent.";
const INVALID_RESET_MESSAGE = "This recovery link is invalid or has expired.";
const RESET_SUCCESS_MESSAGE = "Password reset. Sign in with your new password.";
const DEFAULT_FORGOT_MIN_DURATION_MS = 300;

function validationResponder(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  next();
}

const validateRegister = [
  body("username").trim().notEmpty().withMessage("Username is required"),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email"),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters"),
  validationResponder,
];

const validateLogin = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email"),
  body("password").notEmpty().withMessage("Password is required"),
  validationResponder,
];

const validateForgotPassword = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email"),
  validationResponder,
];

const validateResetPassword = [
  body("token").notEmpty().withMessage("Recovery token is required"),
  body("newPassword")
    .notEmpty()
    .withMessage("New password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters"),
  validationResponder,
];

const validateChangePassword = [
  body("currentPassword").notEmpty().withMessage("Current password is required"),
  body("newPassword")
    .notEmpty()
    .withMessage("New password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters"),
  validationResponder,
];

function createAuthRouter(overrides = {}) {
  const deps = {
    UserModel: User,
    bcryptLib: bcrypt,
    generateResetToken,
    hashResetToken,
    signAuthToken,
    createPasswordResetToken,
    consumePasswordResetToken,
    invalidatePasswordResetTokens,
    sendPasswordResetEmail,
    sendPasswordChangedEmail,
    normalizeEmail,
    forgotPasswordIpLimiter,
    forgotPasswordEmailLimiter,
    resetPasswordIpLimiter,
    verifyTokenMiddleware: verifyToken,
    minimumForgotDurationMs: DEFAULT_FORGOT_MIN_DURATION_MS,
    defer: setImmediate,
    env: process.env,
    logger: console,
    ...overrides,
  };

  const router = express.Router();

  const schedule = (label, operation) => {
    deps.defer(() => {
      Promise.resolve()
        .then(operation)
        .catch((error) => deps.logger.error(`${label}:`, error));
    });
  };

  router.post("/register", validateRegister, async (req, res) => {
    try {
      const { username, email, password } = req.body;

      const existingUsername = await deps.UserModel.findOne({ username });
      if (existingUsername) {
        return res.status(400).json({ message: "Username already in use" });
      }

      const existingEmail = await deps.UserModel.findOne({ email });
      if (existingEmail) {
        return res.status(400).json({ message: "Email already in use" });
      }

      const hash = await deps.bcryptLib.hash(password, 10);
      const newUser = new deps.UserModel({ username, email, password: hash });
      await newUser.save();

      const token = deps.signAuthToken(newUser);

      res.status(201).json({
        token,
        user: {
          _id: newUser._id,
          username: newUser.username,
          email: newUser.email,
        },
      });
    } catch (err) {
      deps.logger.error("Registration error:", err);
      res.status(500).json({ message: "Registration failed" });
    }
  });

  router.post("/login", validateLogin, async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await deps.UserModel.findOne({ email });
      if (!user) return res.status(400).json({ message: "Invalid email" });

      const valid = await deps.bcryptLib.compare(password, user.password);
      if (!valid) return res.status(400).json({ message: "Invalid password" });

      const token = deps.signAuthToken(user);

      res.json({
        token,
        user: {
          _id: user._id,
          username: user.username,
          email: user.email,
        },
      });
    } catch (err) {
      deps.logger.error("Login error:", err);
      res.status(500).json({ message: "Login failed" });
    }
  });

  router.post(
    "/forgot-password",
    deps.forgotPasswordIpLimiter,
    deps.forgotPasswordEmailLimiter,
    validateForgotPassword,
    async (req, res) => {
      const startedAt = Date.now();
      let delivery = null;

      try {
        const email = deps.normalizeEmail(req.body.email);

        // Keep cryptographic work present on both known and unknown account paths.
        const neutralRawToken = deps.generateResetToken();
        deps.hashResetToken(neutralRawToken);

        const user = await deps.UserModel.findOne({ email });
        if (user) {
          const { rawToken } = await deps.createPasswordResetToken(user._id);
          const clientUrl = deps.env.CLIENT_URL;
          if (!clientUrl) throw new Error("CLIENT_URL is required for password recovery");

          const resetUrl = new URL("/reset-password", clientUrl);
          resetUrl.searchParams.set("token", rawToken);
          delivery = {
            to: deps.normalizeEmail(user.email),
            resetUrl: resetUrl.toString(),
          };
        }
      } catch (error) {
        // Public response intentionally remains neutral for account and service failures.
        deps.logger.error("Password recovery request error:", error);
      }

      const remaining = Math.max(
        0,
        Number(deps.minimumForgotDurationMs || 0) - (Date.now() - startedAt)
      );
      if (remaining > 0) {
        await new Promise((resolve) => setTimeout(resolve, remaining));
      }

      res.json({ message: FORGOT_PASSWORD_MESSAGE });

      if (delivery) {
        schedule("Password reset email failed", () =>
          deps.sendPasswordResetEmail(delivery.to, delivery.resetUrl)
        );
      }
    }
  );

  router.post(
    "/reset-password",
    deps.resetPasswordIpLimiter,
    validateResetPassword,
    async (req, res) => {
      try {
        const consumed = await deps.consumePasswordResetToken(req.body.token);
        if (!consumed) {
          return res.status(400).json({ message: INVALID_RESET_MESSAGE });
        }

        const user = await deps.UserModel.findById(consumed.userId);
        if (!user) {
          return res.status(400).json({ message: INVALID_RESET_MESSAGE });
        }

        user.password = await deps.bcryptLib.hash(req.body.newPassword, 10);
        user.authVersion = Number(user.authVersion || 0) + 1;
        await user.save();
        await deps.invalidatePasswordResetTokens(user._id);

        schedule("Password changed email failed", () =>
          deps.sendPasswordChangedEmail(deps.normalizeEmail(user.email))
        );

        return res.json({ message: RESET_SUCCESS_MESSAGE });
      } catch (err) {
        deps.logger.error("Password reset error:", err);
        return res.status(500).json({ message: "Password reset failed" });
      }
    }
  );

  router.patch(
    "/change-password",
    deps.verifyTokenMiddleware,
    validateChangePassword,
    async (req, res) => {
      try {
        const { currentPassword, newPassword } = req.body;
        const user = await deps.UserModel.findById(req.user._id);

        if (!user) return res.status(404).json({ message: "User not found" });

        const valid = await deps.bcryptLib.compare(currentPassword, user.password);
        if (!valid) {
          return res.status(400).json({ message: "Current password is incorrect" });
        }

        user.password = await deps.bcryptLib.hash(newPassword, 10);
        user.authVersion = Number(user.authVersion || 0) + 1;
        await user.save();
        await deps.invalidatePasswordResetTokens(user._id);

        const token = deps.signAuthToken(user);

        schedule("Password changed email failed", () =>
          deps.sendPasswordChangedEmail(deps.normalizeEmail(user.email))
        );

        return res.json({ message: "Password changed.", token });
      } catch (err) {
        deps.logger.error("Change password error:", err);
        return res.status(500).json({ message: "Password change failed" });
      }
    }
  );

  return router;
}

const router = createAuthRouter();

module.exports = router;
module.exports.createAuthRouter = createAuthRouter;
module.exports.FORGOT_PASSWORD_MESSAGE = FORGOT_PASSWORD_MESSAGE;
module.exports.INVALID_RESET_MESSAGE = INVALID_RESET_MESSAGE;
module.exports.RESET_SUCCESS_MESSAGE = RESET_SUCCESS_MESSAGE;
