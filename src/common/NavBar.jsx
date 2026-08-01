
import { Link } from "react-router-dom"
import './NavBar.css'
import { useAuth } from "../context/AuthContext"


export default function NavBar() {
    const { currentUser, isLoggedIn, logout } = useAuth();
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