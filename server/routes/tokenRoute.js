const { Router } = require("express");
const tokenRouter = Router();
const mongoose = require("mongoose");
const { isValidObjectId } = require("mongoose");
const Caver = require("caver-js");
const lightwallet = require("eth-lightwallet");
const { User, Post } = require("../src/models");
const { ObjectId } = require("mongodb");
const { sendToken } = require("../libs/erc20");

tokenRouter.get("/", async (req, res) => {
  const { userId } = req.body;
  try {
    if (!isValidObjectId(userId)) return res.status(400).send({ err: "userId is invalid" });
    const { erc20 } = await User.findById({ _id: userId });
    res.status(200).send({ erc20 });
  } catch (err) {
    console.log(err);
  }
});

tokenRouter.post("/:otherUserId", async (req, res) => {
  const { otherUserId } = req.params;
  const { userId, value } = req.body;
  console.log(value);
  try {
    if (!isValidObjectId(userId)) return res.status(400).send({ err: "userId is invalid" });
    if (!isValidObjectId(otherUserId)) return res.status(400).send({ err: "otherUserId is invalid" });
    if (sendToken(userId, otherUserId, value)) return res.status(200).send({ msg: "sendToken Success!!" });
    res.status(400).send({ msg: "sendToken Fail.." });
  } catch (err) {
    console.log(err);
  }
});

module.exports = {
  tokenRouter,
};
