"use strict";

const pagesDAO = require("../dao/pages.dao");
const dayjs = require("dayjs");

const dateFormat = "YYYY-MM-DD";

const isPublished = (page) => {
  const today = dayjs().format(dateFormat);
  return (
    !!page.publicationDate && dayjs(page.publicationDate).format(dateFormat) <= today
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
      publicationDate: (req.publicationDate && dayjs(req.publicationDate)) || null,
    }
    const newPage = await pagesDAO.createPage(body);
    res.json(newPage);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

exports.createBlock = async (req, res) => {
  try {
    const body = {
      type: req.body.type,
      content: req.body.content,
      position: Number(req.body.position),
      page: req.params.pageId
    }
    const newBlock = await pagesDAO.createBlock(body);
    res.json(newBlock);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}


