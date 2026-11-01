import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import {
    Box,
    Paper,
    Typography,
    TextField,
    Button,
    Avatar,
    IconButton,
    InputAdornment,
    CircularProgress,
} from '@mui/material'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import PhotoCamera from '@mui/icons-material/PhotoCamera'
import ViewKanbanIcon from '@mui/icons-material/ViewKanban'
import { useNotification } from '../context/NotificationContext'
import { useAuth } from '../context/AuthContext'
import AlertBox from '../components/common/AlertBox'

const initialForm = {
    firstname: '',
    lastname: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
}

export default function Register() {
    const navigate = useNavigate()
    const { message, setMessage } = useNotification()
    const { setCurrentUser, setIsLoggedIn } = useAuth()

    const [formData, setFormData] = useState(initialForm)
    const [errors, setErrors] = useState({})
    const [file, setFile] = useState(null)
    const [preview, setPreview] = useState(null)
    const [showPassword, setShowPassword] = useState(false)
    const [submitting, setSubmitting] = useState(false)

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
        // clear the error for a field as soon as the user edits it
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }))
    }

    const handleFile = (e) => {
        const selected = e.target.files[0]
        if (!selected) return
        if (!selected.type.startsWith('image/')) {
            setMessage({ text: 'Please choose an image file', severity: 'error' })
            return
        }
        setFile(selected)
        setPreview(URL.createObjectURL(selected))
    }

    const validate = () => {
        const next = {}
        if (!formData.firstname.trim()) next.firstname = 'First name is required'
        if (!formData.lastname.trim()) next.lastname = 'Last name is required'
        if (formData.username.trim().length < 3) next.username = 'Username must be at least 3 characters'
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) next.email = 'Enter a valid email address'
        if (formData.password.length < 8) next.password = 'Password must be at least 8 characters'
        if (formData.confirmPassword !== formData.password) next.confirmPassword = 'Passwords do not match'
        setErrors(next)
        return Object.keys(next).length === 0
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!validate()) return

        const form = new FormData()
        form.append('firstname', formData.firstname.trim())
        form.append('lastname', formData.lastname.trim())
        form.append('username', formData.username.trim())
        form.append('email', formData.email.trim())
        form.append('password', formData.password)
        if (file) form.append('image', file)

        setSubmitting(true)
        try {
            const res = await axios.post('/register', form, { withCredentials: true })
            setCurrentUser(res.data.user)
            setIsLoggedIn(true)
            setMessage({ text: res.data.message || 'Account created', severity: 'success' })
            navigate('/boards')
        } catch (err) {
            setMessage({
                text: err.response?.data?.message || 'Registration failed',
                severity: 'error',
            })
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                p: 2,
                // background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            }}
        >

            {message && <div>   <AlertBox /></div>}
            <Paper
                elevation={0}
                sx={{
                    width: '100%',
                    maxWidth: 480,
                    p: { xs: 3, sm: 4 },
                    borderRadius: 4,
                    backdropFilter: 'blur(14px)',
                    background: 'rgba(255,255,255,0.88)',
                    boxShadow: '10px 10px 30px rgba(0,0,0,0.25)',
                }}
            >
                {/* Header */}
                <Box sx={{ textAlign: 'center', mb: 3 }}>
                    <ViewKanbanIcon sx={{ fontSize: 42, color: 'primary.main' }} />
                    <Typography variant="h5" fontWeight={700}>
                        Create your account
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Start organising your work with boards, columns and cards
                    </Typography>
                </Box>

                <Box component="form" onSubmit={handleSubmit} noValidate>
                    {/* Avatar upload */}
                    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                        <Box sx={{ position: 'relative' }}>
                            <Avatar src={preview} sx={{ width: 88, height: 88 }} />
                            <IconButton
                                component="label"
                                size="small"
                                sx={{
                                    position: 'absolute',
                                    bottom: -4,
                                    right: -4,
                                    bgcolor: 'primary.main',
                                    color: '#fff',
                                    '&:hover': { bgcolor: 'primary.dark' },
                                }}
                            >
                                <PhotoCamera fontSize="small" />
                                <input hidden type="file" accept="image/*" onChange={handleFile} />
                            </IconButton>
                        </Box>
                    </Box>

                    {/* Name row */}
                    <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                        <TextField
                            label="First name"
                            name="firstname"
                            value={formData.firstname}
                            onChange={handleChange}
                            error={!!errors.firstname}
                            helperText={errors.firstname}
                            fullWidth
                            margin="dense"
                        />
                        <TextField
                            label="Last name"
                            name="lastname"
                            value={formData.lastname}
                            onChange={handleChange}
                            error={!!errors.lastname}
                            helperText={errors.lastname}
                            fullWidth
                            margin="dense"
                        />
                    </Box>

                    <TextField
                        label="Username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        error={!!errors.username}
                        helperText={errors.username}
                        fullWidth
                        margin="dense"
                        autoComplete="username"
                    />

                    <TextField
                        label="Email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        error={!!errors.email}
                        helperText={errors.email}
                        fullWidth
                        margin="dense"
                        autoComplete="email"
                    />

                    <TextField
                        label="Password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={handleChange}
                        error={!!errors.password}
                        helperText={errors.password}
                        fullWidth
                        margin="dense"
                        autoComplete="new-password"
                        slotProps={{
                            input: {
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => setShowPassword((prev) => !prev)}
                                            edge="end"
                                            aria-label="toggle password visibility"
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            },
                        }}
                    />

                    <TextField
                        label="Confirm password"
                        name="confirmPassword"
                        type={showPassword ? 'text' : 'password'}
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        error={!!errors.confirmPassword}
                        helperText={errors.confirmPassword}
                        fullWidth
                        margin="dense"
                        autoComplete="new-password"
                    />

                    <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        fullWidth
                        disabled={submitting}
                        sx={{ mt: 2, py: 1.2, borderRadius: 2 }}
                    >
                        {submitting ? <CircularProgress size={24} color="inherit" /> : 'Create account'}
                    </Button>
                </Box>

                <Typography variant="body2" sx={{ textAlign: 'center', mt: 3 }}>
                    Already have an account?{' '}
                    <Link to="/login" style={{ fontWeight: 600 }}>
                        Log in
                    </Link>
                </Typography>
            </Paper>
        </Box>
    )
}
