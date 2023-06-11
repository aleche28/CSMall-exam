"use strict";

const db = require("../db/db");
const dayjs = require("dayjs");

const dateFormat = "YYYY-MM-DD";

const toPageObject = (row) => {
  return {
    id: row.id,
    title: row.title,
    author: row.author,
    // dates should already be stored as strings in the correct format "YYYY-MM-DD" in the DB,
    // so dayjs(...).format(...) could be probably be removed
    creationDate: dayjs(row.creation_date).format(dateFormat),
    publicationDate:
      row.publication_date && dayjs(row.publication_date).format(dateFormat),
    blocks: [],
  };
};

const toBlockObject = (row) => {
  return {
    id: row.blockId,
    type: row.type,
    content: row.content,
    position: row.position,
  };
};

const aggregateRows = (rows) => {
  let currPageId;
  let page;
  let block;
  let pages = [];

  for (let row of rows) {
    if (currPageId != row.id) {
      currPageId = row.id;
      if (page) pages.push(page);
      page = toPageObject(row);
    }
    block = toBlockObject(row);
    page.blocks.push(block);
  }
  pages.push(page);
  return pages;
};

exports.getAllPages = () => {
  return new Promise((resolve, reject) => {
    const sql =
      "SELECT p.id, title, author, creation_date, publication_date,\
      b.id as blockId, type, position, content\
      FROM pages p, blocks b\
      WHERE b.page = p.id\
      ORDER BY p.id, position";
    db.all(sql, (err, rows) => {
      if (err) reject(err);

      const pages = aggregateRows(rows);
      resolve(pages);
    });
  });
};

exports.getAllPublishedPages = () => {
  return new Promise((resolve, reject) => {
    const today = dayjs().format(dateFormat);
    const sql =
      "SELECT p.id, title, author, creation_date, publication_date,\
      b.id as blockId, type, position, content\
      FROM pages p, blocks b\
      WHERE b.page = p.id AND publication_date <= ?\
      ORDER BY p.id, position";
    db.all(sql, [today], (err, rows) => {
      if (err) reject(err);

      const pages = aggregateRows(rows);
      resolve(pages);
    });
  });
};

// does not check if the author exists because it is called only when the authorId
// corresponds to the authenticated userId, so the author always exists
exports.getAllPagesByAuthor = (authorId) => {
  return new Promise((resolve, reject) => {
    const sql =
      "SELECT p.id, title, author, creation_date, publication_date,\
      b.id as blockId, type, position, content\
      FROM pages p, blocks b\
      WHERE b.page = p.id AND author = ?\
      ORDER BY p.id, position";
    db.all(sql, [authorId], (err, rows) => {
      if (err) reject(err);

      const pages = aggregateRows(rows);
      resolve(pages);
    });
  });
};

exports.getPageById = (pageId) => {
  return new Promise((resolve, reject) => {
    const sql =
      "SELECT p.id, title, author, creation_date, publication_date,\
      b.id as blockId, type, position, content\
      FROM pages p, blocks b\
      WHERE b.page = p.id AND p.id = ?\
      ORDER BY p.id, position";
    db.all(sql, [pageId], (err, rows) => {
      if (err) reject(err);

      if (!rows.length) {
        resolve({ error: "Page not found" });
      } else {
        console.log(rows);
        const page = aggregateRows(rows);
        resolve(page);
      }
    });
  });
};

exports.createPage = (newPage) => {
  // This function assumes dates are already in the correct format "YYYY-MM-DD".
  // The controller at the upper layer should apply business rules,
  // such as setting creationDate to today's date.
  return new Promise((resolve, reject) => {
    const sql =
      "INSERT INTO pages (title, author, creation_date, publication_date) VALUES(?, ?, ?, ?)";
    db.run(
      sql,
      [
        newPage.title,
        newPage.author,
        newPage.creationDate,
        newPage.publicationDate,
      ],
      function (err) {
        if (err) reject(err);

        resolve(exports.getPageById(this.lastID));
      }
    );
  });
};
