const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

function generateResetToken() {
  return crypto.randomBytes(32).toString("hex");
}

function hashResetToken(rawToken) {
  return crypto.createHash("sha256").update(String(rawToken)).digest("hex");
}

function tokenAuthVersion(payload) {
  return Number.isInteger(payload?.authVersion) ? payload.authVersion : 0;
}

function signAuthToken(user) {
  return jwt.sign(
    {
      _id: user._id,
      authVersion: Number(user.authVersion || 0),
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
}

async function verifyAuthTokenAgainstUser(token, UserModel = User) {
  const payload = jwt.verify(token, process.env.JWT_SECRET);
  const user = await UserModel.findById(payload._id).select("_id authVersion");

  if (!user) {
    throw new Error("Authentication user not found");
  }

  const currentAuthVersion = Number(user.authVersion || 0);
  if (tokenAuthVersion(payload) !== currentAuthVersion) {
    throw new Error("Authentication token has been revoked");
  }

  return {
    _id: user._id,
    authVersion: currentAuthVersion,
  };
}

module.exports = {
  generateResetToken,
  hashResetToken,
  tokenAuthVersion,
  signAuthToken,
  verifyAuthTokenAgainstUser,
};
