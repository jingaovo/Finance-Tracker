import React, { useState } from "react";
import "./LandingPage.css";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
    const [isLogin, setIsLogin] = useState(true);

    const toggleForm = () => {
        setIsLogin((prevState) => !prevState);
    };

    return (
        <div className="landing-page">
            <div className="landing-header">
                <h1>Finance Tracker</h1>
                <p>Track your finances effortlessly with style.</p>
            </div>
            <div className="landing-container">
                <div className="form-toggle">
                    <button
                        className={`toggle-button ${isLogin ? "active" : ""}`}
                        onClick={() => setIsLogin(true)}
                    >
                        Login
                    </button>
                    <button
                        className={`toggle-button ${!isLogin ? "active" : ""}`}
                        onClick={() => setIsLogin(false)}
                    >
                        Register
                    </button>
                </div>
                <div className="form-wrapper">
                    {isLogin ? <LoginForm /> : <RegisterForm />}
                </div>
            </div>
        </div>
    );
};

const LoginForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const response = await fetch("http://localhost:5001/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to log in");
            }

            localStorage.setItem("token", data.token);
            navigate("/dashboard");
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <form className="auth-form" onSubmit={handleLogin}>
            <div className="form-group">
                <label className="form-label">Email:</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-input"
                    required
                />
            </div>
            <div className="form-group">
                <label className="form-label">Password:</label>
                <div className="password-input-container">
                    <input
                        type={passwordVisible ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="form-input"
                        required
                    />
                    <button
                        type="button"
                        className="password-toggle"
                        onClick={() => setPasswordVisible(!passwordVisible)}
                    >
                        {passwordVisible ? "Hide" : "Show"}
                    </button>
                </div>
            </div>
            {error && <p className="register-error">{error}</p>}
            <button type="submit" className="form-button">Login</button>
        </form>
    );
};

const RegisterForm = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const response = await fetch("http://localhost:5001/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name, email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to register");
            }

            navigate("/dashboard");
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <form className="auth-form" onSubmit={handleRegister}>
            <div className="form-group">
                <label className="form-label">Name:</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="form-input"
                    required
                />
            </div>
            <div className="form-group">
                <label className="form-label">Email:</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-input"
                    required
                />
            </div>
            <div className="form-group">
                <label className="form-label">Password:</label>
                <div className="password-input-container">
                    <input
                        type={passwordVisible ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="form-input"
                        required
                    />
                    <button
                        type="button"
                        className="password-toggle"
                        onClick={() => setPasswordVisible(!passwordVisible)}
                    >
                        {passwordVisible ? "Hide" : "Show"}
                    </button>
                </div>
            </div>
            {error && <p className="register-error">{error}</p>}
            <button type="submit" className="form-button">Register</button>
        </form>
    );
};

export default LandingPage;
