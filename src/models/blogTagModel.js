import mongoose from "mongoose";

const blogTagSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const blogTag = mongoose.model("blogTag", blogTagSchema);
export default blogTag;
