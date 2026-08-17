
import {
    Avatar,
    Box,
    Card,
    CardContent,
    Typography,
    CircularProgress,
    Button,
    Paper
} from "@mui/material";
import { useAuth } from "../context/AuthContext";

export default function ProfileComponent({ profile }) {
    const { currentUser } = useAuth();
    const allowedToEditProfile = profile._id === currentUser?._id;
    console.log('this is updated time:', profile.updatedAt)

    if (!profile) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
                <CircularProgress />
            </Box>
        );
    }


    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                mt: 5,
            }}
            className='profile__box'

        >
            <Card sx={{ width: 500, boxShadow: ' 10px 10px 20px rgba(0, 0, 0, 0.3)' }}>
                <CardContent>
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            mb: 3,
                        }}
                        elevation={3}
                    >
                        {allowedToEditProfile && <Button color='alert' variant="outlined" sx={{ marginBottom: '10px' }}>Edit Profile</Button>}
                        <Avatar
                            src={profile.image}
                            alt={profile.username}
                            sx={{ width: 100, height: 100 }}
                        />

                        <Typography variant="h5" sx={{ mt: 2 }}>
                            {profile.username}
                        </Typography>
                    </Box>

                    <Typography variant="body1" gutterBottom>
                        <strong>First Name:</strong> {profile.firstname || "Not provided"}
                    </Typography>

                    <Typography variant="body1" gutterBottom>
                        <strong>Last Name:</strong> {profile.lastname || "Not provided"}
                    </Typography>

                    <Typography variant="body1" gutterBottom>
                        <strong>Email:</strong> {profile.email}
                    </Typography>

                    <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                        Last Profile Edit{" "}
                        {new Date(profile.updatedAt).toLocaleDateString()}
                    </Typography>
                </CardContent>
            </Card>
        </Box>
    );
}