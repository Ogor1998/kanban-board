import axios from 'axios'
import React, { useState } from 'react'
import { useEffect } from 'react'
import './Home.css'
import { Link, Navigate, useLocation, useNavigate, useParams } from 'react-router-dom'
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { useNotification } from '../context/NotificationContext'
import AlertBox from '../components/AlertBox'
import NewBoardModal from '../components/NewBoardModal'
import { Box, Button } from '@mui/material'
import Delete from '@mui/icons-material/Delete'



const Home = () => {
    const [data, setData] = useState([])
    const [formData, setFormData] = useState({
        title: ""
    })
    const { message, setMessage } = useNotification();
    console.log("Home message:", message);
    useEffect(() => {
        const fetchData = async () => {
            const res = await axios.get('/boards');
            console.log(res.data.message)
            setData(res.data.board)
        }
        fetchData();
    }, [])
    const handleDeleteBoard = async (id) => {
        await axios.delete(`/boards/${id}`)
        setData((prev) => prev.filter(board => board._id !== id))
        console.log('frontend delete called')
    }

    return (
        <div className='home'>
            <AlertBox />

            <div className="container">
                {data.map((item) => (
                    <Box className='links'>
                        <Link to={`/columns/${item._id}`} key={item._id}>{item.title}</Link>
                        <Button onClick={() => handleDeleteBoard(item._id)}><Delete /></Button>
                    </Box>
                ))}
                <div>
                </div>
                <NewBoardModal setFormData={setFormData} formData={formData} setData={setData} />

            </div>
        </div>
    )
}

export default Home