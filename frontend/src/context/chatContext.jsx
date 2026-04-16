import { createContext, useContext, useEffect, useState } from "react";
import {AuthContext} from "./AuthContext"


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
            const {data} = await axios.get(`/api/messages/${userId}`);
            if(data.success){
                setMessages(data.messages)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    // function to send message to selected user
    const sendMessage = async (messageData) => {
        try {
            const {data} = await axios.post(`api/message/send/${selectedUser._id}`, messageData)
            if(data.success){
                setMessages((prev) => [...prev, data.newMessage])
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(data.message)
        }
    }

    // function to subscribe to message ffor selected user

    const subscribeToMessage = async () => {
        if(!socket) return;

        socket.on("newMessage", (newMessage) => {
            if(selectedUser && newMessage.senderId === selectedUser._id){
                newMessage.seen = true;
                setMessages((prev) => [...prev, newMessage])
                axios.put(`/api/messages/mark/${newMessage._id}`);
            } else {
                setUnseenMessages((prev) => ({
                    ...prev, 
                    [newMessage.senderId] : prev[newMessage.senderId] ? prev[newMessage.senderId] + 1 : 1
                }))
            }
        })
    }

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
    }

    return (
    <ChatContext.Provider value = {value}>
        {children}
    </ChatContext.Provider>
    )
}