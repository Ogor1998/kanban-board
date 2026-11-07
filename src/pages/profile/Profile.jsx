import axios from "axios"
import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
// import ProfileComponent from "./ProfileComponent"
import ProfileComponent from "./ProfileComponentv1"
import './Profile.css'
import { getUserProfile } from "../../api/profiles"
import ProfileSkeleton from "../../skeletons/ProfileSkeleton"
import { useNotification } from "../../context/NotificationContext"
import { useAuth } from "../../context/AuthContext"

export default function Profile() {
    const [profile, setProfile] = useState({});
    const [isEditting, setIsEditting] = useState(false)
    const [loading, setLoading] = useState(true)
    const { username } = useParams();
    const { setMessage } = useNotification();
    useEffect(() => {
        if (!username || username === "undefined") return;
        const fetchProfile = async () => {
            try {
                const res = await getUserProfile(username)
                setProfile(res.data)

            } catch (err) {
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

    if (loading) {
        return <ProfileSkeleton />
    }
    return (
        <ProfileComponent profile={profile} username={username} />

    )
}