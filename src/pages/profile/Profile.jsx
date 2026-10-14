import axios from "axios"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import ProfileComponent from "../../components/ProfileComponent"
import './Profile.css'
import ProfileEditComponent from "./ProfileEditComponent";
import { getUserProfile } from "../../api/profiles"
import ProfileSkeleton from "../../skeletons/ProfileSkeleton"
import { useNotification } from "../../context/NotificationContext"

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

    const handleClick = () => {
        setIsEditting(prev => !prev);
        console.log(isEditting)
    }

    if (loading) {
        return <ProfileSkeleton />
    }
    return (
        isEditting ? <ProfileEditComponent profile={profile} setProfile={setProfile} handleClick={handleClick} /> :
            <ProfileComponent profile={profile} handleClick={handleClick} />


    )
}