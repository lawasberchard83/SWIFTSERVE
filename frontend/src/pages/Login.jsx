import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            // Query Supabase for the user with matching email and password
            const { data, error: dbError } = await supabase
                .from('users')
                .select('*')
                .eq('username', email)
                .eq('password', password)
                .single();

            if (dbError || !data) {
                setError('Invalid email or password');
            } else {
                localStorage.setItem('isAuthenticated', 'true');
                localStorage.setItem('userEmail', data.email);
                localStorage.setItem('userName', data.full_name);
                navigate('/dashboard');
            }
        } catch (err) {
            setError('Cannot connect to the server');
        } finally {
            setIsLoading(false);
        }
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

                    {error && (
                        <div style={{ padding: '10px', backgroundColor: '#ffebee', color: '#c62828', marginBottom: '15px', borderRadius: '4px', border: '1px solid #ef9a9a' }}>
                            {error}
                        </div>
                    )}

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
                        <button type="submit" className="btn btn-primary w-full" style={{ marginTop: '10px' }} disabled={isLoading}>
                            {isLoading ? 'Logging in...' : 'Login'}
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
