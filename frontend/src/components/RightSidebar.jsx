import React, { useEffect, useState, useContext } from "react";
import assets from "../assets/assets";
import { ChatContext } from "../context/chatContext";
import { AuthContext } from "../context/AuthContext";
import {
  ChevronRight,
  Image as ImageIcon,
  Mail,
  Calendar,
  LogOut,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";
import { getLanguageName } from "../constants";

const RightSidebar = () => {
  const { selectedUser, messages, setIsRightSidebarOpen } =
    useContext(ChatContext);
  const { logout, onlineUser, authUser, toggleBlock } = useContext(AuthContext);
  const [msgImage, setMsgImage] = useState([]);
  const [showAllMedia, setShowAllMedia] = useState(false);

  const isBlocked = authUser.blockedUsers?.includes(selectedUser?._id);

  useEffect(() => {
    setMsgImage(messages.filter((msg) => msg.image).map((msg) => msg.image));
  }, [messages]);

  if (!selectedUser) return null;

  return (
    <div className="bg-[#8185B2]/10 text-white w-full h-full relative flex flex-col border-l border-gray-600/50 max-md:hidden">
      {/* Collapse Button */}
      <button
        onClick={() => setIsRightSidebarOpen(false)}
        className="absolute top-4 left-4 p-1 hover:bg-white/10 rounded-full transition-colors z-10"
        title="Collapse Sidebar"
      >
        <ChevronRight size={20} />
      </button>

      <div className="pt-12 px-6 flex flex-col items-center gap-4 overflow-y-auto custom-scrollbar pb-24">
        {/* Profile Section */}
        <div className="relative">
          <img
            src={selectedUser?.profilePic || assets.avatar_icon}
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover border-2 border-violet-500/50 p-1"
          />
          {onlineUser.includes(selectedUser._id) && (
            <span className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 border-2 border-[#1e1b2e] rounded-full"></span>
          )}
        </div>

        <div className="text-center">
          <h1 className="text-xl font-semibold">{selectedUser.fullName}</h1>
          <p className="text-xs text-gray-400 mt-1 italic">
            "{selectedUser.bio || "No bio available"}"
          </p>
        </div>

        <hr className="w-full border-gray-600/50" />

        {/* User Details Section */}
        <div className="w-full space-y-4">
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
            Information
          </p>

          <div className="flex items-center gap-3 text-sm text-gray-300">
            <Mail size={16} className="text-violet-400" />
            <span className="truncate">
              {selectedUser.email || "Email hidden"}
            </span>
          </div>

          <div className="flex items-center gap-3 text-sm text-gray-300">
            <Calendar size={16} className="text-violet-400" />
            <span>
              Joined{" "}
              {new Date(selectedUser.createdAt).toLocaleDateString("en-US", {
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>

          <div className="flex items-center gap-3 text-sm text-gray-300">
            <ImageIcon size={16} className="text-violet-400" />
            <span>{msgImage.length} Shared Media</span>
          </div>
        </div>

        <hr className="w-full border-gray-600/50" />

        {/* Media Gallery */}
        <div className="w-full">
          <div className="flex justify-between items-center mb-3">
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
              Shared Media
            </p>
            {msgImage.length > 0 && (
              <span
                onClick={() => setShowAllMedia(true)}
                className="text-[10px] text-violet-400 cursor-pointer hover:underline"
              >
                View All
              </span>
            )}
          </div>

          {msgImage.length > 0 ? (
            <div className="grid grid-cols-3 gap-2">
              {msgImage.slice(0, 6).map((url, index) => (
                <div
                  key={index}
                  onClick={() => window.open(url)}
                  className="aspect-square cursor-pointer rounded-lg overflow-hidden border border-white/5 hover:border-violet-500/50 transition-all"
                >
                  <img
                    src={url}
                    alt="Shared"
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 bg-white/5 rounded-lg border border-dashed border-gray-600">
              <p className="text-[10px] text-gray-500">No media shared yet</p>
            </div>
          )}
        </div>
      </div>

      <hr className="w-full border-gray-600/50" />

      <button
        onClick={() => toggleBlock(selectedUser._id)} 
        className={`w-full py-2.5 rounded-xl text-xs font-medium transition-all flex items-center justify-center gap-2 ${
          isBlocked
            ? "bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20"
            : "bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20"
        }`}
      >
        {isBlocked ? (
          <>
            <ShieldCheck size={14} /> Unblock{" "}
            {selectedUser.fullName.split(" ")[0]}
          </>
        ) : (
          <>
            <ShieldAlert size={14} /> Block{" "}
            {selectedUser.fullName.split(" ")[0]}
          </>
        )}
      </button>

      {/* Logout Footer */}
      <div className="absolute bottom-0 w-full p-6 bg-gradient-to-t from-[#1e1b2e] to-transparent">
        <button
          onClick={() => logout()}
          className="w-full flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 py-2.5 rounded-xl transition-all text-sm font-medium"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>

      {showAllMedia && (
        <div className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-md p-10 flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">
              Shared Media ({msgImage.length})
            </h2>
            <button
              onClick={() => setShowAllMedia(false)}
              className="text-white hover:text-red-400 text-xl"
            >
              Close ✕
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 overflow-y-auto custom-scrollbar">
            {msgImage.map((url, index) => (
              <img
                key={index}
                src={url}
                onClick={() => window.open(url)}
                className="w-full aspect-square object-cover rounded-xl border border-white/10 hover:border-violet-500 cursor-pointer transition-all"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RightSidebar;
