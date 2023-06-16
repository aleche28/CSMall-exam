"use strict";

const pagesDAO = require("../dao/pages.dao");
const blocksDAO = require("../dao/blocks.dao");
const dayjs = require("dayjs");

const dateFormat = "YYYY-MM-DD";

const isPublished = (page) => {
  const today = dayjs().format(dateFormat);

  return (
    !!page.publicationDate &&
    dayjs(page.publicationDate).format(dateFormat) <= today
  );
};

exports.getAllPages = async (req, res) => {
  try {
    const pages = await pagesDAO.getAllPages();
    res.json(pages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getPage = async (req, res) => {
  try {
    const page = await pagesDAO.getPageById(req.params.pageId);
    if (page.error) return res.status(404).json({ error: page.error });
    res.json(page);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllPagesByAuthor = async (req, res) => {
  try {
    const pages = await pagesDAO.getAllPagesByAuthor(req.params.authorId);
    res.json(pages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllPublishedPages = async (req, res) => {
  try {
    const pages = await pagesDAO.getAllPublishedPages();
    res.json(pages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getPublishedPageById = async (req, res) => {
  try {
    const page = await pagesDAO.getPageById(req.params.pageId);

    if (!page) {
      return res.status(404).json({ error: "Page not found" });
    }
    if (!isPublished(page))
      return res.status(400).json({ error: "Page not published yet" });
    res.json(page);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createPage = async (req, res) => {
  try {
    const body = {
      title: req.body.title,
      author: req.user.username,
      creationDate: dayjs().format(dateFormat),
      publicationDate:
        (req.publicationDate && dayjs(req.publicationDate).format(dateFormat)) || null,
    };
    let newPage = await pagesDAO.createPage(body);
    req.body.blocks.forEach(async (b) => await blocksDAO.createBlock({...b, page: newPage.id}));
    
    newPage = await pagesDAO.getPageById(newPage.id);
    res.json(newPage);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updatePage = async (req, res) => {
  try {
    // blocks updated only if an array of new blocks is passed
    if (req.body.blocks) {
      // first delete all old blocks, then add all the new ones
      await blocksDAO.deleteAllPageBlocks(req.params.pageId);
      req.body.blocks.forEach(async (b) => await blocksDAO.createBlock({...b, page: req.params.pageId}));
    }

    const body = {
      title: req.body.title,
      author: req.body.author,
      publicationDate:
        (req.body.publicationDate && dayjs(req.body.publicationDate).format(dateFormat)) || null,
    };

    const page = await pagesDAO.updatePage(req.params.pageId, body);
    if (page.error)
      return res.status(400).json({ error: page.error });

    res.json(page);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deletePage = async (req, res) => {
  try {
    const result = await pagesDAO.deletePageById(req.params.pageId);
    
    if (result.error)
      return res.status(404).json({ error: result.error });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};