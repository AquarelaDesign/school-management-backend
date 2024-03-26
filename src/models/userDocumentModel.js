import mongoose from "mongoose";

const userDocumentSchema = mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
    },
    idNumber: {
      type: String,
      required: true,
    },
    issuingBody: {
      type: String,
      required: true,
    },
    shippingDate: {
      type: Date,
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

const UserDocument = mongoose.model("UserDocument", userDocumentSchema);
export default UserDocument;
