import { Box, Button, TextField, Typography } from "@mui/material"
import { useState } from "react"
import Password from "../components/Password"
import { useNotification } from "../context/NotificationContext"
import AlertBox from "../components/AlertBox"
import axios from "axios"
import AntigravityUsage from "../components/reuseable/AntigravityUsage"
import './Login.css'
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"



export default function Register() {
    const { message, setMessage } = useNotification();
    const { setIsLoggedIn, setCurrentUser } = useAuth();
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        firstname: "",
        lastname: "",
    })
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('/register', formData, { withCredentials: true })
            setIsLoggedIn(true);
            setCurrentUser(res.data.user);
            console.log(formData)
            setMessage({
                text: res.data.message,
                severity: 'success'

            })
            navigate('/boards')
        }
        catch (err) {
            console.log(err)
            setMessage({
                text: err.response?.data?.message || "Registeration failed",
                severity: 'error'
            })
        }
    }
    return (

        <Box className='form__container' >
            <Box className='img__box'>
                <AntigravityUsage />
            </Box>

            <Box
                component="form"
                className="form"
                sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', backgroundColor: '#fff' }}
                onSubmit={handleSubmit}
            >
                {message && <div>   <AlertBox /></div>}
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <AccountCircleIcon />
                    <Typography variant="h6" gutterBottom>

                        Create your account
                    </Typography>
                </Box>
                <TextField id="outlined-basic"
                    label="Username"
                    variant="outlined"
                    name='username'
                    onChange={handleChange}
                    value={formData.username}
                    fullWidth

                />
                <TextField id="outlined-basic"
                    label="Email"
                    variant="outlined"
                    name='email'
                    onChange={handleChange}
                    value={formData.email}
                    fullWidth
                />
                <TextField id="outlined-basic"
                    label="Firstname"
                    variant="outlined"
                    name='firstname'
                    onChange={handleChange}
                    value={formData.firstname}
                    fullWidth
                />
                <TextField id="outlined-basic"
                    label="Lastname"
                    variant="outlined"
                    name='lastname'
                    onChange={handleChange}
                    value={formData.lastname}
                    fullWidth
                />

                <Password formData={formData} handleChange={handleChange} />
                <Button type="submit" variant="outlined" fullWidth>Register</Button>

            </Box>


        </Box>

    )
}