"use strict";

const sqlite = require("sqlite3");

const db = new sqlite.Database("./db/database.db", (err) => {
  if (err)
    throw err;
    console.log("Connected to database");
});

/* Turn on foreign keys check on the DB
 * source: https://stackoverflow.com/questions/16375542/in-sqlite3-is-there-a-foreignkey-integrity-check
 */
db.run('PRAGMA foreign_keys = ON;');

module.exports = db;