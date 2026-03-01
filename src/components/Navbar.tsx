import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { useEffect, useRef } from "react";

export default function Navbar() {
    const { isLoggedIn, logout } = useAuth();
    const navigate = useNavigate();
    const logo = "/images/friendship.avif";
    const navbarRef = useRef<HTMLElement>(null);
    
    // Shared style for all nav links for better readability on dark background
    const baseLinkStyle: React.CSSProperties = {
        color: "#ffffff",
        opacity: 0.9,
        textDecoration: "none",
        transition: "opacity .2s ease, color .2s ease, transform .2s ease",
    };
    const activeLinkStyle: React.CSSProperties = {
        color: "#ffffff",
        opacity: 1,
        fontWeight: 600,
        textUnderlineOffset: 6,
    };

    const closeNavbar = () => {
        const navbarToggler = document.querySelector('.navbar-toggler') as HTMLButtonElement;
        const navbarCollapse = document.querySelector('.navbar-collapse') as HTMLElement;
        
        if (navbarCollapse?.classList.contains('show')) {
            navbarToggler?.click();
        }
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (navbarRef.current && !navbarRef.current.contains(event.target as Node)) {
                closeNavbar();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <nav ref={navbarRef} className="navbar navbar-expand-lg navbar-dark fixed-top shadow">
            <div className="container">
                <NavLink className="navbar-brand fs-3 fw-bold mb-1" to="/events" onClick={closeNavbar}
                    style={{ color: "#ffffff" }}
                >
                <p className="text-white fs-3 m-0">Eventure <img src={logo} alt="Eventure" style={{ maxHeight: "30px", mixBlendMode: "multiply" }} /></p>
                </NavLink>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Show or hide menu"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0 navbar-ul">
                        {isLoggedIn && (
                            <>
                                <li className="nav-item">
                                    <NavLink
                                        className={({ isActive }) =>
                                            `nav-link ${isActive ? "active-link" : ""}`
                                        }
                                        to="/events"
                                        onClick={closeNavbar}
                                        style={({ isActive }) => ({
                                            ...(isActive ? activeLinkStyle : baseLinkStyle),
                                        })}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.opacity = "1";
                                            e.currentTarget.style.transform = "translateY(-1px)";
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.opacity = "0.9";
                                            e.currentTarget.style.transform = "translateY(0)";
                                        }}
                                    >
                                        Events
                                    </NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink
                                        className={({ isActive }) =>
                                            `nav-link ${isActive ? "active-link" : ""}`
                                        }
                                        to="/my-events"
                                        end={false}
                                        onClick={closeNavbar}
                                        style={({ isActive }) => ({
                                            ...(isActive ? activeLinkStyle : baseLinkStyle),
                                        })}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.opacity = "1";
                                            e.currentTarget.style.transform = "translateY(-1px)";
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.opacity = "0.9";
                                            e.currentTarget.style.transform = "translateY(0)";
                                        }}
                                    >
                                        My Events
                                    </NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink
                                        className={({ isActive }) =>
                                            `nav-link ${isActive ? "active-link" : ""}`
                                        }
                                        to="/friends"
                                        onClick={closeNavbar}
                                        style={({ isActive }) => ({
                                            ...(isActive ? activeLinkStyle : baseLinkStyle),
                                        })}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.opacity = "1";
                                            e.currentTarget.style.transform = "translateY(-1px)";
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.opacity = "0.9";
                                            e.currentTarget.style.transform = "translateY(0)";
                                        }}
                                    >
                                        Friends
                                    </NavLink>
                                </li>
                            </>
                        )}
                        {!isLoggedIn && (
                            <>
                                <li className="nav-item">
                                    <NavLink
                                        className={({ isActive }) =>
                                            `nav-link ${isActive ? "active-link" : ""}`
                                        }
                                        to="/"
                                        onClick={closeNavbar}
                                        style={({ isActive }) => ({
                                            ...(isActive ? activeLinkStyle : baseLinkStyle),
                                        })}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.opacity = "1";
                                            e.currentTarget.style.transform = "translateY(-1px)";
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.opacity = "0.9";
                                            e.currentTarget.style.transform = "translateY(0)";
                                        }}
                                    >
                                        Home
                                    </NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink
                                        className={({ isActive }) =>
                                            `nav-link ${isActive ? "active-link" : ""}`
                                        }
                                        to="/login"
                                        onClick={closeNavbar}
                                        style={({ isActive }) => ({
                                            ...(isActive ? activeLinkStyle : baseLinkStyle),
                                        })}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.opacity = "1";
                                            e.currentTarget.style.transform = "translateY(-1px)";
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.opacity = "0.9";
                                            e.currentTarget.style.transform = "translateY(0)";
                                        }}
                                    >
                                        Log in
                                    </NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink
                                        className={({ isActive }) =>
                                            `nav-link ${isActive ? "active-link" : ""}`
                                        }
                                        to="/register"
                                        onClick={closeNavbar}
                                        style={({ isActive }) => ({
                                            ...(isActive ? activeLinkStyle : baseLinkStyle),
                                        })}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.opacity = "1";
                                            e.currentTarget.style.transform = "translateY(-1px)";
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.opacity = "0.9";
                                            e.currentTarget.style.transform = "translateY(0)";
                                        }}
                                    >
                                        Sign up
                                    </NavLink>
                                </li>
                            </>
                        )}

                    </ul>
                    {isLoggedIn && (
                        <>
                            <div className="d-flex align-items-center justify-content-end gap-2">
                                <button className="btn btn-light"
                                    onClick={() => {
                                        navigate("/profile");
                                        closeNavbar();
                                    }}
                                >
                                    Profile
                                </button>
                                <button onClick={() => {
                                    logout();
                                    navigate("/");
                                    closeNavbar();
                                }} className="btn btn-light">
                                    Log out
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}
