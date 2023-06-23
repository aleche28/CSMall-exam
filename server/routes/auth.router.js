"use strict";

const passport = require("passport");
const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const authController = require("../controllers/auth.controller");
const usersDAO = require("../dao/users.dao");

// This function is used to format express-validator errors as strings
const errorFormatter = ({ location, msg, param, value, nestedErrors }) => {
  return `${location}[${param}]: ${msg}`;
};

router.post(
  "/login",
  check("username").isLength({ min: 1 }),
  check("password").isLength({ min: 1 }),
  function (req, res, next) {
    const errors = validationResult(req).formatWith(errorFormatter);
    if (!errors.isEmpty())
      return res.status(422).json({ error: errors.array().join(", ") });
      
    passport.authenticate("local", function (err, user, info, status) {
      if (err) {
        return next(err);
      }
      if (!user) {
        // display wrong login messages
        return res.status(401).json({ error: info });
      }
      req.login(user, (err) => {
        if (err) return next(err);
        next();
      });
    })(req, res, next);
  },
  authController.login
);

router.post("/logout", authController.logout);

// GET /api/sessions/current
// This route checks whether the user is logged in or not.
// In case it is logged in, it returns user data
router.get("/sessions/current", (req, res) => {
  if (req.isAuthenticated()) {
    res.status(200).json(req.user);
  } else res.status(401).json({ error: "Not authenticated" });
});

/* Development route, just to check if login and logout are working fine. */
router.post("/checklogin", (req, res) => {
  if (req.isAuthenticated()) res.json({ message: "Authenticated" });
  else res.status(400).json({ message: "Not authenticated" });
});

/* get list of all users (only usernames) from the db */
router.get(
  "/users",
  (req, res, next) => {
    if (req.isAuthenticated() && req.user.role === "Admin") next();
    else res.status(401).json({ message: "Not authorized" });
  },
  async (req, res) => {
    try {
      const users = await usersDAO.getAllUsers();
      res.json(users);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

module.exports = router;
