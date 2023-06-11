"use strict";

const db = require("../db/db");

exports.createBlock = (newBlock) => {
  // This function assumes dates are already in the correct format "YYYY-MM-DD".
  // The controller at the upper layer should apply business rules,
  // such as setting creationDate to today's date.
  return new Promise((resolve, reject) => {
    const sql =
      "INSERT INTO blocks (type, content, position, page) VALUES(?, ?, ?, ?)";
    db.run(
      sql,
      [newBlock.type, newBlock.content, newBlock.position, newBlock.page],
      function (err) {
        if (err) reject(err);

        resolve("Added block to page " + newBlock.page);
      }
    );
  });
};
