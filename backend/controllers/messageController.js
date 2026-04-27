import cloudinary from "../lib/cloudinary.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";
import { io, userSocketMap} from "../server.js";
import { safeTranslate } from "../services/safeTranslate.service.js";

export const getUserForSideBar = async (req, res) => {
  try {
    const userId = req.user._id; // myId

    const filteredUsers = await User.find({ _id: { $ne: userId } }).select(
      "-password",
    );

    const unseenMessages = {};

    const promises = filteredUsers.map(async (user) => {
      const count = await Message.countDocuments({
        senderId: user._id,
        receiverId: userId,
        seen: false,
      });

      if (count > 0) {
        unseenMessages[user._id] = count; // key is the other user's id
      }
    });

    await Promise.all(promises);
    res.json({
      success: true,
      users: filteredUsers,
      unseenMessages,
    });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

export const getMessage = async (req, res) => {
  try {
    const { id: selectedUserId } = req.params;
    const myId = req.user._id;

    // 1. Move this outside the loop for efficiency
    const myLang = req.user.preferredLanguage || "en";

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: selectedUserId },
        { senderId: selectedUserId, receiverId: myId },
      ],
    }).lean(); // Optimization: use .lean() for faster, plain JS objects

    // Mark messages as seen
    await Message.updateMany(
      { senderId: selectedUserId, receiverId: myId },
      { seen: true },
    );

    const formattedMessages = messages.map((msg) => {
      // Use msg.text as a ultimate fallback if originalText is missing in DB
      const original = msg.originalText || msg.text || "";
      
      return {
        ...msg,
        translatedText: msg.originalLanguage === myLang
          ? original
          : msg.translations?.[myLang] || original,
        originalText: original,
        // Optional: Keep 'text' field for any legacy UI components
        text: msg.originalLanguage === myLang 
          ? original 
          : msg.translations?.[myLang] || original
      };
    });

    res.json({ success: true, messages: formattedMessages });
  } catch (error) {
    console.error("Error in getMessage:", error.message);
    res.json({ success: false, messages: [], message: error.message });
  }
};

export const markMessageAsSeen = async (req, res) => {
  try {
    const { id } = req.params;
    await Message.findByIdAndUpdate(id, { seen: true });
    res.json({ success: true });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

//send message to selected user
export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const receiverId = req.params.id;
    const senderId = req.user._id;

    const [sender, receiver] = await Promise.all([
      User.findById(senderId),
      User.findById(receiverId)
    ])

    const senderLang = sender.preferredLanguage || "en-IN";
    const receiverLang = receiver.preferredLanguage || "en-IN";

    let translatedText = null;

    if(text && senderLang !== receiverLang){
      translatedText = await safeTranslate(text, senderLang, receiverLang);
      console.log("Translated Text :: ", translatedText)
    }

    let imageUrl;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = await Message.create({
      senderId,
      receiverId,
      originalText: text || "",
      originalLanguage: senderLang,
      translations: translatedText 
        ? new Map( [[receiverLang, translatedText]]) 
        : new Map(),
      image: imageUrl,
    });

    //emit the new message to the receiver socket
    const receiverSocketId = userSocketMap[receiverId];
if (receiverSocketId) {
    io.to(receiverSocketId).emit("newMessage", {
        ...newMessage._doc,
        // The receiver sees the translated version as the primary text
        translatedText: newMessage.translations?.get(receiverLang) || newMessage.originalText,
        originalText: newMessage.originalText,
        // We keep 'text' for backward compatibility or if other parts of your app still use it
        text: newMessage.translations?.get(receiverLang) || newMessage.originalText,
    });
}

// emit the new Message to the sender socket
const senderSocketId = userSocketMap[senderId];
if (senderSocketId) {
    io.to(senderSocketId).emit("newMessage", {
        ...newMessage._doc,
        // The sender sees their own original text as both
        translatedText: newMessage.originalText,
        originalText: newMessage.originalText,
        text: newMessage.originalText,
    });
}

    res.json({ 
      success: true, 
      newMessage: {
        ...newMessage._doc,
        // For the sender, original and translated are the same
        translatedText: newMessage.originalText,
        originalText: newMessage.originalText,
        text: newMessage.originalText, 
      } 
    });
  } catch (error) {
    console.log("Error :: send message :: ", error.message);
    res.json({ success: false, message: error.message });
  }
};
