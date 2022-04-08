const { Router } = require("express");
const userRouter = Router();
const mongoose = require("mongoose");
const { isValidObjectId } = require("mongoose");
const lightwallet = require("eth-lightwallet");
const { User, Post, Nft } = require("../src/models");
const { getEth } = require("../libs/eth");

require("dotenv").config();

userRouter.get("/eth", async (req, res) => {
  const { userId } = req.body;
  try {
    if (!isValidObjectId(userId)) return res.status(400).send({ err: "userId is invalid" });
    const { address } = await User.findById(userId);
    getEth(address, userId);
  } catch (err) {
    console.log(err);
  }
});

userRouter.post("/signup", async (req, res) => {
  let { username, password, userId } = req.body;
  if (!userId) return res.status(400).send({ err: "userID is required!" });
  if (!username) return res.status(400).send({ err: "username is required!" });
  if (!password) return res.status(400).send({ err: "password is required!" });
  let mnemonic, address, pk;

  try {
    const userIdCheck = await User.exists({ userId: userId });
    const usernameCheck = await User.exists({ username: username });
    if (userIdCheck || usernameCheck) return res.status(400).send({ err: "이미 존재하는 아이디 혹은 username 입니다." });
    mnemonic = lightwallet.keystore.generateRandomSeed();
    lightwallet.keystore.createVault(
      {
        password: password,
        seedPhrase: mnemonic,
        hdPathString: "m/0'/0'/0'",
      },
      function (err, ks) {
        ks.keyFromPassword(password, function (err, pwDerivedKey) {
          ks.generateNewAddress(pwDerivedKey);
          address = ks.getAddresses().toString();
          pk = ks.exportPrivateKey(address, pwDerivedKey);
          const user = new User({ userId, username, password, address: address.toString(), privateKey: pk, mnemonic, erc20: 0, eth: 0 });
          user.save();
          return res.send({ user });
        });
      }
    );
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
    console.log(userId);
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
    return res.status(200).send({ posts });
  } catch (err) {
    console.log(err);
  }
});

userRouter.get("/:userId/nft", async (req, res) => {
  const { userId } = req.params;
  try {
    if (!isValidObjectId(userId)) return res.status(400).send({ err: "invalid userId" });
    const nfts = await Nft.find({ ownerId: userId });
    return res.status(200).send({ nfts });
  } catch (err) {
    console.log(err);
  }
});

module.exports = {
  userRouter,
};
