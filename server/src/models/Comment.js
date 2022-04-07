const {
  Schema,
  model,
  Types: { ObjectId },
} = require("mongoose");

const CommentSchema = new Schema(
  {
    postId: { type: ObjectId, required: true, ref: "post" },
    ownerId: { type: ObjectId, required: true, ref: "user" },
    username: { type: String, required: true },
    comment: { type: String, required: true },
  },
  { timestamps: true }
);

const Comment = model("commnet", CommentSchema);

module.exports = { Comment, CommentSchema };
