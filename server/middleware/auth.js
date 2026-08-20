/**
 * @fileoverview
 * Middleware to verify JWT token and its current authentication version.
 */

const { verifyAuthTokenAgainstUser } = require("../lib/authTokens");

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) return res.status(401).json({ msg: "No token, authorization denied" });

  try {
    req.user = await verifyAuthTokenAgainstUser(token);
    next();
  } catch (_err) {
    return res.status(401).json({ msg: "Token is not valid" });
  }
};

module.exports = verifyToken;
