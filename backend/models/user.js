import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      //must match frontend :name,email,password
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    otp: {
      type: String,
      default: null
    },
    expireyOtp: {
      type: Number,
    },
    isVerifyedUSer: {
      type: Boolean,
      default: false,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // Mongoose automatically manage createdAt and updatedAt
  },
);

const User = mongoose.model("User", userSchema);

export default User;
