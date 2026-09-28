import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { Button } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useNotification } from '../context/NotificationContext';

export default function BoardName({ setData, formData, setFormData }) {
    const { setMessage } = useNotification();
    const navigate = useNavigate();
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('/boards', formData);
            console.log(res.data)
            setData(prev => [...prev, formData])
            setMessage({ text: res.data.message, severity: 'success' })
            navigate('/boards')

        } catch (err) {
            console.log(err)
            setMessage({ text: err.response?.data?.message, severity: 'error' })
        }

    }
    return (
        <Box
            component="form"
            sx={{ '& > :not(style)': { m: 1, width: '25ch' } }}
            noValidate
            autoComplete="off"
            onSubmit={handleSubmit}
        >
            <Box>
                <TextField
                    id="outlined-basic"
                    variant="outlined"
                    name='title'
                    value={formData.title}
                    onChange={handleChange}
                    label="Board Name"
                    sx={{
                        width: "25rem",

                        "& .MuiOutlinedInput-root": {
                            fontSize: "1.6rem",
                            paddingY: "0.8rem",
                        },

                        "& .MuiInputLabel-root": {
                            fontSize: "1.6rem",
                        },
                    }}
                />


                <Button type='submit' sx={{ fontSize: '1.5rem' }}>Submit</Button>
            </Box>
        </Box >
    );
}
