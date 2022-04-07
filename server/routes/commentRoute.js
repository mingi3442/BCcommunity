const { Router } = require("express");
const commentRouter = Router({ mergeParams: true });
const mongoose = require("mongoose");
const { isValidObjectId } = require("mongoose");
const { User, Post, Comment } = require("../src/models");

commentRouter.get("/", async (req, res) => {
  const { postId } = req.params;
  try {
    const comments = await Comment.find({ postId: postId }).sort({ createdAt: -1 });
    return res.send({ comments });
  } catch (err) {
    console.log(err);
  }
});

commentRouter.post("/", async (req, res) => {
  const { postId } = req.params;
  const { userId, content } = req.body;
  try {
    const [post, user] = await Promise.all([Post.findById({ _id: postId }), User.findById({ _id: userId })]);
    if (!isValidObjectId(postId)) return res.status(400).send({ err: "postId is invalid" });
    const comment = new Comment({ postId: { ...post }, ownerId: userId, username: user.username, comment: content });
    Post.updateOne({ _id: post._id }, { $inc: { allComment: 1 } });
    await Promise.all([
      comment.save(),
      Post.updateOne(
        { _id: postId },
        {
          $inc: { totalComment: 1 },
          $push: { comments: { $each: [comment], $slice: -3 } },
        }
      ),
    ]);
    return res.status(200).send({ comment });
  } catch (err) {
    console.log(err);
  }
});
commentRouter.put("/:commentId", async (req, res) => {
  const { commentId } = req.params;
  const { content } = req.body;
  try {
    if (!isValidObjectId(commentId)) return res.status(400).send({ err: "commentId is invalid" });
    const comment = await Comment.findOneAndUpdate({ _id: commentId }, { comment: content }, { new: true });
    res.status(200).send({ comment });
  } catch (err) {
    console.log(err);
  }
});

commentRouter.delete("/:commentId", async (req, res) => {
  const { commentId } = req.params;
  try {
    await Comment.findOneAndDelete({ _id: commentId });
    res.status(200).send({ msg: "Delete Success!!" });
  } catch (err) {
    console.log(err);
  }
});

module.exports = {
  commentRouter,
};
