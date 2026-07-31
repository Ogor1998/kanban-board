import React from 'react'
import { createContext, useContext, useState } from 'react'
import axios from 'axios';
import { useNotification } from './NotificationContext';

const AuthContext = createContext();


export function AuthProvider({ children }) {
    const { setMessage } = useNotification();
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [currentUser, setCurrentUser] = useState(null)


    const logout = async () => {
        const response = await axios.post('/logout', {}, { withCredentials: true })
        setMessage(response.data.message)
        setIsLoggedIn(false)
        setCurrentUser(null)

    }

    return (
        <AuthContext.Provider value={{
            isLoggedIn,
            setIsLoggedIn,
            currentUser,
            setCurrentUser,
            logout
        }}>
            {children}
        </AuthContext.Provider>
    )

}


export function useAuth() {
    return useContext(AuthContext);
}

