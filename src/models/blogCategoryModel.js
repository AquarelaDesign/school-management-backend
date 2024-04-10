import mongoose from "mongoose";

const blogCategorySchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      lowercase: true,
      trim: true,
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

const blogCategory = mongoose.model("blogCategory", blogCategorySchema);
export default blogCategory;
