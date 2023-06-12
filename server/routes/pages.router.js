"use strict";

const express = require("express");
const pagesController = require("../controllers/pages.controller");
const router = express.Router();

/* check authentication middleware */
const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({ error: "Not authorized" });
};

/* middleware to check if the user logged in is the same in req.params */
const isAuthor = (req, res, next) => {
  if (req.params.authorId === req.user.username) {
    return next();
  }
  return res.status(401).json({
    error:
      "Not authorized: user making the request is not the author passed to params",
  });
};

const isAdmin = (req, res, next) => {
  if (req.user.role === "Admin") return next();
  return res.status(401).json({ error: "Not authorized: must be an admin" });
};

/*************************
 *  Front-office routes  *
 *************************/

/**
 * GET /api/pages/published
 *
 * Get all published pages
 */
router.get("/pages/published", pagesController.getAllPublishedPages);

/**
 * GET /api/pages/published/:pageId
 *
 * Get a specific published page
 */
router.get("/pages/published/:pageId", pagesController.getPublishedPageById);

/************************
 *  Back-office routes  *
 ************************/

router.use(isLoggedIn); // check authentication for every route below

/**
 * GET /api/pages
 *
 * Get all created pages.
 * Requires: authentication
 */
router.get("/pages", pagesController.getAllPages);

/**
 * GET /api/pages/:pageId
 *
 * Get a specific page
 * Requires: authentication
 */
router.get("/pages/:pageId", pagesController.getPage);

/**
 * GET /api/authors/:authorId/pages
 *
 * Get all created pages from an author.
 * Requires:
 *  1 - authentication
 *  2 - the user making the request should be the author
 *      represented by the authorId
 */
router.get(
  "/authors/:authorId/pages",
  isAuthor,
  pagesController.getAllPagesByAuthor
);

/**
 * POST /api/pages
 *
 * Create a new page.
 * Fields of the page are passed inside request body object
 */
router.post("/pages", pagesController.createPage);

/**
 * PUT /api/authors/:authorId/pages/:pageId
 *
 * Edit an existing page.
 * Fields of the page are passed inside request body object
 * Requires:
 *  - user making the request must be the author of the page
 */
router.put(
  "/authors/:authorId/pages/:pageId",
  isAuthor,
  pagesController.updatePage
);

/**
 * DELETE /api/authors/:authorId/pages/:pageId
 *
 * Delete a page (and its blocks).
 * Requires:
 *  - user making the request must be the author of the page
 */
router.delete(
  "/authors/:authorId/pages/:pageId",
  isAuthor,
  (req, res, next) => {
    if (req.author !== authorId)
      return res
        .status(401)
        .json({
          error: "Not authorized: only admin can change authorship of the page",
        });
    next();
  },
  pagesController.deletePage
);

/* Admin-only routes */

/**
 * PUT /api/pages/:pageId
 *
 * Edit an existing page.
 * Fields of the page are passed inside request body object
 */
router.put("/pages/:pageId", isAdmin, pagesController.updatePage);

/**
 * DELETE /api/pages/:pageId
 *
 * Delete a page (and its blocks).
 */
router.delete("/pages/:pageId", isAdmin, pagesController.deletePage);

module.exports = router;
