"use strict";

const blocksDAO = require("../dao/blocks.dao");

exports.getAllPageBlocks = async (req, res) => {
  try {
    const blocks = await blocksDAO.getBlocksByPageId(req.params.pageId);
    res.json(blocks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getBlock = async (req, res) => {
  try {
    const block = await blocksDAO.getBlockById(req.params.blockId);

    if (block.error) return res.status(404).json({ error: block.error });

    if (block.page !== Number(req.params.pageId))
      return res
        .status(400)
        .json({ error: "Block does not belong to the specified page" });

    res.json(block);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createBlock = async (req, res) => {
  try {
    const body = {
      type: req.body.type,
      content: req.body.content,
      position: Number(req.body.position),
      page: req.params.pageId,
    };
    const newBlock = await blocksDAO.createBlock(body);
    res.json(newBlock);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteBlock = async (req, res) => {
  try {
    const result = await blocksDAO.deleteBlockById(req.params.blockId);
    if (result.error) return res.status(404).json({ error: result.error });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateBlock = async (req, res) => {
  try {
    if (req.body.page && req.params.pageId !== req.body.page)
      return res.status(400).json({ error: "Cannot change page of the block" });

    const block = await blocksDAO.updateBlockById(req.params.blockId, req.body);
    if (block.error) return res.status(404).json({ error: block.error });

    res.json(block);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
