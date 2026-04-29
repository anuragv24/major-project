import express from "express"
import { checkAuth, login, resetPassword, sendOtp, signup, toggleBlock, updateLangage, updateProfile, verifyOtp } from "../controllers/userController.js";
import {protectRoute} from "../middleware/auth.middleware.js"

const userRouter = express.Router();

userRouter.post("/signup", signup);
userRouter.post("/login", login)
userRouter.put("/update-profile", protectRoute, updateProfile)
userRouter.get("/check", protectRoute, checkAuth);
userRouter.put("/update-language", protectRoute, updateLangage)
userRouter.post("/toggle-block", protectRoute, toggleBlock)
userRouter.post("/send-otp",  sendOtp)
userRouter.post("/verify-otp", verifyOtp)
userRouter.post("/reset-password", resetPassword)

export default userRouter