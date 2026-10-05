import { Box, Button, TextField, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import Password from "../components/reuseable/Password"
import { useNotification } from "../context/NotificationContext"
import { useAuth } from "../context/AuthContext"
import { useLocation, useNavigate } from "react-router-dom";
import AlertBox from "../components/common/AlertBox";
import axios from "axios";
import './Login.css'
import AntigravityUsage from "../components/reuseable/AntigravityUsage"
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { NavLink } from "react-router-dom"



export default function Login() {
    const { setMessage, message } = useNotification();
    const { setCurrentUser, setIsLoggedIn, currentUser } = useAuth();
    const location = useLocation();
    const [formData, setFormData] = useState({
        username: "",
        password: ""
    })
    const navigate = useNavigate();

    useEffect(() => {
        if (!message.text) {
            setMessage({
                text: location.state?.message,
                severity: "error",
            });
        }

    }, [location.state, setMessage])





    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('/login', formData, { withCredentials: true })
            if (res.data?.isLoggedIn || res.data?.user) {
                setIsLoggedIn(true)
                setCurrentUser(res.data.user)
                const from = location.state?.from?.pathname || "/boards";
                setMessage({
                    text: "Welcome back!",
                    severity: "success",
                });

                navigate(from, { replace: true });
            } else {
                setMessage({
                    text: res.data?.message || "Invalid username or password",
                    severity: "error",
                });
            }

        } catch (err) {
            setMessage({
                text: err.response?.data?.message || "Login failed",
                severity: 'error'
            })
            console.log(err)
        }
    }
    return (

        <Box className='form__container'>
            <Box className='img__box'>
                <AntigravityUsage />
            </Box>
            <Box
                component="form"
                className="form"
                onSubmit={handleSubmit}
                fullWidth
            >
                {message && <div>   <AlertBox /></div>}
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <AccountCircleIcon />
                    <Typography variant="h6" gutterBottom>

                        Login to your account
                    </Typography>
                </Box>
                <TextField
                    id="outlined-basic"
                    label="Username"
                    variant="outlined"
                    name='username'
                    onChange={handleChange}
                    value={formData.username}
                    fullWidth
                />

                <Password formData={formData} handleChange={handleChange} />
                <Button type="submit" variant="outlined" fullWidth>Login</Button>

                <Typography variant="h6" gutterBottom>
                    Don't have an account? <NavLink className='login__link' to={'/register'}>Sign Up</NavLink>
                </Typography>

            </Box>

        </Box>

    )
}