import axios from 'axios'
import React, { useState } from 'react'
import { useEffect } from 'react'
import './Home.css'
import { Link, useParams } from 'react-router-dom'
import BoardName from '../components/BoardName'
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { useNotification } from '../context/NotificationContext'
import AlertBox from '../components/AlertBox'



const Home = () => {
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
    return (
        <div className='home'>
            {/* <h1>{data.message}</h1> */}
            <AlertBox />

            <div className="container">
                {data.map((item) => (
                    <Link className='links' to={`/columns/${item._id}`} key={item._id}>{item.title}</Link>
                ))}
                <div>
                </div>
                <BoardName setFormData={setFormData} formData={formData} setData={setData} />
            </div>
        </div>
    )
}

export default Home