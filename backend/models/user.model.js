import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    },

    username: {
    type: String,
    required: true,
    unique: true,
    trim: true
    },

    fullName: {
        type: String,
        required: true,
    },

    password: {
        type: String,
        required: true,
        minlength: 6
    },

    profilePic: {
        type: String,
        default: ""
    },

    bio: {
        type: String,
    },

    isOnline: {
    type: Boolean,
    default: false
    },

    lastSeen: {
    type: Date
    },
    
    preferredLanguage: {
    type: String,
    default: "en"
    },

}, {timestamps: true})

userSchema.index({ email: 1 });
userSchema.index({ username: 1 });

const User = mongoose.model("User", userSchema)

export default User
