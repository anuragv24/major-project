import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs"
import crypto from 'crypto';
import {sendVerificationEmail} from "../lib/sendVerificationEmail.js"


export const signup = async(req, res) => {
    try {
        const {fullName, username, email, password, bio} = req.body;

        if(!fullName || !email || !password || !bio || !username){
            return res.json({success: false, message: "Missing Details"})
        }

        const user = await User.findOne({email})

        if(!user){
            return res.json({success: false, message: "Registration session not found. Please request OTP again."})
        }

        const usernameExists = await User.findOne({username});
        if(usernameExists && usernameExists.email !== email){
            return res.json({
                success: false,
                message: "username already taken"
            })
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user.fullName = fullName;
        user.username = username;
        user.password = hashedPassword;
        user.bio = bio;
        user.otp = undefined;
        user.otpExpires = undefined;
        user.isVerified = true;
        await user.save();
    
        const token = generateToken(user?._id)

        const userData = user.toObject();
        delete userData.password;

        res.json({success: true, userData: userData, token, message: "Account verified and created successfully"})

    } catch (error) {
        console.log(error.message)
        res.json({
            success: false, 
            message: error.message,
        })
    }
}

export const login = async(req, res) => {
    try {
        const {email, password, username} = req.body;

        if(!(email || username) || !password){
            return res.json({success: false, message: "Missing Details"})
        }

        const userData = await User.findOne({
            $or: [{ email: email.toLowerCase() }, { username: username.trim() }],
        })

        if(!userData){
            return res.json({success: false, message: "Invalid credentials"})
        }

        if(!userData.isVerified){
            return res.json({success: false, message: "Email not verified. Please verify your email first."})
        }

        const isPasswordCorrect = await bcrypt.compare(password, userData.password)

        if(!isPasswordCorrect){
            return res.json({success: false, message: "Invalid credentials"})
        }

        const token = generateToken(userData._id)

        const user = userData.toObject();
        delete user.password;

        res.json({success: true, userData: user, token, message: "Login successful"})

    } catch (error) {
        console.log(error.message)
        res.json({success: false, message: error.message})
    }
}

export const checkAuth = (req, res) => {
    res.json({success: true, user: req.user});
}

export const updateProfile = async(req, res) => {
    try {
        const {profilePic, bio, fullName} = req.body

        const userId = req.user._id;
        
        let updatedUser;

        if(!profilePic){
            updatedUser = await User.findByIdAndUpdate(userId, {bio, fullName}, {new: true})
        } else {
            const upload = await cloudinary.uploader.upload(profilePic);

            updatedUser = await User.findByIdAndUpdate(userId, {profilePic: upload.secure_url, bio, fullName}, {new: true});
        }

        res.json({
            success: true,
            user: updatedUser,
            message: "User details updated"
        })
    } catch (error) {
        console.log("error : " + error.message)
        res.json({success: false, message: error.message})
    }
}

export const updateLangage = async(req, res) => {
    try {
        const userId = req.user._id;
        const {preferredLanguage} = req.body;

        // validation
    // const allowedLangs = ["en", "hi", "bn"];

    // if (!allowedLangs.includes(preferredLanguage)) {
    //   return res.json({
    //     success: false,
    //     message: "Invalid language",
    //   });
    // }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { preferredLanguage },
      { new: true }
    ).select("-password");

    res.json({
      success: true,
      user: updatedUser,
    });


    } catch (error) {
        res.json({
            success: false,
            message: error.message,
        });
    }
}

export const toggleBlock = async (req, res) => {
  try {
    const { targetUserId } = req.body;
    const myId = req.user._id;

    const user = await User.findById(myId);
    const isBlocked = user.blockedUsers.includes(targetUserId);

    if (isBlocked) {
      // Unblock: Remove the ID from the array
      await User.findByIdAndUpdate(myId, { $pull: { blockedUsers: targetUserId } });
    } else {
      // Block: Add the ID to the array
      await User.findByIdAndUpdate(myId, { $addToSet: { blockedUsers: targetUserId } });
    }

    res.json({ success: true, isBlocked: !isBlocked });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const sendOtp = async (req, res) => {
  const { email, type } = req.body; // type: 'registration' or 'reset'

  try {
    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 min expiry

    let user = await User.findOne({ email });

    // Check logic based on type
    if (type === "registration" && user?.isVerified) {
      return res.json({ success: false, message: "Email already registered and verified." });
    }
    
    if (type === "reset" && !user) {
      return res.json({ success: false, message: "No account found with this email." });
    }

    // Upsert logic: if user doesn't exist (registration), create a temporary record
    if (!user) {
      user = new User({ 
        email, 
        otp, 
        otpExpires, 
        fullName: "Temporary User", // Placeholder until bio step
        password: "temp-password-123" // Placeholder until signup completion
      });
    } else {
      user.otp = otp;
      user.otpExpires = otpExpires;
    }

    await user.save();
    console.log("otp :: ", otp)

    await  sendVerificationEmail(email, otp, type);


    res.json({ success: true, message: "OTP sent to your email!" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user || user.otp !== otp || user.otpExpires < Date.now()) {
      return res.json({ success: false, message: "Invalid or expired OTP." });
    }

    res.json({ success: true, message: "OTP verified successfully." });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user || user.otp !== otp || user.otpExpires < Date.now()) {
      return res.json({ success: false, message: "Session expired. Please request a new OTP." });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    
    // Clear OTP fields after successful reset
    user.otp = undefined;
    user.otpExpires = undefined;
    
    await user.save();

    res.json({ success: true, message: "Password reset successful!" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};