import axios from "axios"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import ProfileComponent from "./ProfileComponent"
import './Profile.css'
import ProfileEditComponent from "./ProfileEditComponent";

export default function Profile() {
    const [profile, setProfile] = useState({});
    const [isEditting, setIsEditting] = useState(false)
    const { username } = useParams();
    useEffect(() => {
        if (!username || username === "undefined") return;
        const fetchProfile = async () => {
            const res = await axios.get(`/profile/${username}`)
            setProfile(res.data)
            // console.log('this is  the profile:', res.data)
        }
        fetchProfile();
    }, [username])

    const handleClick = () => {
        setIsEditting(prev => !prev);
        console.log(isEditting)
    }
    return (
        isEditting ? <ProfileEditComponent profile={profile} setProfile={setProfile} handleClick={handleClick} /> :
            <ProfileComponent profile={profile} handleClick={handleClick} />


    )
}