import React from 'react'
import { createContext, useContext, useState } from 'react'

const NotificationContext = createContext();
export const NotificationProvider = ({ children }) => {
    const [message, setMessage] = useState({ text: "", severity: "success" })
    return (

        <NotificationContext.Provider value={{ message, setMessage }}>
            {children}
        </NotificationContext.Provider>
    )
}


export function useNotification() {
    const context = useContext(NotificationContext)
    if (!context) {
        throw new Error(
            "useNotification must be used within a NotificationProvider"
        );
    }
    return context;
}