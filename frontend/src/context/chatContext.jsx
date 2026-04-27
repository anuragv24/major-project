import { createContext, useContext, useEffect, useState } from "react";
import {AuthContext} from "./AuthContext"
import toast from "react-hot-toast";


export const ChatContext = createContext()

export const ChatProvider = ({children}) => {

    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [unseenMessages, setUnseenMessages] = useState({})

    const {axios, socket} = useContext(AuthContext)

    // function to get all the users for sidebar
    const getUsers = async () => {
        try {
           const {data} = await axios.get("/api/messages/users");
           if(data.success){
            setUsers(data.users);
            setUnseenMessages(data.unseenMessages);

           }

        } catch (error) {
            toast.error(error.message)
        }
    }

    // function to get message for selected users
    const getMessages = async (userId) => {
    try {
        const { data } = await axios.get(`/api/messages/${userId}`);
        
        if (data.success) {
            // Format the fetched history to match our new message structure
            const formattedHistory = data.messages.map((msg) => ({
                ...msg,
                // Ensure UI always has these two fields even for old messages
                translatedText: msg.translatedText || msg.text,
                originalText: msg.originalText || msg.text
            }));

            setMessages(formattedHistory);
        }
    } catch (error) {
        toast.error(error.message);
    }
};

    // function to send message to selected user
    const sendMessage = async (messageData) => {
    try {
        const { data } = await axios.post(`api/messages/send/${selectedUser._id}`, messageData);
        if (data.success) {
            const finalMsg = {
                ...data.newMessage,
                translatedText: data.newMessage.translatedText || data.newMessage.text,
                originalText: data.newMessage.originalText || data.newMessage.text
            };
            setMessages((prev) => [...prev, finalMsg]);
        }
    } catch (error) {
        toast.error(error.message);
    }
};

    // function to subscribe to message ffor selected user

    const subscribeToMessage = async () => {
    if (!socket) return;

    // It's good practice to turn off the listener before turning it on 
    // to prevent duplicate listeners if the component re-renders.
    socket.off("newMessage");

    socket.on("newMessage", async (newMessage) => {
        // Ensure the message has the fields ChatContainer needs
        // If translatedText is missing, we fallback to the standard .text field
        const formattedMessage = {
            ...newMessage,
            translatedText: newMessage.translatedText || newMessage.text,
            originalText: newMessage.originalText || newMessage.text,
        };

        if (selectedUser && formattedMessage.senderId === selectedUser._id) {
            formattedMessage.seen = true;
            
            setMessages((prev) => [...prev, formattedMessage]);
            
            // Mark as seen in database
            await axios.put(`/api/messages/mark/${formattedMessage._id}`);
        } else {
            // Update unseen count for background users
            setUnseenMessages((prev) => ({
                ...prev, 
                [formattedMessage.senderId]: (prev[formattedMessage.senderId] || 0) + 1 
            }));
        }
    });
};

    // function to unsubscribe from message

    const unsubscribeFromMessages = () => {
        if(socket) socket.off("newMessage");
    }

    useEffect(() => {
        subscribeToMessage();
        return () => unsubscribeFromMessages();
    }, [selectedUser, socket])



    const value = {
        messages, setMessages,
        users, getUsers,
        unseenMessages, setUnseenMessages,
        selectedUser,
        sendMessage,
        setSelectedUser,  
        getMessages
    }

    return (
    <ChatContext.Provider value = {value}>
        {children}
    </ChatContext.Provider>
    )
}