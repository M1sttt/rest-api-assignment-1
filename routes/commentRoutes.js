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

module.exports = router;
