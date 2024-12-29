import React from "react";
import './Header.css';
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
    const navigate = useNavigate();
    const isLoggedIn = !!localStorage.getItem("token");

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/"); // Redirect to the landing page
    };

    return (
        <header className="header">
            <div className="container">
                <h1 className="title">Finance Tracker</h1>
                <nav>
                    <ul className="nav-list">
                        {!isLoggedIn ? (
                            <li>
                                <Link to="/" className="nav-link">
                                    Home
                                </Link>
                            </li>
                        ) : (
                            <>
                                <li>
                                    <Link to="/dashboard" className="nav-link">
                                        Dashboard
                                    </Link>
                                </li>
                                <li>
                                    <button
                                        onClick={handleLogout}
                                        className="nav-link logout-button"
                                    >
                                        Logout
                                    </button>
                                </li>
                            </>
                        )}
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default Header;
