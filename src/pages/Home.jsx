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



const Home = () => {
    const [data, setData] = useState([])
    const [formData, setFormData] = useState({
        title: ""
    })
    console.log(data)
    // const { id } = useParams();
    useEffect(() => {
        const fetchData = async () => {
            const res = await axios.get('/boards');
            console.log(res.data)
            setData(res.data.board)

        }
        fetchData();
    }, [])
    return (
        <div className='home'>
            {/* <h1>{data.message}</h1> */}

            <div className="container">
                {data.map((item) => (
                    <div key={item._id}><Link to={`/columns/${item._id}`}>{item.title}</Link></div>
                ))}
                <div>
                </div>
                <BoardName setFormData={setFormData} formData={formData} setData={setData} />
            </div>
        </div>
    )
}

export default Home