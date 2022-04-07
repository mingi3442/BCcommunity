const { Router } = require("express");
const postRouter = Router();
const mongoose = require("mongoose");
const Caver = require("caver-js");
const caver = new Caver("https://api.baobab.klaytn.net:8651/");
require("dotenv").config();
const lightwallet = require("eth-lightwallet");
const { User, Post } = require("../src/models");
const { ObjectId } = require("mongodb");
const { commentRouter } = require("./commentRoute");
const { serveToken } = require("../libs/erc20");

postRouter.use("/:postId/comment/", commentRouter);

postRouter.get("/", async (req, res) => {
  try {
    const posts = await Post.find({}).sort({ seq: -1 });
    res.status(200).send({ posts });
  } catch (err) {
    console.log(err);
  }
});
postRouter.post("/", async (req, res) => {
  const { userId, title, desc, img } = req.body;
  try {
    const userIdCheck = await User.exists({ _id: userId });
    if (userIdCheck) {
      const user = await User.findById({ _id: userId });
      const post = new Post({ userId: user._id, username: user.username, title, desc, img, allComment: 0 });
      post.save();
      serveToken(userId, 50);
      return res.status(200).send({ post });
    } else {
      return res.status(404).send({ err: "User is not exist." });
    }
  } catch (err) {
    console.log(err);
  }
});
postRouter.get("/:postId", async (req, res) => {
  const { postId } = req.params;
  if (!mongoose.isValidObjectId(postId)) return res.status(400).send({ err: "invalid postId" });
  const postData = await Post.findOne({ _id: postId });
  console.log(postData);
  return res.send({ postData });
});
postRouter.put("/:postId", async (req, res) => {
  const { postId } = req.params;
  if (!mongoose.isValidObjectId(postId)) return res.status(400).send({ err: "invalid postId" });
  const { title, desc, img } = req.body;
  const postData = await Post.findOneAndUpdate({ _id: postId }, { title, desc, img }, { new: true });
  console.log(postData);
  return res.send({ postData });
});
postRouter.delete("/:postId", async (req, res) => {
  const { postId } = req.params;
  if (!mongoose.isValidObjectId(postId)) return res.status(400).send({ err: "invalid postId" });
  await Post.findOneAndDelete({ _id: postId });
  res.status(200).send("delete success!");
});

module.exports = {
  postRouter,
};
