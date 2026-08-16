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
import CircularProgress from '@mui/material/CircularProgress';
import { Typography } from '@mui/material'



const Home = () => {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)
    const [formData, setFormData] = useState({
        title: ""
    })
    const { message, setMessage } = useNotification();

    console.log("Home message:", message);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get('/boards');
                console.log(res.data.message)
                setData(res.data.board)
            } catch (err) {
                setMessage(err.response?.data?.message)
            } finally {
                setLoading(false)
            }
        }
        fetchData();
    }, [])
    const handleDeleteBoard = async (id) => {
        await axios.delete(`/boards/${id}`)
        setData((prev) => prev.filter(board => board._id !== id))
        console.log('frontend delete called')
    }

    if (loading) {
        return <Box sx={{ display: 'flex' }}>
            <CircularProgress aria-label="Loading…" />
        </Box>;
    }

    if (data.length === 0) {
        return (
            <Box sx={{ m: 1, }} className='no__data'>
                <Typography variant="h6" gutterBottom sx={{ fontSize: '3rem' }}>
                    You don't have any boards yet.

                </Typography>
                <NewBoardModal
                    setFormData={setFormData}
                    formData={formData}
                    setData={setData}
                />
            </Box>

        );
    }

    return (
        <div className='home'>
            <AlertBox />

            <div className="home__container">
                {data.map((item) => (
                    <Box className='links' key={item._id}>
                        <Link to={`/columns/${item._id}`} >{item.title}</Link>
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