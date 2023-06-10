"use strict";

const usersDAO = require("../dao/users.dao");

exports.register = async (req, res) => {
  try {
    const result = await usersDAO.createUser(
      req.body.username,
      req.body.email,
      req.body.password
    );
    if (result.error) return res.status(400).json({ error: result.error });
    else return res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.login = (req, res) => {
  res.json({ message: "Authenticated", user: req.user });
};

exports.logout = (req, res) => {
  req.logout((err) => {
    if (err) res.status(400).json({ error: err.message });
    else res.json({ message: "Logged out" });
  });
};
