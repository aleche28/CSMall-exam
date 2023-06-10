"use strict";

const passport = require("passport");
const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");

router.post(
  "/login",
  // TO-DO: validate email and password
  passport.authenticate("local"),
  authController.login
);

router.post(
  "/register",
  // TO-DO: validate username, email and password
  authController.register
);

router.post("/logout", authController.logout);

/* Development route, just to check if login and logout are working fine. */
router.post("/checklogin", (req, res) => {
  if (req.isAuthenticated()) res.json({ message: "Authenticated" });
  else res.status(400).json({ message: "Not authenticated" });
});

module.exports = router;
