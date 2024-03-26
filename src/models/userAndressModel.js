import mongoose from "mongoose";

const userAndressSchema = mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
    },
    zipCode: {
      type: Number,
      required: true,
    },
    andress: {
      type: String,
      required: true,
    },
    number: {
      type: String,
      required: true,
    },
    complement: {
      type: String,
      required: false,
    },
    neighborhood: {
      type: String,
      required: false,
    },
    province: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    country: {
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

const UserAndress = mongoose.model("UserAndress", userAndressSchema);
export default UserAndress;
