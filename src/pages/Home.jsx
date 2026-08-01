import axios from 'axios'
import React, { useState } from 'react'
import { useEffect } from 'react'
import './Home.css'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import BoardName from '../components/BoardName'
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
    const navigate = useNavigate();
    const [data, setData] = useState([])
    const [formData, setFormData] = useState({
        title: ""
    })

    const { setMessage } = useNotification();
    console.log(data)
    // const { id } = useParams();
    useEffect(() => {
        const fetchData = async () => {
            const res = await axios.get('/boards');
            console.log(res.data)
            setData(res.data.board)
            setMessage({ text: res.data.message, })
        }
        fetchData();
    }, [])
    const handleDeleteBoard = async (id) => {
        await axios.delete(`/boards/${id}`)
        setData((prev) => prev.filter(board => board._id !== id))
        console.log('frontend delete called')
    }
    const handleShow = (id) => {
        return navigate(`/columns/${id}`)
    }
    return (
        <div className='home'>
            <AlertBox />

            <div className="container">
                {data.map((item) => (
                    <Box className='links' onClick={() => handleShow(item._id)}>
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