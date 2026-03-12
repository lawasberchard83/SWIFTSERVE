import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [error, setError] = useState(null);
    const [fieldErrors, setFieldErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [touched, setTouched] = useState({});

    const handleBlur = (field) => {
        setTouched({ ...touched, [field]: true });
    };

    const validateFields = () => {
        const errors = {};
        if (!email.trim()) errors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(email)) errors.email = 'Enter a valid email address';
        if (!password) errors.password = 'Password is required';
        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        const errors = validateFields();
        setFieldErrors(errors);
        setTouched({ email: true, password: true });

        if (Object.keys(errors).length > 0) {
            setError('Please fix the highlighted errors below.');
            return;
        }

        setIsLoading(true);

        try {
            const { data, error: dbError } = await supabase
                .from('users')
                .select('*')
                .eq('username', email)
                .eq('password', password)
                .single();

            if (dbError || !data) {
                setError('Invalid email or password');
                setFieldErrors({ email: ' ', password: ' ' });
            } else {
                localStorage.setItem('isAuthenticated', 'true');
                localStorage.setItem('userEmail', data.email);
                localStorage.setItem('userName', data.full_name);
                localStorage.setItem('userRole', data.role || 'customer');

                // Redirect based on role
                if (data.role === 'admin') {
                    navigate('/admin');
                } else {
                    navigate('/dashboard');
                }
            }
        } catch (err) {
            setError('Cannot connect to the server');
        } finally {
            setIsLoading(false);
        }
    };

    const inputStyle = (fieldName) => ({
        border: fieldErrors[fieldName] && touched[fieldName] ? '2px solid #e53935' : undefined,
        backgroundColor: fieldErrors[fieldName] && touched[fieldName] ? '#fff5f5' : undefined,
    });

    const fieldErrorStyle = {
        color: '#e53935',
        fontSize: '12px',
        marginTop: '4px',
        fontWeight: '500',
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

                    <form onSubmit={handleSubmit} noValidate>
                        <div className="form-group">
                            <label className="form-label">Email address</label>
                            <input
                                type="email"
                                className="form-input"
                                style={inputStyle('email')}
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    if (fieldErrors.email) setFieldErrors({ ...fieldErrors, email: '' });
                                }}
                                onBlur={() => handleBlur('email')}
                            />
                            {fieldErrors.email && fieldErrors.email.trim() && touched.email && <div style={fieldErrorStyle}>{fieldErrors.email}</div>}
                        </div>
                        <div className="form-group">
                            <label className="form-label">Password</label>
                            <input
                                type="password"
                                className="form-input"
                                style={inputStyle('password')}
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    if (fieldErrors.password) setFieldErrors({ ...fieldErrors, password: '' });
                                }}
                                onBlur={() => handleBlur('password')}
                            />
                            {fieldErrors.password && fieldErrors.password.trim() && touched.password && <div style={fieldErrorStyle}>{fieldErrors.password}</div>}
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
