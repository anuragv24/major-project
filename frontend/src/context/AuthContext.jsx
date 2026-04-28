import { createContext, useEffect, useState } from "react";
import axios from 'axios'
import toast from 'react-hot-toast'
import {io} from "socket.io-client"

const backendUrl = import.meta.env.VITE_BACKEND_URL;

axios.defaults.baseURL = backendUrl


export const AuthContext = createContext();

export const AuthProvider = ({children}) => {

    const [token, setToken] = useState(localStorage.getItem("token"))
    const [authUser, setAuthUser] = useState(null) // user data
    const [onlineUser, setOnlineUser] = useState([]) // all online user
    const [socket, setSocket] = useState(null)

    // Check if the user is authenticated and if so, set the user data and connect the socket

    const checkAuth = async() => {
        try {
            const {data} = await axios.get("/api/auth/check")
            if(data.success){
                setAuthUser(data.user)
                connectSocket(data.user)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    // login function to handlle user authentication and socket connection

    const login = async (state, credentials) => { // state -> login / signup
        try {
            const {data} = await axios.post(`/api/auth/${state}`, credentials);

            if(data.success){
                setAuthUser(data.userData);
                connectSocket(data.userData);
                axios.defaults.headers.common["token"] = data.token
                setToken(data.token)
                localStorage.setItem("token", data.token)
                toast.success(data.message)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    // login function to handle user logout and socket disconnection

    const logout = async() => {
        localStorage.removeItem("token")
        if(socket) socket.disconnect()
        setToken(null)
        setAuthUser(null)
        setOnlineUser([])
        setSocket(null)
        axios.defaults.headers.common["token"] = null
        toast.success('Logged Out Successfully')
        
        
    }

    // Update profile function to handle user profile updates

    const updateProfile = async (body) => {
        try {
            const {data} = await axios.put("/api/auth/update-profile", body);
            if(data.success){
                setAuthUser(data.user)
                toast.success("Profile Updated Successfully")
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    //connect socket function to handle socket connection and online user updates 

    const connectSocket = (userData) => {
        if(!userData || socket?.connected) return; // If user isn't authenticated or socket is already connected, no need for newConnection

        const newSocket = io(backendUrl, {
            query: {
                userId: userData._id,
            }
        })

        newSocket.connect()
        setSocket(newSocket)

        newSocket.off("getOnlineUser");

        newSocket.on("getOnlineUser", (userIds) => {
            setOnlineUser(userIds)
        })
    }

    const updateLanguage = async (lang) => {
        try {
            const {data} = await axios.put("/api/auth/update-language", {preferredLanguage: lang});
            if(data.success){
                setAuthUser((prev) => ({
                    ...prev,
                    preferredLanguage: lang,
                }))

                toast.success("Language Updated")
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    // Inside AuthContext.jsx
const toggleBlock = async (targetUserId) => {
  try {
    const res = await axios.post("/api/auth/toggle-block", { targetUserId });
    if (res.data.success) {
      // Update the local authUser state so the UI reflects the change instantly
      setAuthUser(prev => ({
        ...prev,
        blockedUsers: res.data.blockedUsers // The backend returns the new array
      }));
      toast.success(res.data.isBlocked ? "User blocked" : "User unblocked");
    }
  } catch (error) {
    toast.error("Failed to update block status");
  }
};

    useEffect(() => {
        if(token){
            axios.defaults.headers.common["token"] = token
        }
        checkAuth()
    }, [])

    const value = {
        axios,
        authUser,
        onlineUser,
        socket,
        login,
        logout,
        updateProfile,
        updateLanguage,
        toggleBlock
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

// 4:16