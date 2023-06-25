"use strict";

const express = require("express");
const { check, validationResult } = require("express-validator");
const pagesController = require("../controllers/pages.controller");
const router = express.Router();

// This function is used to format express-validator errors as strings
const errorFormatter = ({ location, msg, path, value, nestedErrors }) => {
  return `${location}[${path}]: ${msg}`;
};

const validate = (req, res, next) => {
  const errors = validationResult(req).formatWith(errorFormatter);
  if (!errors.isEmpty())
    return res.status(422).json({ error: errors.array().join(", ") });
  next();
};

const customBlocksValidator = (value) => {
  for (const block of value) {
    if (
      !block.hasOwnProperty("type") ||
      !block.hasOwnProperty("content") ||
      !block.hasOwnProperty("position")
    )
      throw new Error("Missing field in one of the blocks");
    if (
      block.type !== "header" &&
      block.type !== "paragraph" &&
      block.type !== "image"
    )
      throw new Error("Block type is not a valid type");
    if (!(typeof block.content === "string") || !block.content.length)
      throw new Error("Invalid block content");
    if (!Number.isInteger(block.position) || block.position < 1)
      throw new Error("Invalid block position");
  }

  const valid =
  value.some((b) => b.type === "header") &&
  value.some((b) => b.type !== "header");

  if (!valid)
    throw new Error("List of page blocks must contain at least one header and one paragraph/image block");

  return true;
};

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
router.get(
  "/pages/published/:pageId",
  check("pageId").isInt({ min: 1 }),
  validate,
  pagesController.getPublishedPageById
);

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
router.get(
  "/pages/:pageId",
  check("pageId").isInt({ min: 1 }),
  validate,
  pagesController.getPage
);

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
router.post(
  "/pages",
  check("title").isLength({ min: 1 }),
  check("publicationDate")
    .optional({ values: "falsy" })
    .isLength({ min: 10, max: 10 })
    .isISO8601({ strict: true }),
  check("blocks").isArray({ min: 2 }).custom(customBlocksValidator),
  validate,
  pagesController.createPage
);

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
  check("pageId").isInt({ min: 1 }),
  check("title").isLength({ min: 1 }),
  check("publicationDate")
    .optional({ values: "falsy" })
    .isLength({ min: 10, max: 10 })
    .isISO8601({ strict: true }),
  check("blocks").optional().isArray({ min: 2 }).custom(customBlocksValidator),
  validate,
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
  check("pageId").isInt({ min: 1 }),
  validate,
  pagesController.deletePage
);

/* Admin-only routes */

/**
 * PUT /api/pages/:pageId
 *
 * Edit an existing page.
 * Fields of the page are passed inside request body object
 */
router.put(
  "/pages/:pageId",
  isAdmin,
  check("pageId").isInt({ min: 1 }),
  check("title").isLength({ min: 1 }),
  check("author").isLength({ min: 1 }),
  check("publicationDate")
    .isLength({ min: 10, max: 10 })
    .isISO8601({ strict: true })
    .optional({ values: "falsy" }),
  check("blocks").optional().isArray({ min: 2 }).custom(customBlocksValidator),
  validate,
  pagesController.updatePageAdmin
);

/**
 * DELETE /api/pages/:pageId
 *
 * Delete a page (and its blocks).
 */
router.delete(
  "/pages/:pageId",
  isAdmin,
  check("pageId").isInt({ min: 1 }),
  validate,
  pagesController.deletePageAdmin
);

module.exports = router;
