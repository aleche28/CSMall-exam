"use strict";

const dayjs = require("dayjs");
const db = require("../db/db");
const blocksDAO = require("../dao/blocks.dao");

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
      page.blocks = [];
    }
    if (row.blockId) {
      block = toBlockObject(row);
      page.blocks.push(block);
    }
  }
  pages.push(page);
  return pages;
};

exports.getAllPages = () => {
  return new Promise((resolve, reject) => {
    const sql =
      "SELECT * FROM pages";
    db.all(sql, (err, rows) => {
      if (err) reject(err);

      const pages = rows.map((r) => toPageObject(r));
      resolve(pages);
    });
  });
};

exports.getAllPublishedPages = () => {
  return new Promise((resolve, reject) => {
    const today = dayjs().format(dateFormat);
    const sql =
      "SELECT * FROM pages WHERE publication_date <= ?";
    db.all(sql, [today], (err, rows) => {
      if (err) reject(err);

      const pages = rows.map((r) => toPageObject(r));
      resolve(pages);
    });
  });
};

// does not check if the author exists because it is called only when the authorId
// corresponds to the authenticated userId, so the author always exists
exports.getAllPagesByAuthor = (authorId) => {
  return new Promise((resolve, reject) => {
    const sql =
      "SELECT * FROM pages WHERE author = ?";
    db.all(sql, [authorId], (err, rows) => {
      if (err) reject(err);

      const pages = rows.map((r) => toPageObject(r));
      resolve(pages);
    });
  });
};

exports.getPageById = (pageId) => {
  return new Promise((resolve, reject) => {
    const sql =
      "SELECT p.id, title, author, creation_date, publication_date,\
      b.id as blockId, type, position, content\
      FROM pages p LEFT JOIN blocks b\
      ON b.page = p.id\
      WHERE p.id = ?\
      ORDER BY p.id";
    db.all(sql, [pageId], (err, rows) => {
      if (err) reject(err);

      if (!rows.length) {
        resolve({ error: "Page not found" });
      } else {
        const page = aggregateRows(rows)[0];
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

exports.updatePage = (pageId, page) => {
  // This function assumes dates are already in the correct format "YYYY-MM-DD".
  return new Promise((resolve, reject) => {
    const sql =
      "UPDATE pages SET title=?, author=?, publication_date=? WHERE id=?";
    db.run(
      sql,
      [page.title, page.author, page.publicationDate, pageId],
      function (err) {
        if (err) {
          if (err.code === "SQLITE_CONSTRAINT")
            resolve({ error: "Author (user) not found" });
          else reject(err);
        }

        resolve(exports.getPageById(pageId));
      }
    );
  });
};

exports.deletePageById = (pageId) => {
  return new Promise(async (resolve, reject) => {
    // delete all blocks in the page before deleting the page
    const { countDeleted } = await blocksDAO.deleteAllPageBlocks(pageId);

    const sql = "DELETE FROM pages WHERE id = ?";
    db.run(sql, [pageId], function (err) {
      if (err) {
        reject(err);
      }
      if (this.changes !== 1) resolve({ error: "Page not found" });
      else resolve({ message: "Page deleted", blocksDeleted: countDeleted });
    });
  });
};
