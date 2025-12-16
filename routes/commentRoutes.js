const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Comment = require("../models/comment");
const Post = require("../models/post");

// Create comment
router.post("/", async (req, res) => {
  try {
    const { postId, sender, content } = req.body;
    if (!postId || !sender || !content)
      return res
        .status(400)
        .json({ error: "postId, sender and content are required" });
    if (!mongoose.Types.ObjectId.isValid(postId))
      return res.status(400).json({ error: "Invalid postId" });

    const postExists = await Post.exists({ _id: postId });
    if (!postExists)
      return res.status(400).json({ error: "Referenced post not found" });

    const comment = new Comment({ postId, sender, content });
    const saved = await comment.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all comments or by post: /comment?postId=<postId>
router.get("/", async (req, res) => {
  try {
    const filter = {};
    if (req.query.postId) {
      if (!mongoose.Types.ObjectId.isValid(req.query.postId))
        return res.status(400).json({ error: "Invalid postId" });
      filter.postId = req.query.postId;
    }
    const comments = await Comment.find(filter).sort({ createdAt: -1 });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get comment by id
router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ error: "Invalid id" });
    const comment = await Comment.findById(id);
    if (!comment) return res.status(404).json({ error: "Comment not found" });
    res.json(comment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update comment (PUT)
router.put("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ error: "Invalid id" });
    const { postId, sender, content } = req.body;
    if (!postId || !sender || !content)
      return res
        .status(400)
        .json({ error: "postId, sender and content are required" });
    if (!mongoose.Types.ObjectId.isValid(postId))
      return res.status(400).json({ error: "Invalid postId" });

    const postExists = await Post.exists({ _id: postId });
    if (!postExists)
      return res.status(400).json({ error: "Referenced post not found" });

    const updated = await Comment.findByIdAndUpdate(
      id,
      { postId, sender, content },
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ error: "Comment not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete comment
router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ error: "Invalid id" });
    const deleted = await Comment.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: "Comment not found" });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
