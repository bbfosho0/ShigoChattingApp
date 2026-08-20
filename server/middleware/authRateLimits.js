const { rateLimit, ipKeyGenerator } = require("express-rate-limit");

const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const FORGOT_IP_LIMIT = 10;
const FORGOT_EMAIL_LIMIT = 3;
const RESET_IP_LIMIT = 10;

function normalizeEmail(value) {
  return String(value || "").trim().toLowerCase();
}

const sharedOptions = {
  windowMs: RATE_LIMIT_WINDOW_MS,
  standardHeaders: true,
  legacyHeaders: false,
};

const forgotPasswordIpLimiter = rateLimit({
  ...sharedOptions,
  limit: FORGOT_IP_LIMIT,
});

const forgotPasswordEmailLimiter = rateLimit({
  ...sharedOptions,
  limit: FORGOT_EMAIL_LIMIT,
  keyGenerator: (req) => `${ipKeyGenerator(req.ip)}:${normalizeEmail(req.body?.email)}`,
});

const resetPasswordIpLimiter = rateLimit({
  ...sharedOptions,
  limit: RESET_IP_LIMIT,
});

module.exports = {
  RATE_LIMIT_WINDOW_MS,
  FORGOT_IP_LIMIT,
  FORGOT_EMAIL_LIMIT,
  RESET_IP_LIMIT,
  normalizeEmail,
  forgotPasswordIpLimiter,
  forgotPasswordEmailLimiter,
  resetPasswordIpLimiter,
};
