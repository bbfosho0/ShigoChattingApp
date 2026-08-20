const test = require("node:test");
const assert = require("node:assert/strict");

const {
  FORGOT_IP_LIMIT,
  FORGOT_EMAIL_LIMIT,
  RESET_IP_LIMIT,
  RATE_LIMIT_WINDOW_MS,
  normalizeEmail,
} = require("../middleware/authRateLimits");

test("recovery rate limits use the approved budgets", () => {
  assert.equal(RATE_LIMIT_WINDOW_MS, 15 * 60 * 1000);
  assert.equal(FORGOT_IP_LIMIT, 10);
  assert.equal(FORGOT_EMAIL_LIMIT, 3);
  assert.equal(RESET_IP_LIMIT, 10);
});

test("email rate-limit keys normalize account identifiers", () => {
  assert.equal(normalizeEmail("  PERSON@Example.COM "), "person@example.com");
  assert.equal(normalizeEmail(undefined), "");
});
