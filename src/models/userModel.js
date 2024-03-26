import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: false,
    },
    lastName: {
      type: String,
      required: false,
    },
    userType: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      required: true,
      default: false,
    },

    personal: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserPersonal",
    },
    contact: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserContact",
      },
    ],
    document: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserDocument",
      },
    ],
    andress: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserAndress",
      },
    ],

    agreement: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Agreement",
      required: false,
    },
    school: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "School",
      required: false,
    },
    courses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: false,
      },
    ],
    courseUnit: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CourseUnit",
      required: false,
    },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
      required: false,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: false,
    },
    parents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: false,
      },
    ],

    token: {
      type: String,
      required: false,
    },
    isWelcomed: {
      type: Boolean,
      default: false,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    status: {
      type: Boolean,
      default: false,
    },
    lastLoginDate: {
      type: Date,
    },
    lastLoginIp: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model("user", userSchema);

export default User;
