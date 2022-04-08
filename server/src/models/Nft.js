const { ObjectId } = require("mongodb");
const { Schema, model } = require("mongoose");

const NftSchema = new Schema(
  {
    ownerId: { type: ObjectId, required: true, ref: "user" },
    nftTokenId: { type: Number, required: true },
    ownerName: String,
    title: String,
    desc: String,
    img: { type: String, required: true },
    buyable: { type: Boolean, default: false },
    price: { type: Number, default: 0 },
    prevOwner: { type: ObjectId, ref: "user" },
  },
  { timestamps: true }
);

const Nft = model("nft", NftSchema);
module.exports = { Nft };
