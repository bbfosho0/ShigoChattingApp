const test = require("node:test");
const assert = require("node:assert/strict");

const {
  RESET_TOKEN_TTL_MS,
  createPasswordResetToken,
  consumePasswordResetToken,
  invalidatePasswordResetTokens,
} = require("../lib/passwordRecovery");
const { hashResetToken } = require("../lib/authTokens");

test("reset tokens expire after 30 minutes and persist only the hash", async () => {
  const calls = [];
  const Model = {
    deleteMany: async (query) => calls.push(["deleteMany", query]),
    create: async (doc) => {
      calls.push(["create", doc]);
      return doc;
    },
  };

  const before = Date.now();
  const result = await createPasswordResetToken("user-1", Model);
  const created = calls.find(([name]) => name === "create")[1];

  assert.equal(RESET_TOKEN_TTL_MS, 30 * 60 * 1000);
  assert.equal(created.userId, "user-1");
  assert.equal(created.tokenHash, hashResetToken(result.rawToken));
  assert.notEqual(created.tokenHash, result.rawToken);
  assert.ok(created.expiresAt.getTime() >= before + RESET_TOKEN_TTL_MS);
  assert.ok(created.expiresAt.getTime() <= Date.now() + RESET_TOKEN_TTL_MS);
});

test("reset token consumption is atomic and requires an unexpired unused hash", async () => {
  const rawToken = "a".repeat(64);
  let query;
  let update;
  const consumed = { userId: "user-1", consumedAt: new Date() };
  const Model = {
    findOneAndUpdate: async (nextQuery, nextUpdate, options) => {
      query = nextQuery;
      update = nextUpdate;
      assert.deepEqual(options, { new: true });
      return consumed;
    },
  };

  const result = await consumePasswordResetToken(rawToken, Model);

  assert.equal(query.tokenHash, hashResetToken(rawToken));
  assert.equal(query.consumedAt, null);
  assert.ok(query.expiresAt.$gt instanceof Date);
  assert.ok(update.$set.consumedAt instanceof Date);
  assert.equal(result, consumed);
});

test("invalidating reset tokens deletes every outstanding token for the user", async () => {
  let query;
  const Model = { deleteMany: async (nextQuery) => { query = nextQuery; } };

  await invalidatePasswordResetTokens("user-7", Model);

  assert.deepEqual(query, { userId: "user-7", consumedAt: null });
});
