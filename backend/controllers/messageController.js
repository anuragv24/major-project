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

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: selectedUserId },
        { senderId: selectedUserId, receiverId: myId },
      ],
    });

    await Message.updateMany(
      { senderId: selectedUserId, receiverId: myId },
      { seen: true },
    );

    const myLang = req.user.preferredLanguage || "en";
    const formattedMessages = messages.map((msg) => {
      return {
        ...msg._doc,
        text: msg.originalLanguage === myLang
          ? msg.originalText
          : msg.translations?.get(myLang) || msg.originalText,
      }
    })

    res.json({ success: true, messages: formattedMessages });
  } catch (error) {
    console.log(error.message);
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

    const sender = await User.findById(senderId);
    const receiver = await User.findById(receiverId);

    const senderLang = sender.preferredLanguage || "en";
    const receiverLang = receiver.preferredLanguage || "en";

    let translatedText = null;

    if(text && senderLang !== receiverLang){
      translatedText = await safeTranslate(text, senderLang, receiverLang);
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
        ? new ( [[receiverLang, translatedText]]) 
        : new Map(),
      image: imageUrl,
    });

    //emit the new message to the receiver socket
    const receiverSocketId = userSocketMap[receiverId]
    if(receiverSocketId){
        io.to(receiverSocketId).emit("newMessage", {
          ...newMessage._doc,
          text:
            newMessage.translations?.get(receiverLang) || newMessage.originalText,
        })
    }

    // emit the new Message to the sender socket
    const senderSocketId = userSocketMap[senderId];
    if (senderSocketId) {
      io.to(senderSocketId).emit("newMessage", {
        ...newMessage._doc,
        text: newMessage.originalText,
      });
    }

    res.json({ 
      success: true, 
      newMessage: {
        ...newMessage._doc,
        text: newMessage.originalText,
      } 
    });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};
