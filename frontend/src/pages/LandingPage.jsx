import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const inputClass =
    "w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500";

const labelClass = "mb-1.5 block text-sm font-medium text-slate-700";

const PasswordField = ({ value, onChange, visible, onToggleVisible }) => (
    <div className="relative">
        <input
            type={visible ? "text" : "password"}
            value={value}
            onChange={onChange}
            className={`${inputClass} pr-16`}
            placeholder="••••••••"
            required
        />
        <button
            type="button"
            onClick={onToggleVisible}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded px-2 py-1 text-xs font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
        >
            {visible ? "Hide" : "Show"}
        </button>
    </div>
);

const ErrorAlert = ({ message }) => (
    <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700">
        {message}
    </div>
);

const LoginForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await fetch("http://localhost:5001/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
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
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleLogin} className="space-y-4">
            <div>
                <label htmlFor="login-email" className={labelClass}>
                    Email
                </label>
                <input
                    id="login-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={inputClass}
                    placeholder="you@example.com"
                    required
                />
            </div>
            <div>
                <label htmlFor="login-password" className={labelClass}>
                    Password
                </label>
                <PasswordField
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    visible={passwordVisible}
                    onToggleVisible={() => setPasswordVisible(!passwordVisible)}
                />
            </div>
            {error && <ErrorAlert message={error} />}
            <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-emerald-600 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
                {loading ? "Signing in…" : "Sign in"}
            </button>
        </form>
    );
};

const RegisterForm = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await fetch("http://localhost:5001/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to register");
            }

            if (data.token) {
                localStorage.setItem("token", data.token);
            }
            navigate("/dashboard");
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleRegister} className="space-y-4">
            <div>
                <label htmlFor="register-name" className={labelClass}>
                    Full name
                </label>
                <input
                    id="register-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={inputClass}
                    placeholder="Jane Doe"
                    required
                />
            </div>
            <div>
                <label htmlFor="register-email" className={labelClass}>
                    Email
                </label>
                <input
                    id="register-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={inputClass}
                    placeholder="you@example.com"
                    required
                />
            </div>
            <div>
                <label htmlFor="register-password" className={labelClass}>
                    Password
                </label>
                <PasswordField
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    visible={passwordVisible}
                    onToggleVisible={() => setPasswordVisible(!passwordVisible)}
                />
            </div>
            {error && <ErrorAlert message={error} />}
            <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-emerald-600 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
                {loading ? "Creating account…" : "Create account"}
            </button>
        </form>
    );
};

const features = [
    {
        title: "Track income & expenses",
        description: "Log every transaction and see your balance update in real time.",
        icon: (
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        ),
    },
    {
        title: "Visualize spending",
        description: "Charts break down categories and monthly trends at a glance.",
        icon: (
            <path strokeLinecap="round" strokeLinejoin="round" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
        ),
    },
    {
        title: "Stay organized",
        description: "Search and filter transactions whenever you need details.",
        icon: (
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        ),
    },
];

const LandingPage = () => {
    const [isLogin, setIsLogin] = useState(true);

    return (
        <div className="min-h-[calc(100vh-65px)] bg-slate-50">
            <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-10 sm:px-6 lg:flex-row lg:items-center lg:gap-16 lg:py-16 lg:px-8">
                <div className="flex-1 text-center lg:text-left">
                    <p className="text-sm font-semibold uppercase tracking-wide text-emerald-600">
                        Personal finance
                    </p>
                    <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
                        Take control of your money
                    </h1>
                    <p className="mx-auto mt-4 max-w-lg text-base text-slate-600 lg:mx-0">
                        Finance Tracker helps you monitor income, manage expenses, and understand
                        where your money goes — all in one clean dashboard.
                    </p>

                    <ul className="mt-10 hidden space-y-5 lg:block">
                        {features.map(({ title, description, icon }) => (
                            <li key={title} className="flex gap-4">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        {icon}
                                    </svg>
                                </div>
                                <div>
                                    <p className="font-semibold text-slate-900">{title}</p>
                                    <p className="mt-0.5 text-sm text-slate-500">{description}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="w-full max-w-md shrink-0 lg:max-w-[420px]">
                    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg shadow-slate-200/50">
                        <div className="border-b border-slate-100 bg-slate-50/80 p-1">
                            <div className="grid grid-cols-2 gap-1">
                                <button
                                    type="button"
                                    onClick={() => setIsLogin(true)}
                                    className={`rounded-lg py-2.5 text-sm font-semibold transition ${
                                        isLogin
                                            ? "bg-white text-slate-900 shadow-sm"
                                            : "text-slate-500 hover:text-slate-700"
                                    }`}
                                >
                                    Sign in
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsLogin(false)}
                                    className={`rounded-lg py-2.5 text-sm font-semibold transition ${
                                        !isLogin
                                            ? "bg-white text-slate-900 shadow-sm"
                                            : "text-slate-500 hover:text-slate-700"
                                    }`}
                                >
                                    Register
                                </button>
                            </div>
                        </div>

                        <div className="p-6 sm:p-8">
                            <h2 className="text-lg font-semibold text-slate-900">
                                {isLogin ? "Welcome back" : "Create your account"}
                            </h2>
                            <p className="mt-1 text-sm text-slate-500">
                                {isLogin
                                    ? "Enter your credentials to access your dashboard."
                                    : "Sign up to start tracking your finances today."}
                            </p>
                            <div className="mt-6">
                                {isLogin ? <LoginForm /> : <RegisterForm />}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;
