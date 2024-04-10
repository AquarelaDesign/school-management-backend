import mongoose from "mongoose";

const blogCustomFieldsSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    value: {
      type: String,
      lowercase: true,
      trim: true,
      required: true,
    },

    blog: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const blogCustomFields = mongoose.model(
  "blogCustomFields",
  blogCustomFieldsSchema
);
export default blogCustomFields;
