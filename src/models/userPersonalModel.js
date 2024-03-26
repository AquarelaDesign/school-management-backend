import mongoose from "mongoose";

const userPersonalSchema = mongoose.Schema(
  {
    fullName: {
      type: String,
      required: false,
    },
    gender: {
      type: String,
      required: false,
    },
    dob: {
      type: Date,
      required: false,
    },
    religion: {
      type: String,
      required: false,
    },
    photo: {
      type: String,
      default:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSj7nmvPuHivliG0y_2glZDqMW3aZ4pbd8pzw&usqp=CAU",
    },
    yearOfStudy: {
      type: Number,
      default: 1,
      required: false,
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

const UserPersonal = mongoose.model("UserPersonal", userPersonalSchema);
export default UserPersonal;
