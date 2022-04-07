const { Router } = require("express");
const userRouter = Router();
const mongoose = require("mongoose");
const { isValidObjectId } = require("mongoose");
const Caver = require("caver-js");
const caver = new Caver("https://api.baobab.klaytn.net:8651/");
require("dotenv").config();
const lightwallet = require("eth-lightwallet");
const { User, Post } = require("../src/models");
const { ObjectId } = require("mongodb");

userRouter.get("/", (req, res) => {
  return res.send("HI");
});

userRouter.post("/signup", async (req, res) => {
  let { username, password, userId } = req.body;
  if (!userId) return res.status(400).send({ err: "userID is required!" });
  if (!username) return res.status(400).send({ err: "username is required!" });
  if (!password) return res.status(400).send({ err: "password is required!" });

  try {
    const userIdCheck = await User.exists({ userId: userId });
    const usernameCheck = await User.exists({ username: username });
    if (userIdCheck || usernameCheck) return res.status(400).send({ err: "이미 존재하는 아이디 혹은 username 입니다." });
    const account = caver.wallet.keyring.generate();
    console.log(account.key.privateKey, account.address);

    const user = new User({ userId, username, password, address: account.address, privateKey: account.key.privateKey, mnemonic, erc20: 0 });
    user.save();
    return res.send({ user });
  } catch (err) {
    console.log({ err });
  }
});

userRouter.post("/login", async (req, res) => {
  try {
    const { userId, password } = req.body;
    const userIdCheck = await User.exists({ userId: userId });
    if (!userIdCheck) return res.status(400).send({ err: "userId is not exists." });
    const user = await User.findOne({ userId: userId, password: password });
    if (!user) return res.status(400).send({ err: " Password is wrong." });
    if (user) return res.status(200).send({ msg: "Sucess Login" });
  } catch (err) {
    console.log(err);
  }
});

userRouter.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    if (!mongoose.isValidObjectId(userId)) return res.status(400).send({ err: "invalid userId" });
    const user = await User.findById({ _id: userId });
    res.send({ user });
  } catch (err) {
    console.log(err);
  }
});

userRouter.get("/:userId/post", async (req, res) => {
  const { userId } = req.params;
  try {
    if (!isValidObjectId(userId)) return res.status(400).send({ err: "invalid userId" });
    const posts = await Post.find({ userId: userId });
    console.log(posts);
    return res.status(200).send({ posts });
  } catch (err) {
    console.log(err);
  }
});

module.exports = {
  userRouter,
};
