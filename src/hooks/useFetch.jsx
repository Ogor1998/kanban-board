import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNotification } from '../context/NotificationContext'

const useFetch = (url, selector = (data) => data) => {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)
    const { setMessage } = useNotification();

    useEffect(() => {
        const fetch = async () => {
            if (!url) return
            try {
                const res = await axios.get(url);
                setData(selector(res.data))
                console.log('this is res.data', res.data)
            } catch (err) {
                setMessage({
                    text: err.response?.data?.message,
                    severity: 'error'
                })
            } finally {
                setLoading(false)
            }

        }
        fetch();
    }, [url])
    return (
        { data, setData, loading }
    )
}

export default useFetch