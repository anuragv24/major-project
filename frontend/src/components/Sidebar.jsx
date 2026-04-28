import { useNavigate } from "react-router-dom";
import assets from "../assets/assets";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/chatContext";
import { Globe, X } from "lucide-react";
import { SARVAM_LANGUAGES } from "../constants";

const Sidebar = () => {
  const { logout, onlineUser, updateLanguage, authUser } =
    useContext(AuthContext);
  const {
    selectedUser,
    setSelectedUser,
    users,
    getUsers,
    unseenMessages,
    setUnseenMessages,
  } = useContext(ChatContext);
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [isLangModalOpen, setIsLangModalOpen] = useState(false);

  // Sarvam AI supported languages
  const currentLangName =
    SARVAM_LANGUAGES.find((l) => l.code === authUser?.preferredLanguage)
      ?.name || "English";

  const filterUsers = users.filter((user) => {
    if (user.blockedUsers?.includes(authUser._id)) return false;
    if (
      searchTerm &&
      !user.fullName.toLowerCase().includes(searchTerm.toLowerCase())
    )
      return false;
    return true;
  });

  const sortedUsers = [...filterUsers].sort((a, b) => {
    const aIsBlockedByMe = authUser.blockedUsers?.includes(a._id);
    const bIsBlockedByMe = authUser.blockedUsers?.includes(b._id);
    return aIsBlockedByMe - bIsBlockedByMe;
  });

  useEffect(() => {
    getUsers();
  }, [onlineUser]);

  return (
    <div
      className={`bg-[#8185B2]/10 h-full p-5 rounded-r-xl overflow-y-scroll text-white custom-scrollbar ${selectedUser ? "max-md:hidden" : ""}`}
    >
      <div className="pb-5">
        <div className="flex justify-between items-center">
          <img
            src={assets.logo || null}
            alt="logo"
            className="max-w-[120px] md:max-w-40"
          />

          <div className="flex items-center gap-3 md:gap-4">
            {/* Language Selector Trigger */}
            <div
              onClick={() => setIsLangModalOpen(true)}
              className="p-2 hover:bg-white/10 rounded-full cursor-pointer transition-all"
              title="Change Language"
            >
              <Globe className="w-5 h-5 text-gray-300" />
            </div>

            {/* Kebab Menu */}
            <div className="relative py-2 group">
              <img
                src={assets.menu_icon}
                alt="menu"
                className="max-h-5 cursor-pointer"
              />
              <div className="absolute top-full right-0 z-20 w-32 p-3 rounded-md bg-[#282142] border border-gray-600 text-gray-100 hidden group-hover:block shadow-xl">
                <p
                  onClick={() => navigate("/profile")}
                  className="cursor-pointer text-sm p-2 hover:bg-white/5 rounded"
                >
                  Edit Profile
                </p>
                <hr className="my-1 border-t border-gray-500 " />
                <p
                  onClick={() => logout()}
                  className="cursor-pointer text-sm p-2 hover:bg-white/5 rounded text-red-400"
                >
                  Logout
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-[#282142] rounded-full flex items-center gap-2 mt-5 px-4 py-3 border border-transparent focus-within:border-violet-500/50 transition-all">
          <img src={assets.search_icon} alt="Search" className="w-3" />
          <input
            type="text"
            placeholder="Search..."
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent border-none outline-none text-white text-xs placeholder-[#c8c8c8] flex-1"
          />
        </div>
      </div>

      {/* User List */}
      <div className="flex flex-col gap-3">
        {sortedUsers.map((user) => (
          <div
            onClick={() => {
              setSelectedUser(user);
              setUnseenMessages((prev) => ({ ...prev, [user._id]: 0 }));
            }}
            key={user._id}
            className={`relative flex items-center gap-3 p-3 rounded-lg transition-all ${selectedUser?._id === user._id ? "bg-[#282142]" : "hover:bg-[#282142]/40"}`}
          >
            <div className="relative">
              <img
                src={user?.profilePic || assets.avatar_icon}
                alt="UserPic"
                className="w-10 h-10 rounded-full object-cover border border-white/10"
              />
              {onlineUser.includes(user._id) && (
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#1e1b2e] rounded-full"></div>
              )}
            </div>
            <div className="flex flex-col flex-1 overflow-hidden">
              <p className="font-medium truncate">{user.fullName}</p>
              <span
                className={`text-[10px] ${user.isBlocked ? "text-red-400" : onlineUser.includes(user._id) ? "text-green-400" : "text-neutral-400"}`}
              >
                {user.isBlocked
                  ? "Blocked"
                  : onlineUser.includes(user._id)
                    ? "Online"
                    : "Offline"}
              </span>
            </div>
            {unseenMessages[user._id] > 0 && (
              <p className="text-[10px] h-5 min-w-[20px] px-1 flex justify-center items-center rounded-full bg-violet-600 font-bold">
                {unseenMessages[user._id]}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Language Modal */}
      {isLangModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#282142] w-full max-w-sm overflow-hidden rounded-2xl border border-gray-600 shadow-2xl flex flex-col max-h-[85vh]">
            {/* Modal Header */}
            <div className="p-4 border-b border-gray-700 flex justify-between items-center bg-[#1e1b2e]">
              <h2 className="text-lg font-semibold text-violet-400 flex items-center gap-2">
                <Globe className="w-4 h-4" /> Language
              </h2>
              <button
                onClick={() => setIsLangModalOpen(false)}
                className="p-1 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 overflow-y-auto custom-scrollbar">
              {/* Current Preference Section */}
              <div className="mb-6">
                <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mb-2 px-1">
                  Selected
                </p>
                <div className="bg-violet-600/20 p-3 rounded-xl border border-violet-500/40 flex justify-between items-center">
                  <span className="font-medium">{currentLangName}</span>
                  <div className="w-2 h-2 bg-violet-400 rounded-full animate-pulse"></div>
                </div>
              </div>

              {/* List Section */}
              <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mb-2 px-1">
                Choose Language
              </p>
              <div className="grid grid-cols-1 gap-1">
                {SARVAM_LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      updateLanguage(lang.code);
                      setIsLangModalOpen(false);
                    }}
                    className={`w-full text-left p-3 rounded-lg text-sm transition-all flex justify-between items-center ${
                      authUser?.preferredLanguage === lang.code
                        ? "bg-violet-600 text-white"
                        : "hover:bg-white/5 text-gray-300"
                    }`}
                  >
                    {lang.name}
                    {authUser?.preferredLanguage === lang.code && (
                      <span className="text-[10px] font-bold">CURRENT</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
