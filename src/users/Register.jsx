import { Box, Button, TextField } from "@mui/material"
import { useState } from "react"
import Password from "../components/Password"
import { useNotification } from "../context/NotificationContext"
import AlertBox from "../components/AlertBox"
import axios from "axios"

export default function Register() {
    const { message, setMessage } = useNotification();
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        firstname: "",
        lastname: "",
    })

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('/register', formData, { withCredentials: true })
            console.log(formData)
            setMessage({
                text: res.data.message,
                severity: 'success'

            })
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
        <Box sx={{ width: '100rem', padding: '20px', backgroundColor: '#fff' }}>
            {message && <div>   <AlertBox /></div>}
            <Box
                component="form"
                sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}
                onSubmit={handleSubmit}
            >
                <TextField id="outlined-basic"
                    label="Username"
                    variant="outlined"
                    name='username'
                    onChange={handleChange}
                    value={formData.username}

                />
                <TextField id="outlined-basic"
                    label="Email"
                    variant="outlined"
                    name='email'
                    onChange={handleChange}
                    value={formData.email}

                />
                <TextField id="outlined-basic"
                    label="Firstname"
                    variant="outlined"
                    name='firstname'
                    onChange={handleChange}
                    value={formData.firstname}

                />
                <TextField id="outlined-basic"
                    label="Lastname"
                    variant="outlined"
                    name='lastname'
                    onChange={handleChange}
                    value={formData.lastname}

                />

                <Password formData={formData} handleChange={handleChange} />
                <Button type="submit" variant="outlined">Submit</Button>

            </Box>
        </Box >

    )
}