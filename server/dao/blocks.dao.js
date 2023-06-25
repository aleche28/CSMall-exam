"use strict";

const db = require("../db/db");

const toBlockObject = (row) => {
  return {
    id: row.id,
    type: row.type,
    content: row.content,
    position: row.position,
    page: row.page,
  };
};

exports.createBlock = (newBlock) => {
  return new Promise((resolve, reject) => {
    const sql =
      "INSERT INTO blocks (type, content, position, page) VALUES(?, ?, ?, ?)";
    db.run(
      sql,
      [newBlock.type, newBlock.content, newBlock.position, newBlock.page],
      function (err) {
        if (err) reject(err);

        resolve(exports.getBlockById(this.lastID));
      }
    );
  });
};

exports.getBlockById = (blockId) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM blocks WHERE id = ?";
    db.get(sql, [blockId], (err, row) => {
      if (err) reject(err);

      if (!row) {
        resolve({ error: "Block not found" });
      }

      resolve(toBlockObject(row));
    });
  });
};

exports.getBlocksByPageId = (pageId) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM blocks WHERE id = ?";
    db.get(sql, [pageId], (err, rows) => {
      if (err) reject(err);

      const blocks = rows.map((r) => toBlockObject(r));
      resolve(blocks);
    });
  });
};

exports.deleteAllPageBlocks = (pageId) => {
  return new Promise((resolve, reject) => {
    const sql = "DELETE FROM blocks WHERE page = ?";
    db.run(sql, [pageId], function (err) {
      if (err) {
        reject(err);
      }
      resolve({ countDeleted: this.changes });
    });
  });
};
