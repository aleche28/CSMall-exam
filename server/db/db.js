"use strict";

const sqlite = require("sqlite3");

const db = new sqlite.Database("./db/database.db", (err) => {
  if (err)
    throw err;
    console.log("Connected to database");
});

module.exports = db;