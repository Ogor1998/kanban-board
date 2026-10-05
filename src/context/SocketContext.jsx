import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { Socket } from "socket.io-client";
import { io } from "socket.io-client";

const SocketContext = createContext();


export function SocketProvider({ children }) {
    const { currentUser, isLoggedIn } = useAuth();
    const [socket, setSocket] = useState(null)
    useEffect(() => {
        if (!isLoggedIn || !currentUser) return
        const newSocket = io('http://localhost:3000', {
            withCredentials: true
        })
        newSocket.on('connect', () => {
            newSocket.emit('register', currentUser._id)
        })
        setSocket(newSocket)

        return () => newSocket.disconnect();
    }, [isLoggedIn, currentUser])

    return (
        <SocketContext.Provider value={{ socket }}>
            {children}
        </SocketContext.Provider>
    )
}

export const useSocket = () => useContext(SocketContext)