/**
 * @module routes/auth
 * @description Express router for user authentication (registration and login).
 */

 /**
    * Registers a new user.
    *
    * @route POST /register
    * @group Auth - User authentication
    * @param {string} username.body.required - Username of the new user
    * @param {string} email.body.required - Email of the new user
    * @param {string} password.body.required - Password of the new user
    * @returns {object} 201 - User registered message
    * @returns {object} 500 - Registration failed message and error
    */

 /**
    * Logs in a user.
    *
    * @route POST /login
    * @group Auth - User authentication
    * @param {string} email.body.required - Email of the user
    * @param {string} password.body.required - Password of the user
    * @returns {object} 200 - JWT token and user info
    * @returns {object} 400 - Invalid email or password message
    * @returns {object} 500 - Login failed message and error
    */
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

router.post("/register", async (req, res) => {
  try {
    console.log("REGISTER BODY:", req.body);
    const { username, email, password } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const newUser = new User({ username, email, password: hash });
    await newUser.save();

    res.status(201).json({ message: "User registered!" });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ message: "Registration failed", error: err });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid email" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ message: "Invalid password" });

    /**
     * Generates a JSON Web Token (JWT) for the authenticated user.
     *
     * @constant
     * @type {string}
     * @param {Object} user - The authenticated user object.
     * @param {string|number} user._id - The unique identifier of the user.
     * @returns {string} JWT token signed with the user's ID as payload, using the secret from environment variables.
     * The token expires in 1 day.
     */
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.json({ token, user: { id: user._id, username: user.username, email: user.email } });
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err });
  }
});

module.exports = router;
