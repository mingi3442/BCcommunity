const { Schema, model } = require("mongoose");

const UserSchema = new Schema(
  {
    userID: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    address: String,
    privateKey: String,
    mnemonic: String,
    erc20: Number,
    eth: Number,
  },
  { timestamps: true }
);

const User = model("user", UserSchema);
module.exports = { User };
