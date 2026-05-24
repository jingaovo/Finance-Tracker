import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
    const navigate = useNavigate();
    const isLoggedIn = !!localStorage.getItem("token");

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/");
    };

    return (
        <header className="border-b border-slate-200 bg-white">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
                <Link to={isLoggedIn ? "/dashboard" : "/"} className="flex items-center gap-2 no-underline">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600">
                        <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <span className="text-lg font-bold tracking-tight text-slate-900">Finance Tracker</span>
                </Link>
                <nav>
                    <ul className="flex items-center gap-1 sm:gap-2">
                        {!isLoggedIn ? (
                            <li>
                                <Link
                                    to="/"
                                    className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 no-underline transition hover:bg-slate-100 hover:text-slate-900"
                                >
                                    Home
                                </Link>
                            </li>
                        ) : (
                            <>
                                <li>
                                    <Link
                                        to="/dashboard"
                                        className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 no-underline transition hover:bg-slate-100 hover:text-slate-900"
                                    >
                                        Dashboard
                                    </Link>
                                </li>
                                <li>
                                    <button
                                        type="button"
                                        onClick={handleLogout}
                                        className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
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
