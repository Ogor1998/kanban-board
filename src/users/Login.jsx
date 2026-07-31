import { Box, Button, TextField } from "@mui/material"
import { useState } from "react"
import Password from "../components/Password"
import { useNotification } from "../context/NotificationContext"
import { useAuth } from "../context/AuthContext"
import { useLocation, useNavigate } from "react-router-dom";
import AlertBox from "../components/AlertBox";
import axios from "axios";


export default function Login() {
    const { setMessage, message } = useNotification();
    const { setCurrentUser, setIsLoggedIn, currentUser } = useAuth();
    const location = useLocation();
    const [formData, setFormData] = useState({
        username: "",
        password: ""
    })
    const navigate = useNavigate();


    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(formData)
        try {
            const res = await axios.post('/login', formData, { withCredentials: true })
            console.log(res.data)
            setIsLoggedIn(true)
            setCurrentUser(res.data.user?.username)
            setMessage({
                text: res.data.message || location.state?.message,
                severity: 'success'

            })
            const from = location.state?.from?.pathname || "/boards";
            navigate(from, { replace: true })

        } catch (err) {
            setMessage({
                text: err.response?.data?.message || "Login failed",
                severity: 'error'
            })
            console.log(err)
        }
    }
    return (
        <Box>
            <Box
                component="form"
                sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px', width: '40ch' }}
                onSubmit={handleSubmit}
            >
                {message && <div>   <AlertBox /></div>}
                <TextField
                    id="outlined-basic"
                    label="Username"
                    variant="outlined"
                    name='username'
                    onChange={handleChange}
                    value={formData.username}
                />

                <Password formData={formData} handleChange={handleChange} />
                <Button type="submit" variant="outlined">Submit</Button>

            </Box>
        </Box >

    )
}