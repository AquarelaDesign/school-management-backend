import mongoose from "mongoose";

const userContactSchema = mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
    },
    contact: {
      type: String,
      required: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const UserContact = mongoose.model("UserContact", userContactSchema);
export default UserContact;
