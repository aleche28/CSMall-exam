"use strict";

const express = require("express");
const blocksController = require("../controllers/blocks.controller");
const router = express.Router();

/* check authentication middleware */
const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({ error: "Not authorized" });
};

router.use(isLoggedIn);

/**
 * GET /api/pages/:pageId/blocks/
 *
 * Get all blocks in a page.
 */
router.get("/pages/:pageId/blocks/", blocksController.getAllPageBlocks);

/**
 * GET /api/pages/:pageId/blocks/:blockId
 *
 * Get a specific block in a page.
 */
router.get("/pages/:pageId/blocks/:blockId", blocksController.getBlock);

/**
 * POST /api/pages/:pageId/blocks/
 *
 * Add a new block to a page.
 * Fields of the block are passed inside request body object
 */
router.post("/pages/:pageId/blocks/", blocksController.createBlock);

/**
 * DELETE /api/pages/:pageId/blocks/:blockId
 *
 * Remove a block from a page.
 */
router.delete("/pages/:pageId/blocks/:blockId", blocksController.deleteBlock);

/**
 * PUT /api/pages/:pageId/blocks/:blockId
 *
 * Update a block in a page.
 */
router.put("/pages/:pageId/blocks/:blockId", blocksController.updateBlock);

module.exports = router;
