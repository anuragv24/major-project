import express from "express"
import "dotenv/config"
import cors from "cors"
import http from "http";
import { connectDB } from "./lib/db.js";
import userRouter from "./routes/user.routes.js"
import messageRouter from "./routes/message.routes.js"
import {Server} from "socket.io"

const app = express()
const server = http.createServer(app)

const allowedOrigin = process.env.FRONTEND_URL || "http://localhost:5173"

export const io = new Server(server, {
    cors: {
        origin: allowedOrigin,
        methods: ["GET", "POST", "PUT", "DELETE"],
    }
})

//store online users
export const userSocketMap = {}; //{userId: socketId}

//socket.io connection hanlder
io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId
    console.log("user connected: ", userId)

    if(userId) userSocketMap[userId] = socket.id

    //emit online user to all connected user
    io.emit("getOnlineUser", Object.keys(userSocketMap))

    socket.on("disconnect", () => {
        if(!userId) return
        console.log("User disconnected : ", userId)
        delete userSocketMap[userId]
        io.emit("getOnlineUser", Object.keys(userSocketMap))
    })
})

app.use(cors({
    origin: allowedOrigin,
    credentials: true,
}));


app.use(express.json({limit: "4mb"}));



app.use("/api/status", (req, res) => res.send("server is live"))
app.use("/api/auth", userRouter);
app.use("/api/messages", messageRouter)

const PORT = process.env.PORT || 5000;

// connect to mongodb

const startServer = async () => {
    try {
        await connectDB();
        console.log("Connected to MongoDB")

        server.listen(PORT, () => console.log("Server is running at PORT : " + PORT))
        console.log(`CORS allowed for origin: ${allowedOrigin}`)
    } catch (error) {
        console.error("Error connecting to MongoDB:", error.message);
        process.exit(1);
    }
}

startServer();
