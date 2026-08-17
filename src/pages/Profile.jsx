import axios from "axios"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import ProfileComponent from "../components/ProfileComponent";
import './Profile.css'

export default function Profile() {
    const [profile, setProfile] = useState({});
    const { username } = useParams();
    useEffect(() => {
        if (!username || username === "undefined") return;
        const fetchProfile = async () => {
            const res = await axios.get(`/profile/${username}`)
            setProfile(res.data)
            console.log('this is  the profile:', res.data)
        }
        fetchProfile();
    }, [username])
    return (
        <ProfileComponent profile={profile} />
    )
}