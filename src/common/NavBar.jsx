
import './NavBar.css'
import { useAuth } from "../context/AuthContext"
import { NavLink } from "react-router-dom";



export default function NavBar() {
    const { currentUser, isLoggedIn, logout } = useAuth();


    return (
        <nav className="navbar">
            <NavLink to={`/boards`} className={({ isActive }) => isActive ? "active__link" : ""}>Home</NavLink>
            {!isLoggedIn ?
                (
                    <>
                        <NavLink to={`/login`} className={({ isActive }) => isActive ? "active__link" : ""}>Login</NavLink>
                        <NavLink to={`/register`} className={({ isActive }) => isActive ? "active__link" : ""}>Register</NavLink>
                    </>
                ) : (
                    <>


                        <NavLink to={`/profile/${currentUser?.username}`}>{currentUser?.username.toUpperCase()}</NavLink>
                        <NavLink onClick={logout} >Logout</NavLink>
                    </>
                )

            }
        </nav>
    )
}