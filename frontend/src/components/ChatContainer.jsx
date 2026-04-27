import React, { useContext, useEffect, useRef, useState } from "react";
import assets from "../assets/assets";
import { formatMessageTime } from "../lib/utils";
import { ChatContext } from "../context/chatContext";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";
import { Languages, Globe } from "lucide-react"; // Added Globe
import { getLanguageName } from "../constants";

const ChatContainer = () => {
  const scrollEnd = useRef();
  const { messages, selectedUser, setSelectedUser, sendMessage, getMessages } = useContext(ChatContext);
  const { authUser, onlineUsers } = useContext(AuthContext);

  const [input, setInput] = useState("");
  const [showOriginal, setShowOriginal] = useState({});

  const toggleOriginal = (msgId) => {
    setShowOriginal((prev) => ({
      ...prev,
      [msgId]: !prev[msgId],
    }));
  };

  const hanldeSendMessage = async (e) => {
    e.preventDefault();
    if (input.trim() === "") return null;
    await sendMessage({ text: input.trim() });
    setInput("");
  };

  const handleSendImage = async (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = async () => {
      await sendMessage({ image: reader.result });
      e.target.value = "";
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (selectedUser) {
      getMessages(selectedUser._id);
      setShowOriginal({});
    }
  }, [selectedUser]);

  useEffect(() => {
    if (scrollEnd.current && messages.length > 0) {
      scrollEnd.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return selectedUser ? (
    <div className="h-full overflow-scroll relative backdrop-blur-lg">
      {/* ----header----------- */}
      <div className="flex items-center gap-3 py-3 mx-4 border-b border-stone-500">
        <img
          src={selectedUser.profilePic || assets.avatar_icon}
          alt="Profile-Pic"
          className="w-10 h-10 rounded-full object-cover"
        />
        <div className="flex-1 flex flex-col">
          <div className="flex items-center gap-2 leading-tight">
            <p className="text-lg text-white font-medium">{selectedUser.fullName}</p>
            {onlineUsers?.includes(selectedUser._id) && (
              <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>
            )}
          </div>
          
          {/* Subtle Language Indicator */}
          <div className="flex items-center gap-1 text-[11px] text-violet-300/80">
            <Globe size={11} className="text-violet-400" />
            <span>Receives in {getLanguageName(selectedUser.preferredLanguage)}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
            <img
            onClick={() => setSelectedUser(null)}
            src={assets.arrow_icon}
            alt="Arrow"
            className="md:hidden max-w-7 cursor-pointer"
            />
            <img
            src={assets.help_icon}
            alt="Info"
            className="max-md:hidden max-w-5 cursor-pointer opacity-70 hover:opacity-100 transition-opacity"
            />
        </div>
      </div>

      {/* ----chat-area----------- */}
      <div className="flex flex-col h-[calc(100%-120px)] overflow-y-scroll p-3 pb-6 custom-scrollbar">
        {messages?.map((message, index) => {
          const isMine = message.senderId === authUser._id;
          // Updated isTranslated check for more accuracy
          const isTranslated = !isMine && message.originalLanguage !== authUser.preferredLanguage;
          const displayOriginal = showOriginal[message._id];

          return (
            <div
              key={message._id || index}
              className={`flex items-end gap-2 mb-6 ${isMine ? "justify-end" : "flex-row-reverse justify-end"}`}
            >
              <div className="flex flex-col group max-w-[70%]">
                {message.image ? (
                  <img
                    src={message.image}
                    className="max-w-[230px] border border-gray-700 rounded-lg overflow-hidden"
                    alt="attachment"
                  />
                ) : (
                  <>
                    <p
                      className={`p-3 md:text-sm font-light rounded-2xl break-words text-white ${
                        isMine 
                          ? "bg-violet-600/40 rounded-br-none" 
                          : "bg-white/10 rounded-bl-none"
                      }`}
                    >
                      {displayOriginal ? message.originalText : (message.translatedText || message.text)}
                    </p>
                    
                    {isTranslated && (
                      <button
                        onClick={() => toggleOriginal(message._id)}
                        className={`text-[10px] mt-1 text-violet-300 hover:text-white transition-all opacity-0 group-hover:opacity-100 flex items-center gap-1 cursor-pointer ${
                          isMine ? "self-end" : "self-start"
                        }`}
                      >
                        <Languages size={10} />
                        {displayOriginal ? "Show Translated" : "See Original"}
                      </button>
                    )}
                  </>
                )}
              </div>

              <div className="flex flex-col items-center gap-1 min-w-[40px]">
                <img
                  src={isMine ? authUser?.profilePic || assets.avatar_icon : selectedUser?.profilePic || assets.avatar_icon}
                  alt="avatar"
                  className="w-7 h-7 rounded-full object-cover border border-white/10"
                />
                <p className="text-[10px] text-gray-500 whitespace-nowrap">
                  {formatMessageTime(message.createdAt)}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={scrollEnd}></div>
      </div>

      {/* bottom area */}
      <div className="absolute bottom-0 left-0 right-0 flex items-center gap-3 p-3 bg-transparent">
        <div className="flex-1 flex items-center bg-[#282142]/60 backdrop-blur-md px-3 rounded-full border border-white/5">
          <input
            type="text"
            placeholder="Send a message"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => (e.key === "Enter" ? hanldeSendMessage(e) : null)}
            className="flex-1 text-sm p-3 bg-transparent border-none outline-none text-white placeholder-gray-400"
          />
          <input
            type="file"
            id="image"
            accept="image/png, image/jpeg"
            onChange={handleSendImage}
            hidden
          />
          <label htmlFor="image">
            <img
              src={assets.gallery_icon}
              alt="gallery"
              className="w-5 mr-2 cursor-pointer hover:opacity-70 transition-opacity"
            />
          </label>
        </div>
        <button 
          onClick={hanldeSendMessage}
          className="p-3 bg-violet-600 hover:bg-violet-500 rounded-full transition-colors shadow-lg"
        >
          <img src={assets.send_button} alt="send" className="w-5" />
        </button>
      </div>
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center h-full gap-2 text-gray-500 bg-white/5 max-md:hidden">
      <p className="text-lg font-medium text-white/50">Select a contact to start chatting</p>
    </div>
  );
};

export default ChatContainer;