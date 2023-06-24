"use strict";

const db = require("../db/db");

exports.getWebsiteName = () => {
  return new Promise((resolve, reject) => {
    const sql =
      "SELECT * FROM configs WHERE property=?";
    db.get(sql, ["website_name"], (err, row) => {
      if (err) reject(err);

      if (!row) {
        resolve({ error: "Config website_name not found" });
      } else {
        resolve({ websiteName: row.value });
      }
    });
  });
};

exports.updateWebsiteName = (newWebsiteName) => {
  return new Promise((resolve, reject) => {
    const sql =
      "UPDATE configs SET value=? WHERE property=?";
    db.run(
      sql,
      [newWebsiteName, "website_name"],
      function (err) {
        if (err) reject(err);

        resolve(exports.getWebsiteName());
      }
    );
  });
};