import { useEffect, useState } from "react";
import { useParams, useNavigate, NavLink } from "react-router-dom";
import axios from "axios";
import AvatarUpload from "./AvatarUpload";
import {
    Box,
    TextField,
    Button,
    Typography,
    Paper,
    Divider,
    Stack,
} from "@mui/material";
import { useNotification } from "../../context/NotificationContext";
import { CircularProgress } from "@mui/material";
import { useAuth } from "../../context/AuthContext";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import { Link as RouterLink } from "react-router-dom";

export default function ProfileEditComponent() {
    const { username } = useParams();
    const [isSaving, setIsSaving] = useState(false)
    const [formData, setFormData] = useState({
        username: "",
        firstname: "",
        lastname: "",
        email: "",
        image: "",
        description: ""
    });
    const [loading, setLoading] = useState(false)
    const [preview, setPreview] = useState(null)
    const { setMessage } = useNotification();
    const [profile, setProfile] = useState(null)



    const { isLoggedIn, currentUser } = useAuth();
    const navigate = useNavigate();


    // useEffect(() => {
    //     if (!currentUser) {
    //         setTimeout(() => {

    //             navigate('/login')
    //         }, 1000)
    //     }
    // }, [currentUser])

    useEffect(() => {
        const fetchProfile = async () => {
            setLoading(true)
            try {
                const res = await axios.get(`/profile/${username}`)
                console.log(res.data)
                setProfile(res.data)
            }
            catch (err) {
                setMessage({
                    text: err.response?.data?.message,
                    severity: 'error'
                })
            } finally {
                setLoading(false)
            }
        }
        fetchProfile();

    }, [username])
    const [file, setFile] = useState(profile?.image)


    useEffect(() => {
        if (profile) {
            setFormData({
                username: profile.username || "",
                firstname: profile.firstname || "",
                lastname: profile.lastname || "",
                email: profile.email || "",
                image: profile.image || "",
                description: profile.description || ""
            });
        }
    }, [profile]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setIsSaving(true)

        const form = new FormData();
        form.append("username", formData.username)
        form.append("email", formData.email)
        form.append("firstname", formData.firstname)
        form.append("lastname", formData.lastname)
        form.append("description", formData.description)

        if (file) {
            form.append("image", file)
        }

        try {
            const response = await axios.put('/profile', form, {
                withCredentials: true,
            });
            console.log('this is form object', formData)
            setProfile(response.data.user)
            setMessage({
                text: "Profile updated successfully",
                severity: "success"
            });
            navigate(`/profile/${username}`)
        } catch (err) {
            setMessage({ text: err.response?.data?.message, severity: "error" })
        } finally {
            setIsSaving(false)
        }
    };

    return (
        <Paper
            elevation={3}
            component="form"
            onSubmit={handleSubmit}
            sx={{
                width: "100%",
                maxWidth: 480,
                mx: "auto",
                mt: 4,
                p: { xs: 2.5, sm: 4 },
                borderRadius: 3,
                display: "flex",
                flexDirection: "column",
                gap: 2.5,
            }}
        >
            <Box>
                <Typography variant="h5" fontWeight={700}>
                    Edit Profile
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Update your account details and profile picture.
                </Typography>
            </Box>

            <Divider />

            {/* Avatar Section */}
            <Box sx={{ display: "flex", justifyContent: "center", py: 1 }}>
                <AvatarUpload setFile={setFile} currentImage={profile?.image} />
            </Box>

            {/* Form Fields */}
            <Stack spacing={2}>
                <TextField
                    fullWidth
                    size="small"
                    label="Username"
                    name="username"
                    value={formData.username}
                    disabled
                    helperText="Username cannot be modified"
                />

                <TextField
                    fullWidth
                    size="small"
                    label="Email Address"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />

                <TextField
                    id="outlined-multiline-flexible"
                    label="Description"
                    name="description"
                    multiline
                    fullWidth
                    maxRows={4}
                    value={formData.description}
                    onChange={handleChange}
                />

                <Box sx={{ display: "flex", gap: 1.5 }}>
                    <TextField
                        fullWidth
                        size="small"
                        label="First Name"
                        name="firstname"
                        value={formData.firstname}
                        onChange={handleChange}
                        required
                    />
                    <TextField
                        fullWidth
                        size="small"
                        label="Last Name"
                        name="lastname"
                        value={formData.lastname}
                        onChange={handleChange}
                        required
                    />
                </Box>
            </Stack>

            <Divider sx={{ my: 0.5 }} />

            {/* Action Buttons */}
            <Box sx={{ display: "flex", gap: 1.5, justifyContent: "flex-end" }}>
                <Button
                    component={RouterLink}
                    to={`/profile/${username}`}
                    variant="outlined"
                    color="inherit"
                    startIcon={<ArrowBackIcon />}
                    disabled={isSaving}
                >
                    Return Home
                </Button>

                <Button
                    type="submit"
                    variant="contained"
                    disabled={isSaving}
                    startIcon={
                        isSaving ? (
                            <CircularProgress size={18} color="inherit" thickness={4} />
                        ) : (
                            <SaveIcon />
                        )
                    }
                    sx={{ minWidth: 140 }}
                >
                    {isSaving ? "Saving..." : "Save Changes"}
                </Button>
            </Box>

            {profile?.updatedAt && (
                <Typography variant="caption" color="text.secondary" textAlign="center">
                    Last modified: {new Date(profile.updatedAt).toLocaleDateString()}
                </Typography>
            )}
        </Paper>
    );

}