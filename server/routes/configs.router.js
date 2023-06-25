"use strict";

const express = require("express");
const configsDAO = require("../dao/configs.dao");
const router = express.Router();

const isAdmin = (req, res, next) => {
  if (req.isAuthenticated() && req.user.role === "Admin") return next();
  return res.status(401).json({ error: "Not authorized: must be an admin" });
};

router.get("/configs/websitename", async (req, res) => {
  try {
    const prop = await configsDAO.getWebsiteName();

    res.json(prop);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/configs/websitename", isAdmin, async (req, res) => {
  let name = req.body?.websiteName?.trim();
  if (!name)
    return res
      .status(422)
      .json({ error: "Missing or empty 'websiteName' field" });

  try {
    const updatedProp = await configsDAO.updateWebsiteName(req.body.websiteName);

    res.json(updatedProp);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
