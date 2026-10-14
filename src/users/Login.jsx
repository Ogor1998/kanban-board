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
    const [triesCount, setTriesCount] = useState(5)
    const [timerleft, setTimerLeft] = useState(5 * 60 * 1000)
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

    const isLockedOut = triesCount === 0
    useEffect(() => {
        if (!isLockedOut) return
        const intervalId = setInterval(() => {
            setTimerLeft(prev => {
                if (prev <= 1000) {
                    setTriesCount(5);
                    return 5 * 60 * 1000
                }
                return prev - 1000
            })
        }, 1000)
        return () => clearInterval(intervalId)
    }, [isLockedOut])


    const minutes = Math.floor(timerleft / (1000 * 60))
    const seconds = Math.floor(timerleft % (1000 * 60) / 1000)
    const timeDisplay = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
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
            const status = err.response?.status;

            if (status === 401 || status === 400) {
                setIsHidden(true);
                setTriesCount(prev => Math.max(0, prev - 1));

                setMessage({
                    text: err.response?.data?.message || "Invalid username or password",
                    severity: "error"
                });
            } else {
                setMessage({
                    text: "Unable to reach the server. Please try again.",
                    severity: "error"
                });
            }

            console.error(err);
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
                <Button type="submit" variant="contained" disabled={triesCount === 0 ? true : false} fullWidth>Login</Button>
                {triesCount < 5 && <Typography sx={{ fontSize: '1.7rem' }}>You have <strong style={{ color: 'red' }}>{triesCount}</strong> tries left </Typography>}
                {triesCount === 0 && <Typography>Try again in {timeDisplay}</Typography>}


                <Typography variant="h6" gutterBottom>
                    Don't have an account? <NavLink className='login__link' to={'/register'}><Button variant="contained">Sign Up</Button></NavLink>
                </Typography>

            </Box>

        </Box>

    )
}