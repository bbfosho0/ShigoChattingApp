const PasswordResetToken = require("../models/PasswordResetToken");
const { generateResetToken, hashResetToken } = require("./authTokens");

const RESET_TOKEN_TTL_MS = 30 * 60 * 1000;

async function invalidatePasswordResetTokens(
  userId,
  PasswordResetTokenModel = PasswordResetToken
) {
  await PasswordResetTokenModel.deleteMany({ userId, consumedAt: null });
}

async function createPasswordResetToken(
  userId,
  PasswordResetTokenModel = PasswordResetToken
) {
  await invalidatePasswordResetTokens(userId, PasswordResetTokenModel);

  const rawToken = generateResetToken();
  const expiresAt = new Date(Date.now() + RESET_TOKEN_TTL_MS);

  await PasswordResetTokenModel.create({
    userId,
    tokenHash: hashResetToken(rawToken),
    expiresAt,
    consumedAt: null,
  });

  return { rawToken, expiresAt };
}

async function consumePasswordResetToken(
  rawToken,
  PasswordResetTokenModel = PasswordResetToken
) {
  const now = new Date();

  return PasswordResetTokenModel.findOneAndUpdate(
    {
      tokenHash: hashResetToken(rawToken),
      expiresAt: { $gt: now },
      consumedAt: null,
    },
    { $set: { consumedAt: now } },
    { new: true }
  );
}

module.exports = {
  RESET_TOKEN_TTL_MS,
  createPasswordResetToken,
  consumePasswordResetToken,
  invalidatePasswordResetTokens,
};
