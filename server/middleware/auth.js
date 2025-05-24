/**
 * Middleware to verify JWT tokens in incoming requests.
 *
 * Extracts the token from the "Authorization" header, verifies it using the secret key,
 * and attaches the decoded user information to the request object.
 * If the token is missing or invalid, responds with an appropriate error message.
 *
 * @function
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @param {import('express').NextFunction} next - Express next middleware function.
 * @returns {void}
 */
const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Access denied" });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ message: "Invalid token" });
  }
};

module.exports = verifyToken;
// This code defines a middleware function for verifying JWT tokens in an Express.js application.
// It checks for the presence of a token in the Authorization header, verifies it using a secret key,