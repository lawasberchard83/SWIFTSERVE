import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Simulate login
        navigate('/dashboard');
    };

    return (
        <div className="auth-container flex w-full">
            <div className="auth-left login-bg">
                <div className="auth-logo">SWIFTSERVE</div>
                <div className="auth-welcome">WELCOME BACK !</div>
            </div>
            <div className="auth-right">
                <div className="auth-form-container">
                    <h1 className="auth-title">LOGIN</h1>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label">Email address</label>
                            <input
                                type="email"
                                className="form-input"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Password</label>
                            <input
                                type="password"
                                className="form-input"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-primary w-full" style={{ marginTop: '10px' }}>
                            Login
                        </button>
                    </form>
                    <div className="form-text">
                        Don't have an account? <Link to="/register" className="form-link">Register</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
