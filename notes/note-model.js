const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const noteSchema = new Schema(
  {
    content: String,

    Category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
    },
    User: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    Tags: [
      {
        type: Schema.Types.ObjectId,
        ref: "Tag",
      },
    ],
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Note", noteSchema);
