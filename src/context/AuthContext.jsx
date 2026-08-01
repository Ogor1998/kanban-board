import React from 'react'
import { createContext, useContext, useState, useEffect } from 'react'
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
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await axios.get("/check-auth");

                setIsLoggedIn(true);
                setCurrentUser(res.data.user);

            } catch {
                setIsLoggedIn(false);
                setCurrentUser(null);
            }
        };

        checkAuth();
    }, []);

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

