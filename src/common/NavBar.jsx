
import { Link } from "react-router-dom"
import './NavBar.css'
import { useAuth } from "../context/AuthContext"
import { NavLink } from "react-router-dom";
import { useState } from "react";


export default function NavBar() {
    const { currentUser, isLoggedIn, logout } = useAuth();
    const [isActivePage, setIsActivePage] = useState(null)
    const style = {
        borderBottom: '3px solid red'
    }
    return (
        <nav className="navbar">
            <Link to={`/boards`}>Home</Link>
            {!isLoggedIn ?
                (
                    <>
                        <Link to={`/login`}>Login</Link>
                        <Link to={`/register`}>Register</Link></>
                ) : (
                    <>
                        <p>{currentUser.username}</p>
                        <Link onClick={logout}>Logout</Link></>
                )

            }
        </nav>
    )
}