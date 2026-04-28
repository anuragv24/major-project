import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs"

export const signup = async(req, res) => {
    try {
        const {fullName, email, password, bio} = req.body;

        if(!fullName || !email || !password || !bio){
            return res.json({success: false, message: "Missing Details"})
        }
        const user = await User.findOne({email})

        if(user){
            return res.json({success: false, message: "Account already exists"})
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            fullName, email, password: hashedPassword, bio
        })

        const token = generateToken(newUser?._id)

        res.json({success: true, userData: newUser, token, message: "Account created successfully"})


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
        const {email, password} = req.body;

        if(!email || !password){
            return res.json({success: false, message: "Missing Details"})
        }

        const userData = await User.findOne({email})

        if(!userData){
            return res.json({success: false, message: "Invalid credentials"})
        }

        const isPasswordCorrect = await bcrypt.compare(password, userData.password)

        if(!isPasswordCorrect){
            return res.json({success: false, message: "Invalid credentials"})
        }

        const token = generateToken(userData._id)

        res.json({success: true, userData, token, message: "Login successful"})

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