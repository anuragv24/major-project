import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    username: {
      type: String,
      // required: true,
      unique: true,
      trim: true,
    },

    fullName: {
      type: String,
      required: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    profilePic: {
      type: String,
      default: "",
    },

    bio: {
      type: String,
    },

    isOnline: {
      type: Boolean,
      default: false,
    },

    lastSeen: {
      type: Date,
    },

    preferredLanguage: {
      type: String,
      default: "en",
    },
    
    blockedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

    otp: {
      type: String,
    },

    otpExpires: {
      type: Date,
    },

    isVerified: {
      type: Boolean,
      default: false
    },
    
  },
  { timestamps: true },
);

userSchema.index(
  { createdAt: 1 }, 
  { 
    expireAfterSeconds: 86400, 
    partialFilterExpression: { isVerified: false } 
  }
);

const User = mongoose.model("User", userSchema);

export default User;
