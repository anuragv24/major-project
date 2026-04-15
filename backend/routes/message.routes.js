
import express from "express"
import { protectRoute } from "../middleware/auth.middleware.js";
import { getMessage, getUserForSideBar, markMessageAsSeen, sendMessage } from "../controllers/messageController.js";

const messageRouter = express.Router();

messageRouter.get("/users", protectRoute, getUserForSideBar);
messageRouter.get("/:id", protectRoute, getMessage);
messageRouter.put("mark/:id", protectRoute, markMessageAsSeen);
messageRouter.post("/send/:id", protectRoute, sendMessage);


export default messageRouter