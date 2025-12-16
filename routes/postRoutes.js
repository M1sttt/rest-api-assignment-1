const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Post = require("../models/post");

router.post("/", async (req, res) => {
  try {
    const { title, content, sender } = req.body;
    if (!title || !content || !sender)
      return res
        .status(400)
        .json({ error: "title, content and sender are required" });
    const post = new Post({ title, content, sender });
    const saved = await post.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const filter = {};
    if (req.query.sender) filter.sender = req.query.sender;
    const posts = await Post.find(filter).sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ error: "Invalid id" });
    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ error: "Post not found" });
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ error: "Invalid id" });
    const { title, content, sender } = req.body;
    if (!title || !content || !sender)
      return res
        .status(400)
        .json({ error: "title, content and sender are required" });
    const updated = await Post.findByIdAndUpdate(
      id,
      { title, content, sender },
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ error: "Post not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
