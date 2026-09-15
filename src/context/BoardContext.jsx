import React from 'react'
import axios from 'axios'
import { createContext, useContext, useState, useEffect } from 'react'
import { useNotification } from './NotificationContext';
import { useAuth } from './AuthContext';


const BoardContext = createContext();
export const BoardProvider = ({ children }) => {
    const { isLoggedIn } = useAuth();
    const [board, setBoard] = useState([])
    const [singleBoard, setSingleBoard] = useState({})
    const [loading, setLoading] = useState(true)
    const { setMessage } = useNotification();
    useEffect(() => {
        const fetchboards = async () => {
            if (!isLoggedIn) {
                setBoard([])
                setSingleBoard({})
                setLoading(false)
                return
            }
            try {
                const res = await axios.get('/boards')
                setBoard(res.data.board)
            } catch (err) {
                setMessage({
                    text: err.response?.data?.message,
                    severity: 'error'
                })
            } finally {
                setLoading(false)
            }
        }
        fetchboards();
    }, [isLoggedIn])

    const deleteBoard = async (id) => {
        const res = await axios.delete(`/boards/${id}`, { withCredentials: true })
        setBoard(prev => prev.filter(board => board._id !== id))
        setMessage({
            text: res.data?.message,
            severity: 'error'
        })
        console.log('frontend delete called')
    }

    const findBoard = async (id) => {
        try {
            const res = await axios.get(`/boards/${id}`)
            setSingleBoard(res.data)
        }
        catch (err) {
            setMessage({
                text: err.response?.data?.message,
                severity: 'error'
            })
        }
    }
    return (
        <BoardContext.Provider value={
            {
                board,
                setBoard,
                deleteBoard,
                loading,
                setLoading,
                findBoard,
                singleBoard
            }
        }>
            {children}
        </BoardContext.Provider>
    )
}

export function useBoard() {
    return useContext(BoardContext);
}
