import Sidebar from "../components/Sidebar";
import ChatContainer from "../components/ChatContainer";
import RightSidebar from "../components/RightSidebar";
import { useState } from "react";
import { useContext } from "react";
import { ChatContext } from "../context/chatContext";

const HomePage = () => {
  const { selectedUser, isRightSidebarOpen } = useContext(ChatContext);

  return (
    <div className="border w-full h-screen sm:px-[10%] lg:px-[15%] sm:py-[5%] bg-[#121212]">
      <div className={`backdrop-blur-xl border-2 border-gray-600 rounded-2xl overflow-hidden h-full grid grid-cols-1 relative 
        ${selectedUser 
          ? (isRightSidebarOpen 
              ? 'md:grid-cols-[1fr_1.5fr_1fr] xl:grid-cols-[1fr_2fr_1fr]' 
              : 'md:grid-cols-[1fr_2.5fr] xl:grid-cols-[1fr_3fr]') 
          : 'md:grid-cols-2'
        }`}>
        <Sidebar />
        <ChatContainer />
        {isRightSidebarOpen && <RightSidebar />}
      </div>
    </div>
  );
};

export default HomePage;
