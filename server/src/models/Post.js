const {
  Schema,
  model,
  Types: { ObjectId },
} = require("mongoose");
const { CommentSchema } = require("./Comment");

const PostSchema = new Schema(
  {
    userId: { type: ObjectId, required: true, ref: "user" },
    username: { type: String, required: true },
    title: { type: String, required: true },
    desc: String,
    img: String,
    comments: [CommentSchema],
    totalComment: Number,
  },

  { timestamps: true }
);

const Post = model("post", PostSchema);

module.exports = { Post };
