const { Router } = require("express");
const nftRouter = Router();
const mongoose = require("mongoose");
const { isValidObjectId } = require("mongoose");
const Caver = require("caver-js");
const lightwallet = require("eth-lightwallet");
const { User, Post, Nft } = require("../src/models");
const { ObjectId } = require("mongodb");
const { mintNFT, sendNFT } = require("../libs/erc721");
const { sendToken } = require("../libs/erc20");

nftRouter.get("/explore", async (req, res) => {
  const nft = await Nft.find({ buyable: true }).exec();
  console.log(nft);
  return res.status(200).send({ nft });
});

nftRouter.post("/", async (req, res) => {
  try {
    const { userId, img, title, desc } = req.body;
    if (!isValidObjectId(userId)) return res.status(400).send({ err: "userId is invalid." });
    const { username, address, privateKey, erc20 } = await User.findById(userId);
    const user = await User.findById(userId);

    if (erc20 < 10) return res.status(400).send({ err: "You don't have enough ERC20 Token" });
    mintNFT(img, address, privateKey, user.userID, username, title, desc, userId);
    return res.status(200).send("Create NFT Success!!!");
  } catch (err) {
    console.log(err);
  }
});

nftRouter.get("/:nftId", async (req, res) => {
  const { nftId } = req.params;
  if (!isValidObjectId(nftId)) return res.status(400).send({ err: "nftId is invalid" });
  const nft = await Nft.findById(nftId);
  return res.status(200).send({ nft });
});

nftRouter.post("/:nftId/register", async (req, res) => {
  const { nftId } = req.params;
  const { price } = req.body;
  if (!isValidObjectId(nftId)) return res.status(400).send({ err: "nftId is invalid" });
  const nft = await Nft.updateOne({ _id: nftId }, { buyable: true, $set: { price: price } }, { new: true });
  return res.status(200).send({ nft });
});
nftRouter.post("/:nftId/cancel", async (req, res) => {
  const { nftId } = req.params;
  if (!isValidObjectId(nftId)) return res.status(400).send({ err: "nftId is invalid" });
  const nft = await Nft.updateOne({ _id: nftId }, { buyable: false, $set: { price: 0 } }, { new: true });
  return res.status(200).send({ nft });
});
nftRouter.post("/:nftId/send", async (req, res) => {
  const { nftId } = req.params;
  const { userId, otherUserId } = req.body;
  if (!isValidObjectId(nftId)) return res.status(400).send({ err: "nftId is invalid" });
  if (!isValidObjectId(userId)) return res.status(400).send({ err: "userId is invalid" });
  if (!isValidObjectId(otherUserId)) return res.status(400).send({ err: "otherUserId is invalid" });
  const { privateKey, address } = await User.findById(userId);
  const otherUser = await User.findById(otherUserId);
  const { nftTokenId } = await Nft.findById(nftId);

  const nft = await sendNFT(privateKey, address, nftTokenId, nftId, otherUser.address, otherUserId, userId);

  return res.status(200).send({ nft });
});
nftRouter.post("/:nftId/buy", async (req, res) => {
  const { nftId } = req.params;
  const { userId } = req.body;
  if (!isValidObjectId(nftId)) return res.status(400).send({ err: "nftId is invalid" });
  if (!isValidObjectId(userId)) return res.status(400).send({ err: "userId is invalid" });
  const { ownerId, nftTokenId, buyable, price } = await Nft.findById(nftId);

  if (!buyable) return res.status(400).send({ msg: "This NFT is not for sale" });
  const { privateKey, address } = await User.findById(userId);
  const ownerUser = await User.findById(ownerId);
  console.log({ ownerUser });

  const [result, nft] = await Promise.all([sendToken(userId, ownerId, price), sendNFT(ownerUser.privateKey, ownerUser.address, nftTokenId, nftId, address, userId, ownerId)]);
  console.log({ result });
  console.log({ nft });
  return res.status(200).send({ msg: "Buy NFT Success!!!" });
});

module.exports = {
  nftRouter,
};
