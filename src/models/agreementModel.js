import mongoose from "mongoose";

const AgreementSchema = mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
    },
    initialDate: {
      type: Date,
      required: true,
    },
    finalDate: {
      type: Date,
      required: false,
    },
    agreementDuration: {
      type: String,
      required: false,
    },

    user: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Agreement = mongoose.model("Agreement", AgreementSchema);
export default Agreement;
