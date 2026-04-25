import express from "express"
import { checkAuth, login, signup, updateLangage, updateProfile } from "../controllers/userController.js";
import {protectRoute} from "../middleware/auth.middleware.js"

const userRouter = express.Router();

userRouter.post("/signup", signup);
userRouter.post("/login", login)
userRouter.put("/update-profile", protectRoute, updateProfile)
userRouter.get("/check", protectRoute, checkAuth);
userRouter.put("/update-language", protectRoute, updateLangage)

export default userRouter